/**
 * Verifies whether the authenticated user is an authorised admin or staff member.
 *
 * Priority:
 *  1. If the user's email is in ADMIN_APPROVER_EMAILS → owner (full access, manage_staff included)
 *  2. Otherwise, look up admin_staff table → if found and active → staff with stored permissions
 *  3. Otherwise → unauthorised
 *
 * This keeps ADMIN_APPROVER_EMAILS entirely server-side and avoids exposing it to the browser.
 */
import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const config = {
  path: '/api/admin-verify-admin',
};

export interface AdminPermissions {
  view_clients: boolean;
  approve_registrations: boolean;
  view_orders: boolean;
  view_prices: boolean;
  manage_products: boolean;
  manage_colors: boolean;
  manage_brochures: boolean;
}

const OWNER_PERMISSIONS: AdminPermissions = {
  view_clients: true,
  approve_registrations: true,
  view_orders: true,
  view_prices: true,
  manage_products: true,
  manage_colors: true,
  manage_brochures: true,
};

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
    return { statusCode: 405, headers, body: JSON.stringify({ authorized: false, message: 'Method Not Allowed' }) };
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ authorized: false, message: 'Server configuration error.' }) };
  }

  const token = getBearerToken(event.headers.authorization || event.headers.Authorization);
  if (!token) {
    return { statusCode: 401, headers, body: JSON.stringify({ authorized: false, message: 'Missing authorization token.' }) };
  }

  const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

  // Verify the JWT
  const { data: authData, error: authError } = await adminSupabase.auth.getUser(token);
  if (authError || !authData.user?.email) {
    return { statusCode: 401, headers, body: JSON.stringify({ authorized: false, message: 'Invalid or expired session.' }) };
  }

  const email = authData.user.email.toLowerCase().trim();

  // 1. Check ADMIN_APPROVER_EMAILS (owner tier)
  const approvedOwnerEmails = (process.env.ADMIN_APPROVER_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (approvedOwnerEmails.includes(email)) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        authorized: true,
        role: 'owner',
        fullName: authData.user.user_metadata?.full_name as string | undefined,
        permissions: OWNER_PERMISSIONS,
      }),
    };
  }

  // 2. Check admin_staff table
  const { data: staffRow, error: staffError } = await adminSupabase
    .from('admin_staff')
    .select('role, full_name, permissions, is_active')
    .eq('email', email)
    .maybeSingle();

  if (staffError) {
    console.error('[admin-verify-admin] DB error:', staffError.message);
    return { statusCode: 500, headers, body: JSON.stringify({ authorized: false, message: 'Database error during authorisation.' }) };
  }

  if (!staffRow || !staffRow.is_active) {
    return { statusCode: 403, headers, body: JSON.stringify({ authorized: false, message: 'Access not granted. Contact the account owner.' }) };
  }

  const permissions: AdminPermissions = {
    view_clients: Boolean((staffRow.permissions as AdminPermissions)?.view_clients),
    approve_registrations: Boolean((staffRow.permissions as AdminPermissions)?.approve_registrations),
    view_orders: Boolean((staffRow.permissions as AdminPermissions)?.view_orders),
    view_prices: Boolean((staffRow.permissions as AdminPermissions)?.view_prices),
    manage_products: Boolean((staffRow.permissions as AdminPermissions)?.manage_products),
    manage_colors: Boolean((staffRow.permissions as AdminPermissions)?.manage_colors),
    manage_brochures: Boolean((staffRow.permissions as AdminPermissions)?.manage_brochures),
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      authorized: true,
      role: staffRow.role as 'owner' | 'staff',
      fullName: staffRow.full_name as string | undefined,
      permissions,
    }),
  };
};
