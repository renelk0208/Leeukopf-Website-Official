import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

export const config = {
  path: '/api/admin-client-registrations',
};

type ClientRegistrationRow = {
  id: string;
  company: string;
  contact: string;
  role?: string;
  email: string;
  phone?: string;
  country: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  business_type: string;
  client_type?: string;
  interest_distribution?: boolean;
  interest_private_label?: boolean;
  interest_influencer?: boolean;
  interests?: string[];
  monthly_volume?: string;
  vat_eori?: string;
  billing_address?: string;
  shipping_address?: string;
  language?: string;
  notes?: string;
  // Distributor fields
  countries_covered?: string;
  distribution_channels?: string;
  estimated_monthly_volume?: string;
  years_in_business?: string;
  // Private Label fields
  brand_name?: string;
  product_interest?: string;
  target_moq?: string;
  target_launch_date?: string;
  // Influencer fields
  country_audience?: string;
  avg_views?: string;
  // CRM fields
  pipeline_stage?: string;
  samples_sent_at?: string;
  last_contact_date?: string;
  admin_notes?: string;
  created_at: string;
};

type AuthAdminUser = {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: {
    company?: string;
    contact?: string;
    full_name?: string;
  };
};

function normalizeText(value: string | null | undefined): string {
  return String(value || '').trim().toLowerCase();
}

function getLeadSignature(row: ClientRegistrationRow): string {
  return [
    normalizeText(row.email),
    normalizeText(row.company),
    normalizeText(row.contact),
    normalizeText(row.country),
    normalizeText(row.business_type),
  ].join('|');
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

function parseStartDate(value: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

async function listAuthUsers(adminSupabase: ReturnType<typeof createClient>): Promise<AuthAdminUser[]> {
  const perPage = 200;
  const maxPages = 20;
  const users: AuthAdminUser[] = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const { data, error } = await adminSupabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new Error(`Failed to load auth users: ${error.message}`);
    }

    const pageUsers = (data?.users ?? []) as AuthAdminUser[];
    users.push(...pageUsers);

    if (pageUsers.length < perPage) {
      break;
    }
  }

  return users;
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
      body: JSON.stringify({ success: false, message: 'Forbidden: account is not allowed to access client registrations.' }),
    };
  }

  const queryParams = new URLSearchParams(event.queryStringParameters ?? {});
  const startDateIso = parseStartDate(queryParams.get('startDate'));

  let registrationsQuery = adminSupabase
    .from('client_registrations')
    .select('id, company, contact, role, email, phone, country, website, instagram, facebook, tiktok, business_type, client_type, interest_distribution, interest_private_label, interest_influencer, interests, monthly_volume, vat_eori, billing_address, shipping_address, language, notes, countries_covered, distribution_channels, estimated_monthly_volume, years_in_business, brand_name, product_interest, target_moq, target_launch_date, country_audience, avg_views, pipeline_stage, samples_sent_at, last_contact_date, admin_notes, created_at')
    .order('created_at', { ascending: false });

  if (startDateIso) {
    registrationsQuery = registrationsQuery.gte('created_at', startDateIso);
  }

  const { data, error } = await registrationsQuery;

  if (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: `Failed to load client registrations: ${error.message}` }),
    };
  }

  const dedupedMap = new Map<string, ClientRegistrationRow>();
  for (const row of (data ?? []) as ClientRegistrationRow[]) {
    const key = getLeadSignature(row);
    const existing = dedupedMap.get(key);

    if (!existing) {
      dedupedMap.set(key, row);
      continue;
    }

    const existingTime = new Date(existing.created_at).getTime();
    const nextTime = new Date(row.created_at).getTime();
    if (!Number.isNaN(nextTime) && (Number.isNaN(existingTime) || nextTime > existingTime)) {
      dedupedMap.set(key, row);
    }
  }

  const deduped = Array.from(dedupedMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const existingRegistrationEmails = new Set(deduped.map((row) => normalizeEmail(row.email)));

  const { data: approvedRows, error: approvedError } = await adminSupabase
    .from('approved_clients')
    .select('email');

  const approvedTableMissing = Boolean(
    approvedError?.message?.toLowerCase().includes("could not find the table 'public.approved_clients'")
  );

  if (approvedError && !approvedTableMissing) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: `Failed to load approved clients: ${approvedError.message}` }),
    };
  }

  const approvedEmails = new Set((approvedRows ?? []).map((row) => normalizeEmail(String(row.email || ''))));

  let authUsers: AuthAdminUser[] = [];
  try {
    authUsers = await listAuthUsers(adminSupabase);
  } catch (authUsersError) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: authUsersError instanceof Error ? authUsersError.message : 'Failed to load auth users.',
      }),
    };
  }

  const authOnlyRows: ClientRegistrationRow[] = authUsers
    .map((authUser) => {
      const email = normalizeEmail(authUser.email || '');
      const createdAt = authUser.created_at || '';

      if (!email || !createdAt) return null;
      if (approvedAdminList.includes(email)) return null;
      if (existingRegistrationEmails.has(email)) return null;
      if (approvedEmails.has(email)) return null;

      if (startDateIso) {
        const createdTime = new Date(createdAt).getTime();
        const startTime = new Date(startDateIso).getTime();
        if (Number.isNaN(createdTime) || createdTime < startTime) {
          return null;
        }
      }

      return {
        id: `auth:${authUser.id}`,
        company: authUser.user_metadata?.company?.trim() || 'Portal-only signup',
        contact: authUser.user_metadata?.contact?.trim() || authUser.user_metadata?.full_name?.trim() || '-',
        email,
        country: '-',
        business_type: 'Portal signup',
        created_at: createdAt,
      };
    })
    .filter((row): row is ClientRegistrationRow => row !== null);

  const merged = [...deduped, ...authOnlyRows].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      count: merged.length,
      data: merged,
      warning: approvedTableMissing
        ? "approved_clients table is missing; showing registrations/signups without approval-state filtering."
        : undefined,
    }),
  };
};
