import { Resend } from 'resend';
import { BF_CATEGORIES, BF_COLOURS, BF_MIN_TOTAL_KG } from '../../src/data/blackFridayOffer';
import { basketStore, isAbandoned, listBaskets, writeBasket } from './_shared/bf-baskets';

/**
 * Runs every hour. Sends ONE reminder email to each registered customer whose Black Friday
 * basket has been left untouched for 24 hours without an order (an "abandoned" basket).
 *
 * Switch off: Netlify → Environment variables → BLACK_FRIDAY_REMINDERS = false (then redeploy).
 * Also stops by itself when the offer is switched off or past BLACK_FRIDAY_ENDS_AT.
 */
export const config = { schedule: '@hourly' };

const SITE = 'https://www.leeukopf.com';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const eur = (n: number) => `€${n.toFixed(2)}`;
const off = (v: string | undefined) => ['false', 'off', '0', 'no'].includes((v ?? '').trim().toLowerCase());

function offerOpen(): boolean {
  if (off(process.env.BLACK_FRIDAY_ENABLED)) return false;
  const ends = (process.env.BLACK_FRIDAY_ENDS_AT ?? '').trim();
  return !(ends && !Number.isNaN(Date.parse(ends)) && Date.now() >= Date.parse(ends));
}

export default async () => {
  if (off(process.env.BLACK_FRIDAY_REMINDERS) || !offerOpen()) return new Response('reminders off');
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[bf-basket-reminders] RESEND_API_KEY is not set');
    return new Response('no email key', { status: 500 });
  }
  const from = process.env.RESEND_FROM_EMAIL || 'noreply@leeukopf.com';
  const resend = new Resend(apiKey);
  const store = basketStore();
  const due = (await listBaskets(store)).filter((b) => isAbandoned(b) && !b.reminderSentAt).slice(0, 50);

  let sent = 0;
  for (const b of due) {
    const c = b.contact;
    const link = `${SITE}/blackfriday?basket=${encodeURIComponent(b.token)}`;
    const rows = b.lines
      .map((l) => {
        const colour = BF_COLOURS.find((x) => x.code === l.code);
        const price = colour ? BF_CATEGORIES[colour.category].pricePerKg : 0;
        return `<tr style="border-bottom:1px solid #eee"><td><b>${esc(l.code)}</b></td><td style="text-align:right">${l.kg} kg</td><td style="text-align:right">${eur(l.kg * price)}</td></tr>`;
      })
      .join('');
    const short = Math.max(0, BF_MIN_TOTAL_KG - b.totalKg);
    try {
      const res = await resend.emails.send({
        from: `Leeukopf Laboratories <${from}>`,
        to: c.email,
        replyTo: 'info@leeukopf.com',
        subject: 'Your Black Friday colours are still waiting',
        html: `<div style="font-family:Arial,sans-serif;color:#111;max-width:640px">
<div style="background:#000;color:#fff;padding:28px 24px;text-align:center"><div style="font-size:26px;letter-spacing:1px">BLACK FRIDAY</div><div style="font-size:16px;color:#8891d0;font-weight:bold">YOUR BASKET IS SAVED</div></div>
<div style="padding:24px">
<p>Dear ${esc(c.firstName)},</p>
<p>You chose some colours on our Black Friday page but haven't sent your order yet. Your basket is saved — pick up where you left off:</p>
<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:14px"><tbody>${rows}</tbody>
<tfoot><tr><td><b>Total</b></td><td style="text-align:right"><b>${b.totalKg} kg</b></td><td style="text-align:right"><b>${eur(b.totalEur)}</b></td></tr></tfoot></table>
${short > 0 ? `<p style="color:#555;font-size:13px">The minimum order is ${BF_MIN_TOTAL_KG} kg in total across all colours — add ${short} kg more to order.</p>` : ''}
<p style="text-align:center;margin:24px 0"><a href="${link}" style="background:#1f2566;color:#fff;padding:14px 26px;text-decoration:none;font-weight:bold;border-radius:4px">Finish my order</a></p>
<p>Questions? Reply to this email or write to <a href="mailto:info@leeukopf.com">info@leeukopf.com</a>.</p>
<p>Leeukopf Laboratories</p></div></div>`,
      });
      if (res.error) throw new Error(res.error.message);
      await writeBasket(store, { ...b, reminderSentAt: new Date().toISOString() });
      sent++;
    } catch (err) {
      console.error('[bf-basket-reminders] reminder failed for', b.token.slice(0, 8), err);
    }
  }
  console.log(`[bf-basket-reminders] ${due.length} due, ${sent} sent`);
  return new Response(`sent ${sent}`);
};
