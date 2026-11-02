import type { Handler } from '@netlify/functions';
import { asModernFunction } from './_shared/lambda-adapter';
import { Resend } from 'resend';
import { BF_CATEGORIES, BF_COLOURS } from '../../src/data/blackFridayOffer';
import {
  type Basket,
  type ContactInput,
  basketStore,
  checkVies,
  cleanContact,
  cleanLines,
  isEmail,
  newToken,
  readAnon,
  writeAnon,
  readBasket,
  str,
  tokenForEmail,
  viesLabel,
  writeBasket,
} from './_shared/bf-baskets';

/**
 * Black Friday registration + saved basket (public).
 *
 *   POST { action: 'vies', country, vatNumber }        → live VIES check for the form
 *   POST { action: 'register', contact, lines }         → saves the registration + basket, emails
 *                                                         the customer a resume link and the factory a notice
 *   POST { action: 'update', token, lines }             → keeps the saved basket in step with the page
 *   POST { action: 'anon', anonId, lines }              → records what an unregistered visitor picked (no personal data)
 *   POST { action: 'resend', email }                    → emails a registered customer their resume link
 *   GET  ?token=…                                       → loads a saved basket (resume link / other device)
 *
 * Everything shows up in the admin portal under "Offers" (netlify/functions/admin-bf-offers.ts).
 */

const ALLOWED_ORIGINS = ['https://leeukopf.com', 'https://www.leeukopf.com'];
const DEFAULT_FACTORY_EMAILS = ['leeukopf@gmail.com', 'acc1.leeukopf@gmail.com'];
const SITE = 'https://www.leeukopf.com';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const eur = (n: number) => `€${n.toFixed(2)}`;

function corsHeaders(origin?: string): Record<string, string> {
  const ok = origin && (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.netlify.app') || origin.startsWith('http://localhost'));
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ok ? origin! : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  };
}

/** What the browser is allowed to see of a saved basket. */
const publicView = (b: Basket) => ({
  token: b.token,
  status: b.status,
  orderId: b.orderId,
  contact: b.contact,
  lines: b.lines,
  totalKg: b.totalKg,
  totalEur: b.totalEur,
});

const resumeLink = (token: string) => `${SITE}/blackfriday?basket=${encodeURIComponent(token)}`;

function linesHtml(b: Pick<Basket, 'lines' | 'totalKg' | 'totalEur'>) {
  if (!b.lines.length) return '<p style="color:#777">No colours in the basket yet.</p>';
  const rows = b.lines
    .map((l) => {
      const c = BF_COLOURS.find((x) => x.code === l.code)!;
      const price = BF_CATEGORIES[c.category].pricePerKg;
      return `<tr style="border-bottom:1px solid #eee"><td><b>${esc(l.code)}</b></td><td>${esc(BF_CATEGORIES[c.category].label)}</td><td style="text-align:right">${l.kg} kg</td><td style="text-align:right">${eur(l.kg * price)}</td></tr>`;
    })
    .join('');
  return `<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px">
<thead><tr style="background:#1f2566;color:#fff;text-align:left"><th>Colour</th><th>Category</th><th style="text-align:right">Qty</th><th style="text-align:right">Total</th></tr></thead>
<tbody>${rows}</tbody>
<tfoot><tr><td colspan="2"><b>Total</b></td><td style="text-align:right"><b>${b.totalKg} kg</b></td><td style="text-align:right"><b>${eur(b.totalEur)}</b></td></tr></tfoot></table>`;
}

function contactRowsHtml(b: Basket) {
  const c = b.contact;
  const vat = c.vatNumber ? `${c.vatNumber} — ${viesLabel(c.vies)}${c.vies.name ? ` (${c.vies.name})` : ''}` : '—';
  return [
    ['Name', `${c.firstName} ${c.lastName}`],
    ['Company', c.companyName || '—'],
    ['Email', c.email],
    ['Contact number', c.phone],
    ['Address', [c.addressLine1, c.addressLine2, `${c.postalCode} ${c.city}`, c.country].filter(Boolean).join(', ')],
    ['VAT', vat],
  ]
    .map(([k, v]) => `<tr><td style="color:#777;padding:4px 12px 4px 0;vertical-align:top">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
    .join('');
}

async function sendEmails(b: Basket) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[black-friday-basket] RESEND_API_KEY is not set');
    return;
  }
  const from = process.env.RESEND_FROM_EMAIL || 'noreply@leeukopf.com';
  const factory = (process.env.BLACK_FRIDAY_ORDER_EMAILS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const resend = new Resend(apiKey);
  const c = b.contact;

  const jobs = [
    resend.emails.send({
      from: `Leeukopf Black Friday <${from}>`,
      to: factory.length ? factory : DEFAULT_FACTORY_EMAILS,
      replyTo: c.email,
      subject: `New Black Friday registration — ${c.firstName} ${c.lastName}${c.companyName ? `, ${c.companyName}` : ''} (${c.country}) — ${b.totalKg} kg in basket`,
      html: `<div style="font-family:Arial,sans-serif;color:#111;max-width:720px">
<h2 style="margin:0 0 4px">New Black Friday registration</h2>
<p style="margin:0 0 18px;color:#555">Registered on leeukopf.com/blackfriday. Not an order yet — the basket below is what they have chosen so far. You can follow it in the admin portal under Offers.</p>
<table style="font-size:14px;margin-bottom:20px">${contactRowsHtml(b)}</table>
${linesHtml(b)}</div>`,
    }),
    resend.emails.send({
      from: `Leeukopf Laboratories <${from}>`,
      to: c.email,
      replyTo: 'info@leeukopf.com',
      subject: 'Your Leeukopf Black Friday basket is saved',
      html: `<div style="font-family:Arial,sans-serif;color:#111;max-width:640px">
<div style="background:#000;color:#fff;padding:28px 24px;text-align:center"><div style="font-size:26px;letter-spacing:1px">BLACK FRIDAY</div><div style="font-size:18px;color:#8891d0;font-weight:bold">YOUR BASKET IS SAVED</div></div>
<div style="padding:24px">
<p>Dear ${esc(c.firstName)},</p>
<p>Thank you for registering for the Leeukopf Laboratories Black Friday offer. Your basket is saved, so you can come back and finish your order at any time, on any device:</p>
<p style="text-align:center;margin:24px 0"><a href="${resumeLink(b.token)}" style="background:#1f2566;color:#fff;padding:14px 26px;text-decoration:none;font-weight:bold;border-radius:4px">Open my basket</a></p>
${linesHtml(b)}
<p style="color:#555;font-size:13px">Minimum order 10 kg in total across all colours. VAT and shipping, where applicable, are added on your invoice.</p>
<p>Questions? Reply to this email or write to <a href="mailto:info@leeukopf.com">info@leeukopf.com</a>.</p>
<p>Leeukopf Laboratories</p></div></div>`,
    }),
  ];
  const results = await Promise.allSettled(jobs);
  results.forEach((r) => {
    if (r.status === 'rejected') console.error('[black-friday-basket] email failed', r.reason);
    else if (r.value.error) console.error('[black-friday-basket] email error', r.value.error);
  });
}

export const lambdaHandler: Handler = async (event) => {
  const headers = corsHeaders(event.headers.origin || event.headers.Origin);
  const reply = (statusCode: number, body: Record<string, unknown>) => ({ statusCode, headers, body: JSON.stringify(body) });

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };

  const store = basketStore(event);

  if (event.httpMethod === 'GET') {
    const basket = await readBasket(store, event.queryStringParameters?.token);
    if (!basket) return reply(404, { success: false, message: 'Basket not found.' });
    return reply(200, { success: true, basket: publicView(basket) });
  }
  if (event.httpMethod !== 'POST') return reply(405, { success: false, message: 'Method not allowed' });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return reply(400, { success: false, message: 'Invalid request.' });
  }

  const action = str(body.action, 20);

  if (action === 'vies') {
    const result = await checkVies(str(body.country, 80), str(body.vatNumber, 40));
    return reply(200, { success: true, vies: result });
  }

  if (action === 'register') {
    if (str(body.website)) return reply(200, { success: true, basket: null }); // honeypot
    const { contact, problems } = cleanContact(body.contact as ContactInput);
    if (problems.length) return reply(400, { success: false, message: `Please fill in: ${problems.join(', ')}.` });

    const vies = contact.vatNumber
      ? await checkVies(contact.country, contact.vatNumber)
      : { status: 'not_eu' as const, name: null, address: null, checkedAt: new Date().toISOString() };
    if (vies.status === 'invalid') {
      return reply(400, {
        success: false,
        field: 'vatNumber',
        message: 'This VAT number is not valid in the EU VIES system. Please check it, or contact info@leeukopf.com.',
      });
    }

    const now = new Date().toISOString();
    const basket: Basket = {
      token: newToken(),
      status: 'open',
      orderId: null,
      contact: { ...contact, vies },
      ...cleanLines(body.lines),
      createdAt: now,
      updatedAt: now,
      orderedAt: null,
    };
    await writeBasket(store, basket);
    // Their anonymous basket now lives on as this registration.
    const anon = await readAnon(store, body.anonId);
    if (anon) await writeAnon(store, { ...anon, registered: true, updatedAt: now });
    await sendEmails(basket);
    return reply(200, { success: true, basket: publicView(basket) });
  }

  if (action === 'update') {
    const basket = await readBasket(store, body.token);
    if (!basket) return reply(404, { success: false, message: 'Basket not found.' });
    const now = new Date().toISOString();
    const next = cleanLines(body.lines);
    if (basket.status === 'ordered') {
      // Already ordered: a new selection starts a fresh basket for the same registration.
      if (!next.lines.length) return reply(200, { success: true, basket: publicView(basket) });
      const fresh: Basket = { ...basket, token: newToken(), status: 'open', orderId: null, orderedAt: null, ...next, createdAt: now, updatedAt: now };
      await writeBasket(store, fresh);
      return reply(200, { success: true, basket: publicView(fresh) });
    }
    const updated: Basket = { ...basket, ...next, updatedAt: now };
    await writeBasket(store, updated);
    return reply(200, { success: true, basket: publicView(updated) });
  }

  if (action === 'anon') {
    const anonId = str(body.anonId, 40);
    if (!/^[A-Za-z0-9_-]{16,40}$/.test(anonId)) return reply(400, { success: false, message: 'Invalid request.' });
    const now = new Date().toISOString();
    const existing = await readAnon(store, anonId);
    if (existing?.registered) return reply(200, { success: true });
    const next = cleanLines(body.lines);
    if (!existing && !next.lines.length) return reply(200, { success: true });
    await writeAnon(store, {
      anonId,
      ...next,
      country: existing?.country || str(event.headers['x-visitor-country'], 80) || null,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      registered: false,
    });
    return reply(200, { success: true });
  }

  if (action === 'resend') {
    const email = str(body.email).toLowerCase();
    if (!isEmail(email)) return reply(400, { success: false, message: 'Please enter a valid email address.' });
    const token = await tokenForEmail(store, email);
    const basket = token ? await readBasket(store, token) : null;
    const apiKey = process.env.RESEND_API_KEY;
    if (basket && apiKey) {
      const from = process.env.RESEND_FROM_EMAIL || 'noreply@leeukopf.com';
      try {
        await new Resend(apiKey).emails.send({
          from: `Leeukopf Laboratories <${from}>`,
          to: basket.contact.email,
          replyTo: 'info@leeukopf.com',
          subject: 'Your Leeukopf Black Friday basket',
          html: `<div style="font-family:Arial,sans-serif;max-width:640px"><p>Dear ${esc(basket.contact.firstName)},</p>
<p>Here is the link to your saved Black Friday basket:</p>
<p style="text-align:center;margin:24px 0"><a href="${resumeLink(basket.token)}" style="background:#1f2566;color:#fff;padding:14px 26px;text-decoration:none;font-weight:bold;border-radius:4px">Open my basket</a></p>
<p>If you did not ask for this email, you can ignore it.</p><p>Leeukopf Laboratories</p></div>`,
        });
      } catch (err) {
        console.error('[black-friday-basket] resend failed', err);
      }
    }
    // Same answer either way, so the form can't be used to find out who is registered.
    return reply(200, { success: true });
  }

  return reply(400, { success: false, message: 'Unknown action.' });
};

export default asModernFunction(lambdaHandler);
