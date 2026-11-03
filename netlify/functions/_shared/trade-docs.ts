import { createHmac, timingSafeEqual } from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Trade documents (pricelists, bottle guide, catalogue) shown only to registered clients.
 *
 * - Files live in a PRIVATE Supabase Storage bucket. They are never part of the site build
 *   (this repo is public), and are only reachable through short-lived signed URLs.
 * - Access is granted with a signed token issued at registration time (no login needed),
 *   or to signed-in approved portal clients / staff.
 */

export const TRADE_DOCS_BUCKET = 'trade-documents';

export const TRADE_DOCS = [
  {
    slot: 'pl-international-pricelist',
    title: '2026 PL International Pricelist',
    description: 'Bottled private label pricing — 1 kg to 10 kg+ per colour, MOQ 1,000 bottles.',
  },
  {
    slot: 'bulk-pricelist',
    title: '2026 Private Label Bulk Pricelist (50 kg)',
    description: 'Bulk pricing per kg — total order MOQ 50 kg.',
  },
  {
    slot: 'bottle-guide',
    title: 'Private Label Bottle Guide',
    description: 'Bottle options, colour identification, MOQs and our recommendations.',
  },
  {
    slot: 'catalogue',
    title: 'Leeukopf Laboratories Catalogue 2026',
    description: 'Full product range, shades and packaging options.',
  },
] as const;

export type TradeDocSlot = (typeof TRADE_DOCS)[number]['slot'];

export const isTradeDocSlot = (value: unknown): value is TradeDocSlot =>
  typeof value === 'string' && TRADE_DOCS.some((d) => d.slot === value);

export const tradeDocPath = (slot: TradeDocSlot) => `${slot}.pdf`;

/** How long a registration access link stays valid. */
export const ACCESS_TOKEN_DAYS = 60;

/** Signed URL lifetime for an individual PDF download. */
export const SIGNED_URL_SECONDS = 10 * 60;

function signingSecret(): string {
  const secret = process.env.TRADE_DOCS_SIGNING_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!secret) throw new Error('TRADE_DOCS_SIGNING_SECRET is not configured.');
  return secret;
}

const b64url = (input: Buffer | string) =>
  Buffer.from(input).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

const fromB64url = (input: string) => Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

const sign = (payload: string) => b64url(createHmac('sha256', signingSecret()).update(`trade-docs:${payload}`).digest());

export function createAccessToken(email: string, days = ACCESS_TOKEN_DAYS): string {
  const payload = b64url(
    JSON.stringify({ e: email.trim().toLowerCase(), x: Math.floor(Date.now() / 1000) + days * 24 * 60 * 60 }),
  );
  return `${payload}.${sign(payload)}`;
}

/** Returns the registered email the token was issued to, or null if invalid / expired. */
export function verifyAccessToken(token: string | null | undefined): string | null {
  if (!token || typeof token !== 'string') return null;
  const [payload, signature] = token.trim().split('.');
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  try {
    const data = JSON.parse(fromB64url(payload).toString('utf8')) as { e?: string; x?: number };
    if (!data.e || !data.x || data.x * 1000 < Date.now()) return null;
    return data.e;
  } catch {
    return null;
  }
}

export function siteOrigin(): string {
  return (process.env.VITE_SITE_URL || process.env.URL || 'https://leeukopf.com').replace(/\/+$/, '');
}

export const documentsPageUrl = (token: string) => `${siteOrigin()}/trade-documents?access=${encodeURIComponent(token)}`;

/** Creates the private bucket on first use. Safe to call repeatedly. */
export async function ensureTradeDocsBucket(admin: SupabaseClient): Promise<void> {
  const { data } = await admin.storage.getBucket(TRADE_DOCS_BUCKET);
  if (data) {
    if (data.public) await admin.storage.updateBucket(TRADE_DOCS_BUCKET, { public: false });
    return;
  }
  const { error } = await admin.storage.createBucket(TRADE_DOCS_BUCKET, {
    public: false,
    allowedMimeTypes: ['application/pdf'],
    fileSizeLimit: '50MB',
  });
  if (error && !/already exists/i.test(error.message)) throw error;
}

export function documentsEmailHtml(link: string, intro: string): string {
  return `
<p>${intro}</p>
<p>Your private Leeukopf trade documents are ready to download:</p>
<ul>
${TRADE_DOCS.map((d) => `  <li>${d.title}</li>`).join('\n')}
</ul>
<p><a href="${link}" style="display:inline-block;background:#111;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:600">Download your trade documents</a></p>
<p style="color:#666;font-size:13px">This link is personal to you and stays active for ${ACCESS_TOKEN_DAYS} days. Please do not forward it.</p>
`;
}
