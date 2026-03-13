import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const config = {
  path: '/api/admin-resend-orders',
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
  return trimmed.toLowerCase().startsWith('bearer ') ? trimmed.slice(7).trim() : trimmed;
}

function generateResendHtml(order: {
  order_id: string;
  order_date: string | null;
  company_name: string;
  contact_name: string | null;
  contact_email: string;
  contact_phone: string | null;
  country: string | null;
  vat_number: string | null;
  shipping_address: string | null;
  total_qty: number;
  items: unknown;
}): string {
  type ItemRow = { code?: string; product_name?: string; name?: string; size?: string; quantity?: number; qty?: number; moq?: string };
  const items: ItemRow[] = Array.isArray(order.items) ? (order.items as ItemRow[]) : [];
  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border:1px solid #e5e7eb;">${item.code ?? ''}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${item.product_name ?? item.name ?? ''}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${item.size ?? ''}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${item.quantity ?? item.qty ?? ''}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${item.moq ?? ''}</td>
        </tr>`,
    )
    .join('');

  return `
    <h2>B2B Order (Resent) — ${order.order_id}</h2>
    <p><strong>Order Date:</strong> ${order.order_date ?? '—'}</p>
    <h3>Customer</h3>
    <p>
      <strong>Company:</strong> ${order.company_name}<br>
      <strong>Contact:</strong> ${order.contact_name ?? '—'}<br>
      <strong>Email:</strong> ${order.contact_email}<br>
      <strong>Phone:</strong> ${order.contact_phone ?? '—'}<br>
      <strong>Country:</strong> ${order.country ?? '—'}<br>
      <strong>VAT:</strong> ${order.vat_number ?? '—'}<br>
      <strong>Shipping:</strong> ${order.shipping_address ?? '—'}
    </p>
    <h3>Items</h3>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Code</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Product</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Size</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:right;">Qty</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:right;">MOQ</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <p style="margin-top:12px;"><strong>Total Quantity:</strong> ${order.total_qty}</p>
  `;
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
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@leeukopf.com';

  if (!supabaseUrl || !serviceRoleKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Supabase not configured.' }) };
  }
  if (!resendApiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'RESEND_API_KEY not configured.' }) };
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
  const approvedAdmins = (process.env.ADMIN_APPROVER_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (approvedAdmins.length > 0 && !approvedAdmins.includes(requesterEmail)) {
    return { statusCode: 403, headers, body: JSON.stringify({ success: false, message: 'Forbidden.' }) };
  }

  // Parse target email from body
  let toEmail = 'info@leeukopf.com';
  try {
    const body = JSON.parse(event.body || '{}') as { to?: string };
    if (body.to && typeof body.to === 'string' && body.to.includes('@')) {
      toEmail = body.to.trim();
    }
  } catch {
    // use default
  }

  // Fetch all orders
  const { data: orders, error: dbError } = await adminSupabase
    .from('b2b_orders')
    .select('order_id, order_date, company_name, contact_name, contact_email, contact_phone, country, vat_number, shipping_address, total_qty, items')
    .order('created_at', { ascending: true });

  if (dbError) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: `DB error: ${dbError.message}` }) };
  }

  if (!orders || orders.length === 0) {
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, sent: 0, message: 'No orders found.' }) };
  }

  const resend = new Resend(resendApiKey);
  let sent = 0;
  const errors: string[] = [];

  for (const order of orders) {
    try {
      await resend.emails.send({
        from: `Leeukopf Orders <${fromEmail}>`,
        to: toEmail,
        subject: `[RESENT] B2B Order ${order.order_id}`,
        html: generateResendHtml(order),
        replyTo: order.contact_email,
      });
      sent++;
    } catch (err) {
      errors.push(`${order.order_id}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      sent,
      total: orders.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Resent ${sent}/${orders.length} orders to ${toEmail}.`,
    }),
  };
};
