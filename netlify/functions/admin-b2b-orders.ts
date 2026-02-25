import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const config = {
  path: '/api/admin-b2b-orders',
};

type AdminB2BOrder = {
  order_id: string;
  status: string;
  order_date: string | null;
  company_name: string;
  contact_name: string | null;
  contact_email: string;
  country: string | null;
  line_count: number;
  total_qty: number;
  email_sent: boolean;
  email_error: string | null;
  created_at: string;
};

function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const candidate = error as { code?: string; message?: string };
  const message = (candidate.message || '').toLowerCase();

  return (
    candidate.code === '42P01' ||
    candidate.code === 'PGRST205' ||
    message.includes('could not find the table') ||
    message.includes('relation') && message.includes('does not exist')
  );
}

function mapLegacySolidOrderToAdminOrder(row: {
  order_id: string;
  order_date: string | null;
  company_name: string | null;
  contact_name: string | null;
  contact_email: string | null;
  country: string | null;
  line_count: number | null;
  total_qty: number | null;
  created_at: string;
}): AdminB2BOrder {
  return {
    order_id: row.order_id,
    status: 'completed',
    order_date: row.order_date,
    company_name: row.company_name || '-',
    contact_name: row.contact_name,
    contact_email: row.contact_email || '-',
    country: row.country,
    line_count: row.line_count || 0,
    total_qty: row.total_qty || 0,
    email_sent: true,
    email_error: null,
    created_at: row.created_at,
  };
}

function getAllowedOrigin(requestOrigin: string | undefined): string {
  const allowedOrigins = [
    'https://leeukopf.com',
    'https://www.leeukopf.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ];

  if (
    requestOrigin &&
    (allowedOrigins.includes(requestOrigin) || requestOrigin.endsWith('.netlify.app'))
  ) {
    return requestOrigin;
  }

  return 'https://leeukopf.com';
}

function getCorsHeaders(origin: string | undefined): Record<string, string> {
  const allowedOrigin = getAllowedOrigin(origin);
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    Vary: 'Origin',
    'Content-Type': 'application/json',
  };
}

function getBearerToken(authHeader: string | undefined): string {
  if (!authHeader) return '';
  const trimmed = authHeader.trim();
  if (trimmed.toLowerCase().startsWith('bearer ')) {
    return trimmed.slice(7).trim();
  }
  return trimmed;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const handler: Handler = async (event) => {
  const headers = getCorsHeaders(event.headers.origin);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true }),
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' }),
    };
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Supabase environment is not fully configured.' }),
    };
  }

  const token = getBearerToken(event.headers.authorization || event.headers.Authorization);
  if (!token) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ success: false, message: 'Missing authorization token.' }),
    };
  }

  const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: authData, error: authError } = await adminSupabase.auth.getUser(token);
  if (authError || !authData.user?.email) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        success: false,
        message: authError?.message ? `Unauthorized admin session: ${authError.message}` : 'Unauthorized admin session.',
      }),
    };
  }

  const requesterEmail = normalizeEmail(authData.user.email);
  const approvedAdminList = (process.env.ADMIN_APPROVER_EMAILS || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (approvedAdminList.length > 0 && !approvedAdminList.includes(requesterEmail)) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ success: false, message: 'Forbidden: account is not allowed to access B2B orders.' }),
    };
  }

  const { data, error } = await adminSupabase
    .from('b2b_orders')
    .select('order_id, status, order_date, company_name, contact_name, contact_email, country, line_count, total_qty, email_sent, email_error, created_at')
    .order('created_at', { ascending: false })
    .limit(300);

  if (error && !isMissingTableError(error)) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: `Failed to load completed orders: ${error.message}` }),
    };
  }

  if (error && isMissingTableError(error)) {
    const { data: legacyData, error: legacyError } = await adminSupabase
      .from('solid_colour_orders')
      .select('order_id, order_date, company_name, contact_name, contact_email, country, line_count, total_qty, created_at')
      .order('created_at', { ascending: false })
      .limit(300);

    if (legacyError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ success: false, message: `Failed to load completed orders: ${legacyError.message}` }),
      };
    }

    const mappedLegacy = (legacyData ?? []).map((row) =>
      mapLegacySolidOrderToAdminOrder(
        row as {
          order_id: string;
          order_date: string | null;
          company_name: string | null;
          contact_name: string | null;
          contact_email: string | null;
          country: string | null;
          line_count: number | null;
          total_qty: number | null;
          created_at: string;
        }
      )
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: mappedLegacy.length,
        data: mappedLegacy,
      }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      count: (data ?? []).length,
      data: (data ?? []) as AdminB2BOrder[],
    }),
  };
};
