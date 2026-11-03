import type { Handler } from '@netlify/functions';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import {
  SIGNED_URL_SECONDS,
  TRADE_DOCS,
  TRADE_DOCS_BUCKET,
  createAccessToken,
  documentsEmailHtml,
  documentsPageUrl,
  tradeDocPath,
  verifyAccessToken,
} from './_shared/trade-docs';

/**
 * Registered clients' trade documents.
 *
 * GET  ?access=<token>                 → list of available PDFs with short-lived download links
 * GET  Authorization: Bearer <jwt>     → same, for signed-in approved portal clients / staff
 * POST { email }                       → emails a fresh access link IF that email is registered
 *                                        (always answers the same way, so it can't be used to
 *                                        discover who is registered)
 */

function corsHeaders(origin: string | undefined): Record<string, string> {
  const allowed = ['https://leeukopf.com', 'https://www.leeukopf.com', 'http://localhost:5173', 'http://localhost:5174'];
  const ok = origin && (allowed.includes(origin) || origin.endsWith('.netlify.app'));
  return {
    'Access-Control-Allow-Origin': ok ? origin! : 'https://leeukopf.com',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow',
    Vary: 'Origin',
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function emailFromPortalSession(admin: SupabaseClient, authHeader: string): Promise<string | null> {
  const token = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) return null;
  const { data, error } = await admin.auth.getUser(token);
  const email = data.user?.email?.trim().toLowerCase();
  if (error || !email) return null;

  const owners = (process.env.ADMIN_APPROVER_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (owners.includes(email)) return email;

  const [{ data: approved }, { data: staff }] = await Promise.all([
    admin.from('approved_clients').select('email').ilike('email', email).maybeSingle(),
    admin.from('admin_staff').select('is_active').eq('email', email).eq('is_active', true).maybeSingle(),
  ]);
  return approved || staff ? email : null;
}

async function isRegistered(admin: SupabaseClient, email: string): Promise<boolean> {
  const [{ data: reg }, { data: approved }] = await Promise.all([
    admin.from('client_registrations').select('id').ilike('email', email).limit(1),
    admin.from('approved_clients').select('email').ilike('email', email).maybeSingle(),
  ]);
  return Boolean((reg && reg.length > 0) || approved);
}

export const handler: Handler = async (event) => {
  const headers = corsHeaders(event.headers.origin);
  const reply = (statusCode: number, body: Record<string, unknown>) => ({ statusCode, headers, body: JSON.stringify(body) });

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '{}' };

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return reply(500, { success: false, message: 'Document service is not configured.' });
  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  // ── Re-send my access link ────────────────────────────────────────────────
  if (event.httpMethod === 'POST') {
    let email = '';
    try {
      email = String(JSON.parse(event.body || '{}').email || '').trim().toLowerCase();
    } catch {
      return reply(400, { success: false, message: 'Invalid request.' });
    }
    if (!EMAIL_RE.test(email)) return reply(400, { success: false, message: 'Please enter a valid email address.' });

    try {
      if (await isRegistered(admin, email)) {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) throw new Error('RESEND_API_KEY is not set');
        const { error: sendError } = await new Resend(resendApiKey).emails.send({
          from: 'Leeukopf Laboratories <info@leeukopf.com>',
          to: email,
          subject: 'Your Leeukopf trade documents',
          html: documentsEmailHtml(documentsPageUrl(createAccessToken(email)), 'Here is your new access link, as requested.'),
        });
        if (sendError) throw new Error(sendError.message);
      }
    } catch (err) {
      console.error('trade-documents: resend link failed', err instanceof Error ? err.message : err);
    }
    return reply(200, {
      success: true,
      message: 'If this email is registered with us, a download link is on its way. Please check your inbox (and spam folder).',
    });
  }

  if (event.httpMethod !== 'GET') return reply(405, { success: false, message: 'Method Not Allowed' });

  // ── List documents ────────────────────────────────────────────────────────
  const accessToken = event.queryStringParameters?.access || '';
  const authHeader = (event.headers.authorization || event.headers.Authorization || '').trim();

  const email = verifyAccessToken(accessToken) ?? (authHeader ? await emailFromPortalSession(admin, authHeader) : null);
  if (!email) {
    return reply(401, { success: false, code: 'no_access', message: 'This link is invalid or has expired.' });
  }

  const { data: files, error: listError } = await admin.storage.from(TRADE_DOCS_BUCKET).list('', { limit: 100 });
  if (listError && !/not found/i.test(listError.message)) {
    console.error('trade-documents: list failed', listError.message);
    return reply(500, { success: false, message: 'Documents are temporarily unavailable. Please try again shortly.' });
  }
  const stored = new Map((files ?? []).map((f) => [f.name, f]));

  const documents = await Promise.all(
    TRADE_DOCS.map(async (doc) => {
      const file = stored.get(tradeDocPath(doc.slot));
      if (!file) return null;
      const { data } = await admin.storage
        .from(TRADE_DOCS_BUCKET)
        .createSignedUrl(tradeDocPath(doc.slot), SIGNED_URL_SECONDS, { download: `Leeukopf - ${doc.title}.pdf` });
      if (!data?.signedUrl) return null;
      return {
        slot: doc.slot,
        title: doc.title,
        description: doc.description,
        url: data.signedUrl,
        updatedAt: file.updated_at ?? file.created_at ?? null,
        sizeBytes: (file.metadata as { size?: number } | null)?.size ?? null,
      };
    }),
  );

  console.log(`trade-documents: access by ${email}`);
  return reply(200, { success: true, email, documents: documents.filter(Boolean) });
};
