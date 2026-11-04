import type { Handler } from '@netlify/functions';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { asModernFunction } from './_shared/lambda-adapter';
import {
  SIGNED_URL_SECONDS,
  TRADE_DOCS,
  TRADE_DOCS_BUCKET,
  allowedSlots,
  getDocsApproval,
  isTradeDocSlot,
  logDownload,
  sendDocumentsLink,
  stampPdf,
  stampedDocPath,
  tradeDocPath,
  verifyAccessToken,
  type TradeDocSlot,
} from './_shared/trade-docs';

/**
 * Registered clients' trade documents.
 *
 * Only clients approved in Admin → Trade Documents (or approved portal clients / staff) get in.
 *
 * GET  ?access=<token>                         → list of available documents
 * GET  Authorization: Bearer <jwt>             → same, for signed-in approved portal clients / staff
 * POST { action: 'download', slot, access? }   → PDF stamped with the client's name, as a short-lived link;
 *                                                the download is recorded for the admin portal
 * POST { email }                               → emails a fresh access link IF that email is approved
 *                                                (same answer either way, so it can't reveal who is registered)
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

type Viewer = { email: string; via: 'link' | 'portal'; slots: TradeDocSlot[] };

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

async function identify(admin: SupabaseClient, accessToken: string, authHeader: string): Promise<Viewer | null> {
  const fromLink = verifyAccessToken(accessToken);
  // The link must still belong to an approved client — revoking access disables links already sent.
  if (fromLink) {
    const approval = await getDocsApproval(fromLink);
    if (approval) return { email: fromLink, via: 'link', slots: allowedSlots(approval) };
  }
  const fromPortal = authHeader ? await emailFromPortalSession(admin, authHeader) : null;
  if (!fromPortal) return null;
  // Signed-in portal clients see what they were approved for; without a document approval, everything.
  return { email: fromPortal, via: 'portal', slots: allowedSlots(await getDocsApproval(fromPortal)) };
}

async function companyFor(admin: SupabaseClient, email: string): Promise<string | null> {
  const { data: reg } = await admin
    .from('client_registrations')
    .select('company')
    .ilike('email', email)
    .order('created_at', { ascending: false })
    .limit(1);
  const fromRegistration = reg?.[0]?.company?.trim();
  if (fromRegistration) return fromRegistration;
  const { data: approved } = await admin.from('approved_clients').select('company').ilike('email', email).maybeSingle();
  return approved?.company?.trim() || null;
}

export const lambdaHandler: Handler = async (event) => {
  const headers = corsHeaders(event.headers.origin);
  const reply = (statusCode: number, body: Record<string, unknown>) => ({ statusCode, headers, body: JSON.stringify(body) });

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '{}' };

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return reply(500, { success: false, message: 'Document service is not configured.' });
  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const bucket = admin.storage.from(TRADE_DOCS_BUCKET);
  const authHeader = (event.headers.authorization || event.headers.Authorization || '').trim();

  let body: Record<string, unknown> = {};
  if (event.httpMethod === 'POST') {
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return reply(400, { success: false, message: 'Invalid request.' });
    }
  }

  // ── Stamped download ──────────────────────────────────────────────────────
  if (event.httpMethod === 'POST' && body.action === 'download') {
    const viewer = await identify(admin, String(body.access || ''), authHeader);
    if (!viewer) return reply(401, { success: false, code: 'no_access', message: 'This link is invalid or has expired.' });
    const slot = body.slot;
    if (!isTradeDocSlot(slot)) return reply(400, { success: false, message: 'Unknown document.' });
    if (!viewer.slots.includes(slot)) return reply(403, { success: false, message: 'This document is not available to you.' });
    const doc = TRADE_DOCS.find((d) => d.slot === slot)!;

    try {
      const { data: files } = await bucket.list('', { search: tradeDocPath(slot) });
      const original = files?.find((f) => f.name === tradeDocPath(slot));
      if (!original) return reply(404, { success: false, message: 'This document is not available right now.' });

      const version = original.updated_at || original.created_at || 'v1';
      const stampedPath = stampedDocPath(viewer.email, slot, version);
      const company = await companyFor(admin, viewer.email);

      const existing = await bucket.createSignedUrl(stampedPath, SIGNED_URL_SECONDS, { download: `Leeukopf - ${doc.title}.pdf` });
      let url = existing.data?.signedUrl ?? null;

      if (!url) {
        const { data: blob, error: downloadError } = await bucket.download(tradeDocPath(slot));
        if (downloadError || !blob) throw downloadError ?? new Error('Could not read the original document');
        const stamped = await stampPdf(new Uint8Array(await blob.arrayBuffer()), { company, email: viewer.email });
        const { error: uploadError } = await bucket.upload(stampedPath, stamped, { contentType: 'application/pdf', upsert: true });
        if (uploadError) throw uploadError;
        const fresh = await bucket.createSignedUrl(stampedPath, SIGNED_URL_SECONDS, { download: `Leeukopf - ${doc.title}.pdf` });
        url = fresh.data?.signedUrl ?? null;
        if (!url) throw fresh.error ?? new Error('Could not create download link');
      }

      try {
        await logDownload({ at: new Date().toISOString(), email: viewer.email, company, slot, title: doc.title, via: viewer.via });
      } catch (logErr) {
        console.error('trade-documents: could not record download', logErr instanceof Error ? logErr.message : logErr);
      }
      console.log(`trade-documents: ${viewer.email} downloaded ${slot}`);
      return reply(200, { success: true, url });
    } catch (err) {
      console.error('trade-documents: download failed', err instanceof Error ? err.message : err);
      return reply(500, { success: false, message: 'The download could not be prepared. Please try again.' });
    }
  }

  // ── Re-send my access link ────────────────────────────────────────────────
  if (event.httpMethod === 'POST') {
    const email = String(body.email || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return reply(400, { success: false, message: 'Please enter a valid email address.' });

    try {
      const approval = await getDocsApproval(email);
      if (approval) {
        const sendError = await sendDocumentsLink(email, 'Here is your new access link, as requested.', allowedSlots(approval));
        if (sendError) throw new Error(sendError);
      }
    } catch (err) {
      console.error('trade-documents: resend link failed', err instanceof Error ? err.message : err);
    }
    return reply(200, {
      success: true,
      message:
        'If this email has been approved for access, a download link is on its way. Please check your inbox (and spam folder).',
    });
  }

  if (event.httpMethod !== 'GET') return reply(405, { success: false, message: 'Method Not Allowed' });

  // ── List documents ────────────────────────────────────────────────────────
  const viewer = await identify(admin, event.queryStringParameters?.access || '', authHeader);
  if (!viewer) return reply(401, { success: false, code: 'no_access', message: 'This link is invalid or has expired.' });

  const { data: files, error: listError } = await bucket.list('', { limit: 100 });
  if (listError && !/not found/i.test(listError.message)) {
    console.error('trade-documents: list failed', listError.message);
    return reply(500, { success: false, message: 'Documents are temporarily unavailable. Please try again shortly.' });
  }
  const stored = new Map((files ?? []).map((f) => [f.name, f]));

  const documents = TRADE_DOCS.filter((doc) => viewer.slots.includes(doc.slot)).flatMap((doc) => {
    const file = stored.get(tradeDocPath(doc.slot));
    if (!file) return [];
    return [
      {
        slot: doc.slot,
        title: doc.title,
        description: doc.description,
        updatedAt: file.updated_at ?? file.created_at ?? null,
        sizeBytes: (file.metadata as { size?: number } | null)?.size ?? null,
      },
    ];
  });

  return reply(200, { success: true, email: viewer.email, documents });
};

export default asModernFunction(lambdaHandler);
