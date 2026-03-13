import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const config = {
  path: '/api/admin-update-registration',
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
  if (trimmed.toLowerCase().startsWith('bearer ')) return trimmed.slice(7).trim();
  return trimmed;
}

const VALID_PIPELINE_STAGES = [
  'new', 'contacted', 'samples_sent', 'feedback', 'negotiating', 'approved', 'rejected', 'on_hold',
];

const ALLOWED_FIELDS = ['pipeline_stage', 'admin_notes', 'samples_sent_at', 'last_contact_date'] as const;
type AllowedField = typeof ALLOWED_FIELDS[number];

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
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Supabase not configured.' }) };
  }

  const token = getBearerToken(event.headers.authorization || event.headers.Authorization);
  if (!token) {
    return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Missing authorization token.' }) };
  }

  const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: authData, error: authError } = await adminSupabase.auth.getUser(token);
  if (authError || !authData.user?.email) {
    return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Unauthorized.' }) };
  }

  const requesterEmail = authData.user.email.trim().toLowerCase();
  const approvedAdminList = (process.env.ADMIN_APPROVER_EMAILS || '')
    .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);

  if (approvedAdminList.length > 0 && !approvedAdminList.includes(requesterEmail)) {
    return { statusCode: 403, headers, body: JSON.stringify({ success: false, message: 'Forbidden.' }) };
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid JSON.' }) };
  }

  const { id, ...updates } = body;
  if (!id || typeof id !== 'string') {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Missing registration id.' }) };
  }

  if (updates.pipeline_stage !== undefined && updates.pipeline_stage !== null) {
    if (!VALID_PIPELINE_STAGES.includes(String(updates.pipeline_stage))) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid pipeline_stage value.' }) };
    }
  }

  const safeUpdate: Partial<Record<AllowedField, unknown>> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in updates) {
      safeUpdate[field] = updates[field] === '' ? null : updates[field];
    }
  }

  if (Object.keys(safeUpdate).length === 0) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'No valid fields to update.' }) };
  }

  const { error } = await adminSupabase
    .from('client_registrations')
    .update(safeUpdate)
    .eq('id', id);

  if (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: `Update failed: ${error.message}` }) };
  }

  return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
};
