/**
 * Lists all admin staff members. Only callable by the owner (ADMIN_APPROVER_EMAILS).
 * Uses the service-role key so it bypasses RLS and sees all rows.
 */
import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const config = {
  path: '/api/admin-list-staff',
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

  const { data: staffList, error: dbError } = await adminSupabase
    .from('admin_staff')
    .select('id, email, full_name, role, permissions, is_active, created_at, created_by')
    .order('created_at', { ascending: true });

  if (dbError) {
    console.error('[admin-list-staff] DB error:', dbError.message);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Failed to load staff list.' }) };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, data: staffList ?? [] }),
  };
};
