import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { asModernFunction } from './_shared/lambda-adapter';
import {
  TRADE_DOCS,
  TRADE_DOCS_BUCKET,
  ensureTradeDocsBucket,
  isTradeDocSlot,
  listDownloads,
  tradeDocPath,
} from './_shared/trade-docs';

/**
 * Admin portal → "Trade documents": upload / replace / remove the PDFs registered clients download.
 * Access: owners in ADMIN_APPROVER_EMAILS, or active staff with the manage_brochures permission.
 *
 * GET              → status of each document slot + recent client downloads
 * POST { slot }    → one-time signed upload URL (browser uploads the PDF straight to storage,
 *                    so large catalogues don't hit the function size limit)
 * DELETE ?slot=…   → remove a document
 */

function corsHeaders(origin: string | undefined): Record<string, string> {
  const allowed = ['https://leeukopf.com', 'https://www.leeukopf.com', 'http://localhost:5173', 'http://localhost:5174'];
  const ok = origin && (allowed.includes(origin) || origin.endsWith('.netlify.app'));
  return {
    'Access-Control-Allow-Origin': ok ? origin! : 'https://leeukopf.com',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  };
}

export const lambdaHandler: Handler = async (event) => {
  const headers = corsHeaders(event.headers.origin);
  const reply = (statusCode: number, body: Record<string, unknown>) => ({ statusCode, headers, body: JSON.stringify(body) });

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '{}' };

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return reply(500, { success: false, message: 'Supabase environment is not fully configured.' });

  const auth = (event.headers.authorization || event.headers.Authorization || '').trim();
  const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : auth;
  if (!token) return reply(401, { success: false, message: 'Missing authorization token.' });

  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  if (authError || !authData.user?.email) return reply(401, { success: false, message: 'Unauthorized admin session.' });

  const email = authData.user.email.trim().toLowerCase();
  const owners = (process.env.ADMIN_APPROVER_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!owners.includes(email)) {
    const { data: staff } = await admin.from('admin_staff').select('permissions, is_active').eq('email', email).maybeSingle();
    const perms = staff?.permissions as Record<string, boolean> | null;
    if (!staff?.is_active || !perms?.manage_brochures) {
      return reply(403, { success: false, message: 'Forbidden: account is not allowed to manage trade documents.' });
    }
  }

  try {
    await ensureTradeDocsBucket(admin);
    const bucket = admin.storage.from(TRADE_DOCS_BUCKET);

    if (event.httpMethod === 'GET') {
      const { data: files, error } = await bucket.list('', { limit: 100 });
      if (error) throw error;
      const stored = new Map((files ?? []).map((f) => [f.name, f]));
      const downloads = await listDownloads().catch((err) => {
        console.error('admin-trade-documents: could not list downloads', err instanceof Error ? err.message : err);
        return [];
      });
      return reply(200, {
        success: true,
        downloads,
        documents: TRADE_DOCS.map((doc) => {
          const file = stored.get(tradeDocPath(doc.slot));
          return {
            ...doc,
            uploaded: Boolean(file),
            updatedAt: file ? (file.updated_at ?? file.created_at ?? null) : null,
            sizeBytes: file ? ((file.metadata as { size?: number } | null)?.size ?? null) : null,
          };
        }),
      });
    }

    if (event.httpMethod === 'POST') {
      const slot = JSON.parse(event.body || '{}').slot;
      if (!isTradeDocSlot(slot)) return reply(400, { success: false, message: 'Unknown document.' });
      const { data, error } = await bucket.createSignedUploadUrl(tradeDocPath(slot), { upsert: true });
      if (error || !data) throw error ?? new Error('Could not create upload URL');
      console.log(`admin-trade-documents: ${email} uploading ${slot}`);
      return reply(200, { success: true, path: data.path, token: data.token });
    }

    if (event.httpMethod === 'DELETE') {
      const slot = event.queryStringParameters?.slot;
      if (!isTradeDocSlot(slot)) return reply(400, { success: false, message: 'Unknown document.' });
      const { error } = await bucket.remove([tradeDocPath(slot)]);
      if (error) throw error;
      console.log(`admin-trade-documents: ${email} removed ${slot}`);
      return reply(200, { success: true });
    }

    return reply(405, { success: false, message: 'Method Not Allowed' });
  } catch (err) {
    console.error('admin-trade-documents failed', err instanceof Error ? err.message : err);
    return reply(500, { success: false, message: err instanceof Error ? err.message : 'Unexpected error' });
  }
};

export default asModernFunction(lambdaHandler);
