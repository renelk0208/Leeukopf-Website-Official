import type { Handler } from '@netlify/functions';
import { asModernFunction } from './_shared/lambda-adapter';
import { createClient } from '@supabase/supabase-js';
import { BF_CATEGORIES, BF_COLOURS } from '../../src/data/blackFridayOffer';
import { basketStore, listBaskets } from './_shared/bf-baskets';

/**
 * Admin portal → "Offers": every Black Friday registration and its basket, shown like orders.
 * Same access rules as admin-b2b-orders (owners in ADMIN_APPROVER_EMAILS, or staff with view_orders).
 */

function corsHeaders(origin: string | undefined): Record<string, string> {
  const allowed = ['https://leeukopf.com', 'https://www.leeukopf.com', 'http://localhost:5173', 'http://localhost:5174'];
  const ok = origin && (allowed.includes(origin) || origin.endsWith('.netlify.app'));
  return {
    'Access-Control-Allow-Origin': ok ? origin! : 'https://leeukopf.com',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  };
}

export const lambdaHandler: Handler = async (event) => {
  const headers = corsHeaders(event.headers.origin);
  const reply = (statusCode: number, body: Record<string, unknown>) => ({ statusCode, headers, body: JSON.stringify(body) });

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '{}' };
  if (event.httpMethod !== 'GET') return reply(405, { success: false, message: 'Method Not Allowed' });

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return reply(500, { success: false, message: 'Supabase environment is not fully configured.' });

  const auth = (event.headers.authorization || event.headers.Authorization || '').trim();
  const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : auth;
  if (!token) return reply(401, { success: false, message: 'Missing authorization token.' });

  const admin = createClient(supabaseUrl, serviceRoleKey);
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  if (authError || !authData.user?.email) return reply(401, { success: false, message: 'Unauthorized admin session.' });

  const email = authData.user.email.trim().toLowerCase();
  const owners = (process.env.ADMIN_APPROVER_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (owners.length > 0 && !owners.includes(email)) {
    const { data: staff } = await admin.from('admin_staff').select('permissions, is_active').eq('email', email).maybeSingle();
    const perms = staff?.permissions as Record<string, boolean> | null;
    if (!staff?.is_active || !perms?.view_orders) return reply(403, { success: false, message: 'Forbidden: account is not allowed to view orders.' });
  }

  try {
    const baskets = await listBaskets(basketStore(event));
    const data = baskets.map((b) => ({
      id: b.token.slice(0, 8).toUpperCase(),
      status: b.status,
      orderId: b.orderId,
      contact: b.contact,
      lines: b.lines.map((l) => {
        const c = BF_COLOURS.find((x) => x.code === l.code);
        const price = c ? BF_CATEGORIES[c.category].pricePerKg : 0;
        return { ...l, category: c ? BF_CATEGORIES[c.category].label : '', price, total: price * l.kg };
      }),
      totalKg: b.totalKg,
      totalEur: b.totalEur,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      orderedAt: b.orderedAt,
    }));
    return reply(200, { success: true, count: data.length, data });
  } catch (err) {
    console.error('[admin-bf-offers] failed', err);
    return reply(500, { success: false, message: 'Could not load the Black Friday offers.' });
  }
};

export default asModernFunction(lambdaHandler);
