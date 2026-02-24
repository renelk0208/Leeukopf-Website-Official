import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const config = {
  path: '/api/admin-client-access-reset',
};

type ClientAccessPayload = {
  email?: string;
  password?: string;
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

function generateTemporaryPassword(length = 14): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
  const random = new Uint32Array(length);
  globalThis.crypto.getRandomValues(random);

  let password = '';
  for (let i = 0; i < length; i += 1) {
    password += chars[random[i] % chars.length];
  }

  return password;
}

async function findUserByEmail(
  adminSupabase: ReturnType<typeof createClient>,
  email: string,
): Promise<{ id: string; email: string } | null> {
  const perPage = 200;

  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await adminSupabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new Error(`Failed to list users: ${error.message}`);
    }

    const users = data?.users ?? [];
    const found = users.find((user) => normalizeEmail(user.email || '') === email);
    if (found?.id) {
      return { id: found.id, email: found.email || email };
    }

    if (users.length < perPage) break;
  }

  return null;
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
      body: JSON.stringify({ success: false, message: 'Forbidden: account is not allowed to manage client access.' }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, message: 'Missing request body.' }),
    };
  }

  let payload: ClientAccessPayload;
  try {
    payload = JSON.parse(event.body) as ClientAccessPayload;
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

  const providedPassword = (payload.password || '').trim();
  const password = providedPassword || generateTemporaryPassword();

  if (password.length < 8) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, message: 'Password must be at least 8 characters.' }),
    };
  }

  try {
    const existingUser = await findUserByEmail(adminSupabase, email);

    if (existingUser) {
      const { error: updateError } = await adminSupabase.auth.admin.updateUserById(existingUser.id, {
        password,
        email_confirm: true,
        user_metadata: {
          role: 'client',
          accessUpdatedBy: requesterEmail,
          accessUpdatedAt: new Date().toISOString(),
        },
      });

      if (updateError) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ success: false, message: `Failed to reset client password: ${updateError.message}` }),
        };
      }
    } else {
      const { error: createError } = await adminSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: 'client',
          createdBy: requesterEmail,
          createdAt: new Date().toISOString(),
        },
      });

      if (createError) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ success: false, message: `Failed to create client access: ${createError.message}` }),
        };
      }
    }

    await adminSupabase
      .from('approved_clients')
      .upsert(
        {
          email,
          notes: `Access reset (no email) by ${requesterEmail}`,
          invited_at: new Date().toISOString(),
        },
        { onConflict: 'email' },
      );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Client access is ready for ${email}. Share temporary password securely.`,
        data: {
          email,
          temporaryPassword: password,
        },
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update client access.',
      }),
    };
  }
};
