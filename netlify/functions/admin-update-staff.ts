/**
 * Performs staff management actions. Only callable by the owner (ADMIN_APPROVER_EMAILS).
 *
 * Supported actions:
 *  - reset_password   : Sets a new password for a staff member's Supabase auth account.
 *  - update_permissions : Replaces the permissions JSONB for a staff member.
 *  - toggle_active    : Flips is_active for a staff member (deactivate / reactivate).
 *  - delete           : Removes a staff member from admin_staff (does NOT delete the auth user).
 */
import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const config = {
  path: '/api/admin-update-staff',
};

type Action = 'reset_password' | 'update_permissions' | 'toggle_active' | 'delete';

interface RequestPayload {
  action: Action;
  staffId: string;            // admin_staff.id (UUID)
  newPassword?: string;       // for reset_password
  permissions?: Record<string, boolean>; // for update_permissions
}

function getAllowedOrigin(requestOrigin: string | undefined): string {
  const allowedOrigins = [
    'https://leeukopf.com',
    'https://www.leeukopf.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ];
  if (requestOrigin && (allowedOrigins.includes(requestOrigin) || requestOrigin.endsWith('.netlify.app'))) {
    return requestOrigin;
  }
  return 'https://leeukopf.com';
}

function getCorsHeaders(origin: string | undefined): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': getAllowedOrigin(origin),
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
    'Content-Type': 'application/json',
  };
}

function getBearerToken(authHeader: string | undefined): string {
  if (!authHeader) return '';
  const trimmed = authHeader.trim();
  return trimmed.toLowerCase().startsWith('bearer ') ? trimmed.slice(7).trim() : trimmed;
}

export const handler: Handler = async (event) => {
  const headers = getCorsHeaders(event.headers.origin);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, message: 'Method Not Allowed' }) };
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Server configuration error.' }) };
  }

  const token = getBearerToken(event.headers.authorization || event.headers.Authorization);
  if (!token) {
    return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Missing authorization token.' }) };
  }

  const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

  // Verify caller
  const { data: authData, error: authError } = await adminSupabase.auth.getUser(token);
  if (authError || !authData.user?.email) {
    return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Invalid or expired session.' }) };
  }

  const requesterEmail = authData.user.email.toLowerCase().trim();
  const approvedOwnerEmails = (process.env.ADMIN_APPROVER_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!approvedOwnerEmails.includes(requesterEmail)) {
    return { statusCode: 403, headers, body: JSON.stringify({ success: false, message: 'Only the account owner can manage staff.' }) };
  }

  if (!event.body) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Missing request body.' }) };
  }

  let payload: RequestPayload;
  try {
    payload = JSON.parse(event.body) as RequestPayload;
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid JSON body.' }) };
  }

  const { action, staffId } = payload;

  if (!action || !staffId) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'action and staffId are required.' }) };
  }

  // Fetch the staff record first
  const { data: staffRow, error: fetchError } = await adminSupabase
    .from('admin_staff')
    .select('id, email, user_id, is_active')
    .eq('id', staffId)
    .maybeSingle();

  if (fetchError || !staffRow) {
    return { statusCode: 404, headers, body: JSON.stringify({ success: false, message: 'Staff member not found.' }) };
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  if (action === 'reset_password') {
    const newPassword = (payload.newPassword || '').trim();
    if (newPassword.length < 8) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'New password must be at least 8 characters.' }) };
    }

    // Find Supabase auth user by email
    const { data: userList, error: listError } = await adminSupabase.auth.admin.listUsers();
    if (listError) {
      return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Failed to look up auth users.' }) };
    }

    const authUser = userList.users.find(
      (u) => u.email?.toLowerCase() === (staffRow.email as string).toLowerCase()
    );

    if (!authUser) {
      return { statusCode: 404, headers, body: JSON.stringify({ success: false, message: 'No auth account found for this staff member. Add them via the Add Staff form first.' }) };
    }

    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(authUser.id, {
      password: newPassword,
    });

    if (updateError) {
      return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: `Failed to reset password: ${updateError.message}` }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: `Password updated for ${staffRow.email as string}.` }) };
  }

  if (action === 'update_permissions') {
    if (!payload.permissions || typeof payload.permissions !== 'object') {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'permissions object is required.' }) };
    }

    const { error: updateError } = await adminSupabase
      .from('admin_staff')
      .update({ permissions: payload.permissions })
      .eq('id', staffId);

    if (updateError) {
      return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: `Failed to update permissions: ${updateError.message}` }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Permissions updated.' }) };
  }

  if (action === 'toggle_active') {
    const newActive = !(staffRow.is_active as boolean);

    const { error: updateError } = await adminSupabase
      .from('admin_staff')
      .update({ is_active: newActive })
      .eq('id', staffId);

    if (updateError) {
      return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: `Failed to toggle active status: ${updateError.message}` }) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: `Staff member ${newActive ? 'reactivated' : 'deactivated'}.`, is_active: newActive }),
    };
  }

  if (action === 'delete') {
    const { error: deleteError } = await adminSupabase
      .from('admin_staff')
      .delete()
      .eq('id', staffId);

    if (deleteError) {
      return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: `Failed to remove staff member: ${deleteError.message}` }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Staff member removed.' }) };
  }

  return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: `Unknown action: ${action as string}` }) };
};
