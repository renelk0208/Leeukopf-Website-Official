import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

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
const CRM_COMMENT_RECIPIENTS = ['acc1.leeukopf@gmail.com', 'leeukopf@gmail.com'];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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
    // Not an owner — check admin_staff table for approve_registrations permission
    const { data: staffRow } = await adminSupabase
      .from('admin_staff')
      .select('permissions, is_active')
      .eq('email', requesterEmail)
      .maybeSingle();

    const staffPermissions = staffRow?.permissions as Record<string, boolean> | null;
    if (!staffRow?.is_active || !staffPermissions?.approve_registrations) {
      return { statusCode: 403, headers, body: JSON.stringify({ success: false, message: 'Forbidden.' }) };
    }
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

  const { data: registration, error: registrationError } = await adminSupabase
    .from('client_registrations')
    .select('company, contact, email, pipeline_stage, admin_notes, samples_sent_at, last_contact_date')
    .eq('id', id)
    .maybeSingle();

  if (registrationError || !registration) {
    const detail = registrationError?.message || 'Registration not found.';
    return { statusCode: 404, headers, body: JSON.stringify({ success: false, message: detail }) };
  }

  const nextAdminNotes = safeUpdate.admin_notes;
  const commentChanged = typeof nextAdminNotes === 'string'
    && nextAdminNotes.trim() !== ''
    && nextAdminNotes.trim() !== (registration.admin_notes || '').trim();
  const resendApiKey = process.env.RESEND_API_KEY;

  if (commentChanged && !resendApiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'CRM comment was not saved because email notifications are not configured.',
      }),
    };
  }

  const { error } = await adminSupabase
    .from('client_registrations')
    .update(safeUpdate)
    .eq('id', id);

  if (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: `Update failed: ${error.message}` }) };
  }

  if (commentChanged && resendApiKey) {
    const resend = new Resend(resendApiKey);
    const comment = String(nextAdminNotes).trim();
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@leeukopf.com';
    const { error: emailError } = await resend.emails.send({
      from: `Leeukopf CRM <${fromEmail}>`,
      to: CRM_COMMENT_RECIPIENTS,
      subject: `CRM comment updated: ${registration.company}`,
      html: `
        <h2>CRM comment updated</h2>
        <p><strong>Company:</strong> ${escapeHtml(registration.company || 'Unknown')}</p>
        <p><strong>Contact:</strong> ${escapeHtml(registration.contact || 'Unknown')}</p>
        <p><strong>Client email:</strong> ${escapeHtml(registration.email || 'Unknown')}</p>
        <p><strong>Updated by:</strong> ${escapeHtml(requesterEmail)}</p>
        <h3>Admin comment</h3>
        <p style="white-space:pre-wrap">${escapeHtml(comment)}</p>
      `,
    });

    if (emailError) {
      const rollbackUpdate: Partial<Record<AllowedField, unknown>> = {};
      for (const field of ALLOWED_FIELDS) {
        if (field in safeUpdate) rollbackUpdate[field] = registration[field] ?? null;
      }
      const { error: rollbackError } = await adminSupabase
        .from('client_registrations')
        .update(rollbackUpdate)
        .eq('id', id);
      const rollbackMessage = rollbackError
        ? ' The comment save could not be rolled back; contact an administrator.'
        : ' The CRM changes were rolled back and were not saved.';

      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          success: false,
          message: `Comment email could not be sent to both recipients.${rollbackMessage}`,
        }),
      };
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: commentChanged ? 'CRM record saved and comment emailed to both recipients.' : 'CRM record saved.',
    }),
  };
};
