import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const config = {
  path: '/api/admin-create-admin',
};

type CreateAdminPayload = {
  email?: string;
  password?: string;
  fullName?: string;
  permissions?: Record<string, boolean>;
  addToStaff?: boolean; // default true — registers user in admin_staff with given permissions
};

const DEFAULT_STAFF_PERMISSIONS = {
  view_clients: true,
  approve_registrations: true,
  view_orders: true,
  view_prices: false,
  manage_products: false,
  manage_colors: false,
  manage_brochures: false,
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
  const array = new Uint32Array(length);
  globalThis.crypto.getRandomValues(array);

  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += chars[array[i] % chars.length];
  }

  return result;
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
      body: JSON.stringify({ success: false, message: 'Forbidden: account is not allowed to create admin users.' }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, message: 'Missing request body.' }),
    };
  }

  let payload: CreateAdminPayload;
  try {
    payload = JSON.parse(event.body) as CreateAdminPayload;
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
      body: JSON.stringify({ success: false, message: 'A valid admin email is required.' }),
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

  // Resolve final permissions — caller can override defaults
  const resolvedPermissions =
    payload.permissions && typeof payload.permissions === 'object'
      ? payload.permissions
      : DEFAULT_STAFF_PERMISSIONS;

  const fullName = (payload.fullName || '').trim() || undefined;
  const addToStaff = payload.addToStaff !== false; // default true

  // Attempt to create the auth user
  const { data: createdUserData, error: createError } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: 'admin',
      full_name: fullName,
      createdBy: requesterEmail,
      createdAt: new Date().toISOString(),
    },
  });

  if (createError) {
    const lowered = createError.message.toLowerCase();
    if (lowered.includes('already') && lowered.includes('registered')) {
      // User already exists — if addToStaff, upsert their admin_staff record anyway
      if (addToStaff) {
        await adminSupabase.from('admin_staff').upsert(
          {
            email,
            full_name: fullName,
            role: 'staff',
            permissions: resolvedPermissions,
            is_active: true,
            created_by: requesterEmail,
          },
          { onConflict: 'email', ignoreDuplicates: false }
        );
      }
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'An account already exists for this email. Staff record updated with new permissions.',
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: `Failed to create admin account: ${createError.message}` }),
    };
  }

  const createdUserId = createdUserData.user?.id ?? null;

  // Register in admin_staff so ProtectedRoute can verify their access
  if (addToStaff) {
    const { error: staffError } = await adminSupabase.from('admin_staff').upsert(
      {
        user_id: createdUserId,
        email,
        full_name: fullName,
        role: 'staff',
        permissions: resolvedPermissions,
        is_active: true,
        created_by: requesterEmail,
      },
      { onConflict: 'email', ignoreDuplicates: false }
    );

    if (staffError) {
      // Auth user was created; log but don't fail — owner can re-save permissions from Staff tab
      console.error('[admin-create-admin] Failed to register in admin_staff:', staffError.message);
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: `Staff account created for ${email}. Share credentials securely.`,
      data: {
        id: createdUserId,
        email,
        temporaryPassword: password,
      },
    }),
  };
};
