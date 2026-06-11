import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

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

function buildWelcomeEmail(recipientName: string | undefined, recipientEmail: string, password: string, isExisting: boolean): string {
  const name = recipientName || recipientEmail;
  const loginUrl = 'https://leeukopf.com/login';
  const notice = isExisting
    ? '<p style="color:#f59e0b">Note: your Leeukopf account already existed. Your original password is unchanged — use that to log in, or ask the owner to reset it for you from the Staff tab.</p>'
    : `<p><strong>Password:</strong> <code style="background:#1e293b;color:#a78bfa;padding:2px 6px;border-radius:4px;font-size:15px">${password}</code></p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155">
        <tr><td style="background:linear-gradient(135deg,#7c3aed,#4338ca);padding:32px 40px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700">Leeukopf Laboratories</h1>
          <p style="margin:6px 0 0;color:#c4b5fd;font-size:14px">Admin Portal Access</p>
        </td></tr>
        <tr><td style="padding:32px 40px;color:#e2e8f0">
          <p style="font-size:16px">Hi ${name},</p>
          <p>You have been added as a staff member on the Leeukopf admin portal. Use the details below to log in.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:8px;border:1px solid #334155;padding:20px;margin:20px 0">
            <tr><td><p style="margin:0 0 8px"><strong>Login URL:</strong> <a href="${loginUrl}" style="color:#818cf8">${loginUrl}</a></p>
            <p style="margin:0 0 8px"><strong>Email:</strong> ${recipientEmail}</p>
            ${notice}
            </td></tr>
          </table>
          <p style="color:#94a3b8;font-size:13px">Keep these credentials safe. You can change your password after logging in.</p>
          <p style="margin-top:32px">Kind regards,<br><strong>Leeukopf Laboratories</strong></p>
        </td></tr>
        <tr><td style="padding:16px 40px;border-top:1px solid #334155;text-align:center">
          <p style="margin:0;font-size:12px;color:#475569">&copy; ${new Date().getFullYear()} Leeukopf Laboratories. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
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
      // User already exists in Supabase Auth — look up their user_id so we can link it
      const { data: existingUser } = await adminSupabase.auth.admin.listUsers();
      const foundUser = existingUser?.users?.find((u) => u.email?.toLowerCase() === email);

      if (addToStaff) {
        const { error: upsertError } = await adminSupabase.from('admin_staff').upsert(
          {
            user_id: foundUser?.id ?? null,
            email,
            full_name: fullName,
            role: 'staff',
            permissions: resolvedPermissions,
            is_active: true,
            created_by: requesterEmail,
          },
          { onConflict: 'email', ignoreDuplicates: false }
        );
        if (upsertError) {
          console.error('[admin-create-admin] Failed to upsert existing user into admin_staff:', upsertError.message);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: 'Account exists but failed to grant staff access. Try again.' }),
          };
        }
      }
      // Send welcome email (existing account — password unchanged)
      const resendKeyForExisting = process.env.RESEND_API_KEY;
      if (resendKeyForExisting) {
        try {
          const resend = new Resend(resendKeyForExisting);
          await resend.emails.send({
            from: 'Leeukopf Laboratories <noreply@leeukopf.com>',
            to: email,
            subject: 'Your Leeukopf Admin Access',
            html: buildWelcomeEmail(fullName, email, '', true),
          });
        } catch (emailErr) {
          console.error('[admin-create-admin] Failed to send welcome email (existing user):', emailErr);
        }
      }

      // Treat as success — the staff record was created/updated, which is the goal
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: `Staff access granted for ${email}. (Account already existed — existing login credentials apply.) A welcome email has been sent.`,
          data: { id: foundUser?.id ?? null, email },
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

  // Send welcome email with credentials
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: 'Leeukopf Laboratories <noreply@leeukopf.com>',
        to: email,
        subject: 'Your Leeukopf Admin Access',
        html: buildWelcomeEmail(fullName, email, password, false),
      });
    } catch (emailErr) {
      console.error('[admin-create-admin] Failed to send welcome email:', emailErr);
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: `Staff account created for ${email}. A welcome email with login details has been sent.`,
      data: {
        id: createdUserId,
        email,
        temporaryPassword: password,
      },
    }),
  };
};
