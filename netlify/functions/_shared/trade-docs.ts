import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getStore } from '@netlify/blobs';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, StandardFonts, rgb, type PDFFont } from 'pdf-lib';

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
    description:
      'For launching your own branded range: gel supplied filled in standard 10 ml bottles or 30 g jars, ready to label and sell. Prices per kg and per bottle, from 25 pieces per colour (1,000 bottles minimum in total).',
  },
  {
    slot: 'bulk-pricelist',
    title: '2026 Private Label Bulk Pricelist (50 kg)',
    description:
      'For brands and distributors who fill their own bottles: gel supplied by the kilo in bulk containers. Prices per kg, minimum 50 kg per order in total.',
  },
  {
    slot: 'bottle-guide',
    title: 'Private Label Bottle Guide',
    description:
      'Read this before choosing your packaging: bottle and cap options, how your clients will tell shades and base/top coats apart, minimum quantities and extra costs.',
  },
  {
    slot: 'catalogue',
    title: 'Leeukopf Laboratories Catalogue 2026',
    description:
      'Our complete range at a glance: gel polishes, rubber bases, builder gels, polygels, top coats and nail art, with shade charts and packaging options.',
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

export function documentsEmailHtml(link: string, intro: string, slots?: readonly TradeDocSlot[]): string {
  const docs = TRADE_DOCS.filter((d) => !slots || slots.includes(d.slot));
  return `
<p>${intro}</p>
<p>Your private Leeukopf trade documents are ready to download:</p>
<ul>
${docs.map((d) => `  <li>${d.title}</li>`).join('\n')}
</ul>
<p><a href="${link}" style="display:inline-block;background:#111;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:600">Download your trade documents</a></p>
<p style="color:#666;font-size:13px">This link is personal to you and stays active for ${ACCESS_TOKEN_DAYS} days. Please do not forward it.</p>
`;
}

// ── Download stamping ──────────────────────────────────────────────────────
// Every PDF a client downloads carries a line naming who it was issued to, so a
// forwarded copy can always be traced back. Stamped copies are cached per client
// and per document version, so repeat downloads are instant.

export const stampedDocPath = (email: string, slot: TradeDocSlot, version: string) =>
  `stamped/${createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0, 24)}/${slot}-${version.replace(/[^0-9A-Za-z]/g, '')}.pdf`;

const CYRILLIC: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
  о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sht', ъ: 'a', ь: 'y',
  ю: 'yu', я: 'ya', ы: 'y', э: 'e', ё: 'yo', є: 'ye', і: 'i', ї: 'yi',
};

/** Keeps text printable with the embedded font (e.g. transliterates Bulgarian company names). */
function printable(text: string, font: PDFFont): string {
  const supported = new Set(font.getCharacterSet());
  return [...text]
    .map((ch) => {
      if (supported.has(ch.codePointAt(0)!)) return ch;
      const lower = ch.toLowerCase();
      if (CYRILLIC[lower] !== undefined) {
        const t = CYRILLIC[lower];
        return ch === lower ? t : t.charAt(0).toUpperCase() + t.slice(1);
      }
      const base = ch.normalize('NFD').replace(/[̀-ͯ]/g, '');
      return base && [...base].every((c) => supported.has(c.codePointAt(0)!)) ? base : '?';
    })
    .join('');
}

async function stampFont(pdf: PDFDocument): Promise<PDFFont> {
  const fontPath = join(process.cwd(), 'netlify/functions/assets/pf-futura-neu-book.ttf');
  if (existsSync(fontPath)) {
    try {
      pdf.registerFontkit(fontkit);
      return await pdf.embedFont(readFileSync(fontPath), { subset: true });
    } catch (err) {
      console.warn('trade-docs: custom font failed, using Helvetica', err instanceof Error ? err.message : err);
    }
  }
  return pdf.embedFont(StandardFonts.Helvetica);
}

export async function stampPdf(original: Uint8Array, recipient: { company: string | null; email: string }): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(original, { ignoreEncryption: true, updateMetadata: false });
  const font = await stampFont(pdf);
  const issued = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const who = recipient.company ? `${recipient.company} (${recipient.email})` : recipient.email;
  const text = printable(`Confidential  ·  Issued to ${who} on ${issued}  ·  Not for distribution`, font);

  for (const page of pdf.getPages()) {
    const { width } = page.getSize();
    let size = 7;
    while (size > 4 && font.widthOfTextAtSize(text, size) > width - 24) size -= 0.5;
    const textWidth = font.widthOfTextAtSize(text, size);
    const x = Math.max(12, (width - textWidth) / 2);
    page.drawRectangle({ x: x - 6, y: 4, width: textWidth + 12, height: size + 6, color: rgb(1, 1, 1), opacity: 0.8 });
    page.drawText(text, { x, y: 7, size, font, color: rgb(0.25, 0.25, 0.25) });
  }

  pdf.setSubject(`Issued to ${recipient.email}`);
  pdf.setKeywords(['Leeukopf Laboratories', 'confidential', recipient.email]);
  return pdf.save();
}

// ── Download log (Netlify Blobs) ───────────────────────────────────────────

export interface DownloadRecord {
  at: string;
  email: string;
  company: string | null;
  slot: TradeDocSlot;
  title: string;
  via: 'link' | 'portal';
}

const downloadStore = () => getStore({ name: 'trade-docs-downloads', consistency: 'strong' });

/** Keys sort newest first. */
const downloadKey = () => `d/${String(9_999_999_999_999 - Date.now()).padStart(13, '0')}-${randomBytes(4).toString('hex')}`;

export async function logDownload(record: DownloadRecord): Promise<void> {
  await downloadStore().setJSON(downloadKey(), record);
}

export async function listDownloads(limit = 150): Promise<DownloadRecord[]> {
  const store = downloadStore();
  const { blobs } = await store.list({ prefix: 'd/' });
  const keys = blobs.map((b) => b.key).sort().slice(0, limit);
  const records = await Promise.all(keys.map((k) => store.get(k, { type: 'json' }) as Promise<DownloadRecord | null>));
  return records.filter((r): r is DownloadRecord => Boolean(r));
}

// ── Document access approvals (Netlify Blobs) ──────────────────────────────
// A registered client can only open the documents once Leeukopf has approved them.
// Revoking removes the record, which also disables any link already sent.

export interface DocsApproval {
  email: string;
  company: string | null;
  /** Documents this client may see. Missing (older approvals) means all documents. */
  slots?: TradeDocSlot[];
  approvedAt: string;
  approvedBy: string;
  lastEmailedAt: string | null;
}

const approvalStore = () => getStore({ name: 'trade-docs-approvals', consistency: 'strong' });
const approvalKey = (email: string) =>
  `a/${createHash('sha256').update(email.trim().toLowerCase()).digest('hex').slice(0, 40)}`;

export async function getDocsApproval(email: string): Promise<DocsApproval | null> {
  return (await approvalStore().get(approvalKey(email), { type: 'json' })) as DocsApproval | null;
}

export async function saveDocsApproval(approval: DocsApproval): Promise<void> {
  await approvalStore().setJSON(approvalKey(approval.email), { ...approval, email: approval.email.trim().toLowerCase() });
}

export async function revokeDocsApproval(email: string): Promise<void> {
  await approvalStore().delete(approvalKey(email));
}

export async function listDocsApprovals(): Promise<DocsApproval[]> {
  const store = approvalStore();
  const { blobs } = await store.list({ prefix: 'a/' });
  const rows = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' }) as Promise<DocsApproval | null>));
  return rows.filter((r): r is DocsApproval => Boolean(r));
}

/** Sends the client their personal documents link. Returns an error message if the email service refused it. */
/** The documents an approval gives access to. */
export const allowedSlots = (approval: Pick<DocsApproval, 'slots'> | null | undefined): TradeDocSlot[] =>
  approval?.slots ? approval.slots.filter(isTradeDocSlot) : TRADE_DOCS.map((d) => d.slot);

/** Cleans a list of slots from a request; returns null if it isn't a valid non-empty list. */
export function parseSlots(value: unknown): TradeDocSlot[] | null {
  if (!Array.isArray(value)) return null;
  const slots = TRADE_DOCS.map((d) => d.slot).filter((slot) => value.includes(slot));
  return slots.length > 0 ? slots : null;
}

export async function sendDocumentsLink(email: string, intro: string, slots?: readonly TradeDocSlot[]): Promise<string | null> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return 'Email service is not configured (RESEND_API_KEY missing).';
  const { Resend } = await import('resend');
  const { error } = await new Resend(resendApiKey).emails.send({
    from: 'Leeukopf Laboratories <info@leeukopf.com>',
    to: email,
    subject: 'Your Leeukopf pricelists and guides',
    html: documentsEmailHtml(documentsPageUrl(createAccessToken(email)), intro, slots),
  });
  return error ? error.message || 'The email service rejected the message.' : null;
}
