import type { Handler } from '@netlify/functions';
import { Resend } from 'resend';
import {
  BF_CATEGORIES,
  BF_COLOURS,
  BF_LEAD_TIME,
  BF_MIN_TOTAL_KG,
} from '../../src/data/blackFridayOffer';

/**
 * Black Friday 2026 bulk order — public, no payment.
 *
 * 1. Validates the order and recalculates every price on the server.
 * 2. Emails the order to the factory (leeukopf@gmail.com + acc1.leeukopf@gmail.com)
 *    so accounts can raise the Zoho invoice (paid by bank TT).
 * 3. Emails an order confirmation to the customer.
 *
 * Env: RESEND_API_KEY, RESEND_FROM_EMAIL (already used by the site).
 * Optional: BLACK_FRIDAY_ORDER_EMAILS — comma-separated override for the factory inbox.
 *
 * ON / OFF SWITCH (Netlify → Site configuration → Environment variables, then redeploy):
 *   BLACK_FRIDAY_ENABLED = false    → offer closed: page shows "offer has ended", orders refused.
 *   BLACK_FRIDAY_ENDS_AT = 2026-12-01T00:00:00+02:00   (optional) → closes automatically at that moment.
 *   Remove the variable or set it to true to switch the offer back on.
 */

function offerStatus(): { enabled: boolean; endsAt: string | null } {
  const flag = (process.env.BLACK_FRIDAY_ENABLED ?? '').trim().toLowerCase();
  const switchedOff = ['false', 'off', '0', 'no'].includes(flag);
  const endsRaw = (process.env.BLACK_FRIDAY_ENDS_AT ?? '').trim();
  const endsAt = endsRaw && !Number.isNaN(Date.parse(endsRaw)) ? new Date(endsRaw).toISOString() : null;
  const expired = endsAt !== null && Date.now() >= Date.parse(endsAt);
  return { enabled: !switchedOff && !expired, endsAt };
}

const DEFAULT_FACTORY_EMAILS = ['leeukopf@gmail.com', 'acc1.leeukopf@gmail.com'];
const MAX_KG_PER_LINE = 999;

const ALLOWED_ORIGINS = ['https://leeukopf.com', 'https://www.leeukopf.com'];

interface ClientIn {
  companyName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  country?: string;
  vat?: string;
  invoiceAddress?: string;
  invoiceCity?: string;
  invoicePostalCode?: string;
  sameAddress?: boolean;
  shippingAddress?: string;
  shippingCity?: string;
  shippingPostalCode?: string;
  notes?: string;
}

interface Body {
  client?: ClientIn;
  lines?: Array<{ code?: string; kg?: number }>;
  website?: string; // honeypot
}

const str = (v: unknown, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const eur = (n: number) => `€${n.toFixed(2)}`;
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function corsHeaders(origin?: string): Record<string, string> {
  const ok = origin && (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.netlify.app') || origin.startsWith('http://localhost'));
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ok ? origin! : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export const handler: Handler = async (event) => {
  const headers = corsHeaders(event.headers.origin || event.headers.Origin);
  const reply = (statusCode: number, body: Record<string, unknown>) => ({ statusCode, headers, body: JSON.stringify(body) });

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  const status = offerStatus();
  if (event.httpMethod === 'GET') return reply(200, { success: true, ...status });
  if (event.httpMethod !== 'POST') return reply(405, { success: false, message: 'Method not allowed' });
  if (!status.enabled) {
    return reply(410, { success: false, offerClosed: true, message: 'The Black Friday offer has ended. Please contact info@leeukopf.com.' });
  }

  let body: Body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return reply(400, { success: false, message: 'Invalid request.' });
  }

  // Bots fill the hidden field — pretend success, send nothing.
  if (str(body.website)) return reply(200, { success: true, orderId: `BF-${Date.now()}` });

  const c = body.client ?? {};
  const client = {
    companyName: str(c.companyName),
    contactName: str(c.contactName),
    email: str(c.email, 200).toLowerCase(),
    phone: str(c.phone, 60),
    country: str(c.country, 80),
    vat: str(c.vat, 60),
    invoiceAddress: str(c.invoiceAddress),
    invoiceCity: str(c.invoiceCity, 120),
    invoicePostalCode: str(c.invoicePostalCode, 30),
    sameAddress: c.sameAddress !== false,
    shippingAddress: str(c.shippingAddress),
    shippingCity: str(c.shippingCity, 120),
    shippingPostalCode: str(c.shippingPostalCode, 30),
    notes: str(c.notes, 2000),
  };

  const required: Array<[keyof typeof client, string]> = [
    ['companyName', 'company name'],
    ['contactName', 'contact name'],
    ['email', 'email'],
    ['phone', 'phone'],
    ['country', 'country'],
    ['invoiceAddress', 'invoice address'],
    ['invoiceCity', 'city / region'],
    ['invoicePostalCode', 'postal code'],
  ];
  if (!client.sameAddress) {
    required.push(['shippingAddress', 'shipping address'], ['shippingCity', 'shipping city'], ['shippingPostalCode', 'shipping postal code']);
  }
  const missing = required.filter(([k]) => !client[k]).map(([, label]) => label);
  if (missing.length) return reply(400, { success: false, message: `Please fill in: ${missing.join(', ')}.` });
  if (!isEmail(client.email)) return reply(400, { success: false, message: 'Please enter a valid email address.' });

  // Rebuild lines from the server-side price list; merge duplicates.
  const qty = new Map<string, number>();
  for (const l of body.lines ?? []) {
    const code = str(l?.code, 20);
    const kg = Number(l?.kg);
    if (!BF_COLOURS.some((x) => x.code === code)) return reply(400, { success: false, message: `Unknown colour code: ${code}.` });
    if (!Number.isInteger(kg) || kg < 1 || kg > MAX_KG_PER_LINE) return reply(400, { success: false, message: `Invalid quantity for ${code}.` });
    qty.set(code, (qty.get(code) ?? 0) + kg);
  }
  const lines = BF_COLOURS.filter((x) => qty.has(x.code)).map((x) => {
    const kg = qty.get(x.code)!;
    const price = BF_CATEGORIES[x.category].pricePerKg;
    return { code: x.code, category: BF_CATEGORIES[x.category].label, kg, price, total: kg * price };
  });
  const totalKg = lines.reduce((s, l) => s + l.kg, 0);
  const totalEur = lines.reduce((s, l) => s + l.total, 0);

  if (!lines.length) return reply(400, { success: false, message: 'Your order is empty.' });
  if (totalKg < BF_MIN_TOTAL_KG) {
    return reply(400, { success: false, message: `The minimum total order is ${BF_MIN_TOTAL_KG} kg (you have ${totalKg} kg).` });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || 'noreply@leeukopf.com';
  if (!apiKey) {
    console.error('[black-friday-order] RESEND_API_KEY is not set');
    return reply(500, { success: false, message: 'Ordering is temporarily unavailable. Please email info@leeukopf.com.' });
  }
  const factory = (process.env.BLACK_FRIDAY_ORDER_EMAILS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const factoryTo = factory.length ? factory : DEFAULT_FACTORY_EMAILS;

  const now = new Date();
  const stamp = now.toISOString().slice(0, 10).replace(/-/g, '');
  const orderId = `BF-${stamp}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  const ship = client.sameAddress
    ? { address: client.invoiceAddress, city: client.invoiceCity, postal: client.invoicePostalCode }
    : { address: client.shippingAddress, city: client.shippingCity, postal: client.shippingPostalCode };

  // ---------- Email bodies ----------
  const linesTableHtml = `
<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px">
  <thead><tr style="background:#231f20;color:#fff;text-align:left">
    <th>Colour</th><th>Category</th><th style="text-align:right">Qty (1 kg units)</th><th style="text-align:right">€/kg</th><th style="text-align:right">Line total</th>
  </tr></thead>
  <tbody>
    ${lines
      .map(
        (l) => `<tr style="border-bottom:1px solid #eee">
      <td><b>${esc(l.code)}</b></td><td>${esc(l.category)}</td><td style="text-align:right">${l.kg}</td>
      <td style="text-align:right">${eur(l.price)}</td><td style="text-align:right">${eur(l.total)}</td></tr>`
      )
      .join('')}
  </tbody>
  <tfoot>
    <tr><td colspan="2"><b>Total</b></td><td style="text-align:right"><b>${totalKg} kg</b></td><td></td><td style="text-align:right"><b>${eur(totalEur)}</b></td></tr>
  </tfoot>
</table>`;

  const linesText = lines.map((l) => `${l.code} (${l.category}) — ${l.kg} kg × ${eur(l.price)} = ${eur(l.total)}`).join('\n');

  const clientRowsHtml = [
    ['Company', client.companyName],
    ['Contact', client.contactName],
    ['Email', client.email],
    ['Phone', client.phone],
    ['Country', client.country],
    ['VAT', client.vat || '—'],
    ['Invoice address', `${client.invoiceAddress}, ${client.invoiceCity}, ${client.invoicePostalCode}`],
    ['Shipping address', client.sameAddress ? 'Same as invoice address' : `${ship.address}, ${ship.city}, ${ship.postal}`],
    ['Notes', client.notes || '—'],
  ]
    .map(([k, v]) => `<tr><td style="color:#777;padding:4px 12px 4px 0;vertical-align:top">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
    .join('');

  const factoryHtml = `
<div style="font-family:Arial,sans-serif;color:#111;max-width:720px">
  <h2 style="margin:0 0 4px">Black Friday order ${orderId}</h2>
  <p style="margin:0 0 18px;color:#555">${now.toUTCString()} · Placed on leeukopf.com/blackfriday · To invoice via Zoho, payment by bank TT</p>
  <table style="font-size:14px;margin-bottom:20px">${clientRowsHtml}</table>
  ${linesTableHtml}
  <p style="color:#555;font-size:13px">Prices from the Black Friday price list, before VAT and shipping. Lead time ${BF_LEAD_TIME}.</p>
</div>`;

  const factoryText = `Black Friday order ${orderId}
To invoice via Zoho — payment by bank TT.

Company: ${client.companyName}
Contact: ${client.contactName}
Email: ${client.email}
Phone: ${client.phone}
Country: ${client.country}
VAT: ${client.vat || '-'}
Invoice address: ${client.invoiceAddress}, ${client.invoiceCity}, ${client.invoicePostalCode}
Shipping address: ${client.sameAddress ? 'Same as invoice' : `${ship.address}, ${ship.city}, ${ship.postal}`}
Notes: ${client.notes || '-'}

${linesText}

Total: ${totalKg} kg — ${eur(totalEur)} (before VAT and shipping)
`;

  const customerHtml = `
<div style="font-family:Arial,sans-serif;color:#111;max-width:640px">
  <div style="background:#000;color:#fff;padding:28px 24px;text-align:center">
    <div style="font-size:26px;letter-spacing:1px">BLACK FRIDAY</div>
    <div style="font-size:20px;color:#da728e;font-weight:bold;letter-spacing:1px">ORDER CONFIRMATION</div>
  </div>
  <div style="padding:24px">
    <p>Dear ${esc(client.contactName)},</p>
    <p>Thank you for your Black Friday order with Leeukopf Laboratories. Your order reference is <b>${orderId}</b>.</p>
    ${linesTableHtml}
    <h3 style="margin:24px 0 8px">What happens next</h3>
    <ol style="padding-left:18px;line-height:1.7">
      <li>Our accounts team will email you an invoice for this order.</li>
      <li>Please pay the invoice by bank transfer (TT).</li>
      <li>Lead time is ${BF_LEAD_TIME}.</li>
    </ol>
    <p style="color:#555;font-size:13px">Prices shown are the Black Friday prices per kg. VAT and shipping, where applicable, are added on your invoice. Terms &amp; conditions apply.</p>
    <p>Questions? Reply to this email or write to <a href="mailto:info@leeukopf.com">info@leeukopf.com</a>.</p>
    <p>Leeukopf Laboratories<br><span style="color:#777">A proud Thermitek LTD partner brand</span></p>
  </div>
</div>`;

  const customerText = `Thank you for your Black Friday order with Leeukopf Laboratories.
Order reference: ${orderId}

${linesText}

Total: ${totalKg} kg — ${eur(totalEur)}

What happens next:
1. Our accounts team will email you an invoice for this order.
2. Please pay the invoice by bank transfer (TT).
3. Lead time is ${BF_LEAD_TIME}.

Prices are Black Friday prices per kg. VAT and shipping, where applicable, are added on your invoice.
Questions? Write to info@leeukopf.com.
`;

  const resend = new Resend(apiKey);
  try {
    // The factory email is the one that must arrive — fail the order if it doesn't.
    const factoryRes = await resend.emails.send({
      from: `Leeukopf Black Friday <${from}>`,
      to: factoryTo,
      replyTo: client.email,
      subject: `Black Friday order ${orderId} — ${client.companyName} — ${totalKg} kg — ${eur(totalEur)}`,
      html: factoryHtml,
      text: factoryText,
    });
    if (factoryRes.error) throw new Error(factoryRes.error.message);
  } catch (err) {
    console.error('[black-friday-order] factory email failed', err);
    return reply(502, { success: false, message: 'We could not send your order. Please try again or email info@leeukopf.com.' });
  }

  try {
    const custRes = await resend.emails.send({
      from: `Leeukopf Laboratories <${from}>`,
      to: client.email,
      replyTo: 'info@leeukopf.com',
      subject: `Your Leeukopf Black Friday order ${orderId}`,
      html: customerHtml,
      text: customerText,
    });
    if (custRes.error) console.error('[black-friday-order] customer email error', custRes.error);
  } catch (err) {
    // Order already reached the factory; don't fail the customer over the confirmation.
    console.error('[black-friday-order] customer email failed', err);
  }

  return reply(200, { success: true, orderId, totalKg, totalEur });
};
