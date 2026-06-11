import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

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
  return `${fallbackOrigin}/portal/set-password`;
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
    // Not an owner — check admin_staff table for approve_registrations permission
    const { data: staffRow } = await adminSupabase
      .from('admin_staff')
      .select('permissions, is_active')
      .eq('email', requesterEmail)
      .maybeSingle();

    const staffPermissions = staffRow?.permissions as Record<string, boolean> | null;
    if (!staffRow?.is_active || !staffPermissions?.approve_registrations) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ success: false, message: 'Forbidden: account is not allowed to send invites.' }),
      };
    }
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
      // Account already exists — generate a magic link and send an approval email
      // via Resend so the client is notified and can log in immediately.
      const portalOrigin = getAllowedOrigin(event.headers.origin);
      const portalUrl = `${portalOrigin}/portal`;

      let magicLink = portalUrl;
      const { data: linkData } = await adminSupabase.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: { redirectTo: portalUrl },
      });
      if (linkData?.properties?.action_link) {
        magicLink = linkData.properties.action_link;
      }

      const resendApiKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@leeukopf.com';
      let emailSent = false;

      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        const companyName = payload.company?.trim() || email;
        const contactName = payload.contact?.trim() || '';
        const greeting = contactName ? `Hi ${contactName},` : 'Hello,';

        const { error: emailError } = await resend.emails.send({
          from: `Leeukopf Laboratories <${fromEmail}>`,
          to: [email],
          subject: 'Your Leeukopf B2B Portal Access Has Been Approved',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
              <div style="background:#9b1c6a;padding:24px 32px;">
                <h1 style="color:#fff;margin:0;font-size:22px;">Leeukopf Laboratories</h1>
                <p style="color:#f3d1e8;margin:6px 0 0;font-size:14px;">B2B Portal Access Approved</p>
              </div>
              <div style="padding:32px;">
                <p style="font-size:16px;">${greeting}</p>
                <p>Your B2B portal registration for <strong>${companyName}</strong> has been <strong>approved</strong>.</p>
                <p>You can now access the Leeukopf client portal to browse products and place orders.</p>
                <div style="margin:28px 0;text-align:center;">
                  <a href="${magicLink}"
                     style="background:#9b1c6a;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">
                    Access Your Portal
                  </a>
                </div>
                <p style="font-size:13px;color:#666;">This sign-in link expires in 24 hours. After it expires, visit <a href="${portalUrl}/login">${portalUrl}/login</a> to sign in with your password, or use "Forgot password?" to reset it.</p>
                <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
                <p style="font-size:12px;color:#999;">Leeukopf Laboratories &bull; B2B Trade Portal</p>
              </div>
            </div>
          `,
        });
        emailSent = !emailError;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          invited: false,
          alreadyRegistered: true,
          loginUrl: `${portalOrigin}/portal/login`,
          message: emailSent
            ? `Client approved. Approval email with sign-in link sent to ${email}.`
            : `Client approved. Account already existed but approval email could not be sent (RESEND_API_KEY missing). Share the portal link manually: ${portalUrl}/login`,
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
