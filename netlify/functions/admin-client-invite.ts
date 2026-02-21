import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const config = {
  path: '/api/admin-client-invite',
};

type InvitePayload = {
  email?: string;
  company?: string;
  contact?: string;
};

function getAllowedOrigin(requestOrigin: string | undefined): string {
  const allowedOrigins = [
    'https://leeukopf.com',
    'https://www.leeukopf.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ];

  if (
    requestOrigin &&
    (allowedOrigins.includes(requestOrigin) || requestOrigin.endsWith('.netlify.app'))
  ) {
    return requestOrigin;
  }

  return 'https://leeukopf.com';
}

function getCorsHeaders(origin: string | undefined): Record<string, string> {
  const allowedOrigin = getAllowedOrigin(origin);
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
    'Content-Type': 'application/json',
  };
}

function getBearerToken(authHeader: string | undefined): string {
  if (!authHeader) return '';
  const trimmed = authHeader.trim();
  if (trimmed.toLowerCase().startsWith('bearer ')) {
    return trimmed.slice(7).trim();
  }
  return trimmed;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getRedirectUrl(origin: string | undefined): string {
  const configured = process.env.CLIENT_PORTAL_REDIRECT_URL;
  if (configured && configured.trim()) return configured.trim();

  const fallbackOrigin = getAllowedOrigin(origin);
  return `${fallbackOrigin}/portal/login`;
}

export const handler: Handler = async (event) => {
  const headers = getCorsHeaders(event.headers.origin);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' }),
    };
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Supabase environment is not fully configured.' }),
    };
  }

  const token = getBearerToken(event.headers.authorization || event.headers.Authorization);
  if (!token) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ success: false, message: 'Missing authorization token.' }),
    };
  }

  const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: authData, error: authError } = await adminSupabase.auth.getUser(token);
  if (authError || !authData.user?.email) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        success: false,
        message: authError?.message ? `Unauthorized admin session: ${authError.message}` : 'Unauthorized admin session.',
      }),
    };
  }

  const requesterEmail = normalizeEmail(authData.user.email);
  const approvedAdminList = (process.env.ADMIN_APPROVER_EMAILS || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (approvedAdminList.length > 0 && !approvedAdminList.includes(requesterEmail)) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ success: false, message: 'Forbidden: account is not allowed to send invites.' }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, message: 'Missing request body.' }),
    };
  }

  let payload: InvitePayload;
  try {
    payload = JSON.parse(event.body) as InvitePayload;
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, message: 'Invalid JSON body.' }),
    };
  }

  const email = normalizeEmail(payload.email || '');
  if (!email || !isValidEmail(email)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, message: 'A valid client email is required.' }),
    };
  }

  const { error: upsertError } = await adminSupabase
    .from('approved_clients')
    .upsert(
      {
        email,
        company: payload.company?.trim() || null,
        notes: `Approved by ${requesterEmail}`,
        invited_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    );

  const approvedClientsTableMissing = Boolean(
    upsertError?.message?.toLowerCase().includes("could not find the table 'public.approved_clients'")
  );

  if (upsertError && !approvedClientsTableMissing) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: `Failed to approve client: ${upsertError.message}` }),
    };
  }

  const redirectTo = getRedirectUrl(event.headers.origin);
  const { error: inviteError } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
    redirectTo,
    data: {
      company: payload.company?.trim() || null,
      contact: payload.contact?.trim() || null,
      approvedBy: requesterEmail,
    },
  });

  if (inviteError) {
    const inviteErrorMessage = inviteError.message || '';
    const alreadyRegistered = inviteErrorMessage.toLowerCase().includes('already been registered');

    if (alreadyRegistered) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          invited: false,
          alreadyRegistered: true,
          loginUrl: `${getAllowedOrigin(event.headers.origin)}/portal/login`,
          message: `Client approved. This email already has an account, so no new invite email was sent. Ask them to sign in at /portal/login and use password reset if needed.`,
        }),
      };
    }

    const { data: linkData, error: linkError } = await adminSupabase.auth.admin.generateLink({
      type: 'invite',
      email,
      options: {
        redirectTo,
        data: {
          company: payload.company?.trim() || null,
          contact: payload.contact?.trim() || null,
          approvedBy: requesterEmail,
        },
      },
    });

    const manualInviteLink = linkData?.properties?.action_link;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        invited: false,
        inviteLink: manualInviteLink,
        message: manualInviteLink
          ? `Client approved, but invite email could not be sent automatically (${inviteErrorMessage}). Share this invite link manually: ${manualInviteLink}`
          : `Client approved, but invite email could not be sent automatically: ${inviteErrorMessage}${linkError?.message ? ` | Also failed to generate manual invite link: ${linkError.message}` : ''}`,
      }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      invited: true,
      message: approvedClientsTableMissing
        ? `Invitation email sent to ${email}, but approved_clients table is missing. Run the approved_clients migration to track approval status.`
        : `Client approved and invitation email sent to ${email}.`,
    }),
  };
};
