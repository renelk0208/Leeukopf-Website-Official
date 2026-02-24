import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export const config = {
  path: '/api/admin-client-registrations-backfill',
};

type ClientRegistrationRow = {
  email: string;
  company: string;
  contact: string;
  country: string;
  business_type: string;
  created_at: string;
};

const REQUIRED_COLUMNS = {
  timestamp: 0,
  company: 3,
  contact: 4,
  email: 6,
  country: 8,
  businessType: 17,
} as const;

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

function normalizePrivateKey(value: string): string {
  let key = (value || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');
}

function readGoogleCredentialsFromFile(): { serviceAccountEmail: string; privateKey: string } | null {
  const configuredPath = process.env.GOOGLE_SERVICE_ACCOUNT_FILE;
  const candidatePaths = [
    configuredPath,
    join(process.cwd(), 'netlify/functions/assets/google-service-account.json'),
    join(process.cwd(), 'assets/google-service-account.json'),
  ].filter((value): value is string => Boolean(value && value.trim()));

  for (const filePath of candidatePaths) {
    if (!existsSync(filePath)) continue;
    try {
      const raw = readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw) as { client_email?: string; private_key?: string };
      if (parsed.client_email && parsed.private_key) {
        return {
          serviceAccountEmail: parsed.client_email,
          privateKey: normalizePrivateKey(parsed.private_key),
        };
      }
    } catch {
      continue;
    }
  }

  return null;
}

function getGoogleCredentials(): { serviceAccountEmail: string; privateKey: string } {
  const envEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const envKey = process.env.GOOGLE_PRIVATE_KEY;

  if (envEmail && envKey) {
    return {
      serviceAccountEmail: envEmail,
      privateKey: normalizePrivateKey(envKey),
    };
  }

  const fileCredentials = readGoogleCredentialsFromFile();
  if (fileCredentials) return fileCredentials;

  throw new Error('Google Sheets credentials are not configured.');
}

function toIsoDate(value: string): string {
  const parsed = new Date((value || '').trim());
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString();
  return parsed.toISOString();
}

function parseStartDate(value: string | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function parseRow(row: string[]): ClientRegistrationRow | null {
  const email = normalizeEmail(String(row[REQUIRED_COLUMNS.email] || ''));
  if (!email) return null;

  const company = String(row[REQUIRED_COLUMNS.company] || '').trim();
  const contact = String(row[REQUIRED_COLUMNS.contact] || '').trim();
  const country = String(row[REQUIRED_COLUMNS.country] || '').trim();
  const businessType = String(row[REQUIRED_COLUMNS.businessType] || '').trim();

  if (!company || !contact || !country || !businessType) return null;

  return {
    email,
    company,
    contact,
    country,
    business_type: businessType,
    created_at: toIsoDate(String(row[REQUIRED_COLUMNS.timestamp] || '')),
  };
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' }),
    };
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetTab = process.env.GOOGLE_SHEET_TAB || 'Raw_Leads';

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Supabase environment is not fully configured.' }),
    };
  }

  if (!spreadsheetId) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Google Sheets is not configured (missing GOOGLE_SHEET_ID).' }),
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
      body: JSON.stringify({ success: false, message: 'Unauthorized admin session.' }),
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
      body: JSON.stringify({ success: false, message: 'Forbidden: account is not allowed to run backfill.' }),
    };
  }

  const startDateIso = parseStartDate(event.queryStringParameters?.startDate);

  try {
    const { serviceAccountEmail, privateKey } = getGoogleCredentials();
    const authClient = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth: authClient });
    const range = `${sheetTab}!A2:AL`;
    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = response.data.values || [];

    const { data: existingRows, error: existingError } = await adminSupabase
      .from('client_registrations')
      .select('email')
      .limit(10000);

    if (existingError) {
      throw new Error(`Failed to read existing registrations: ${existingError.message}`);
    }

    const existingEmails = new Set(
      (existingRows ?? []).map((row) => normalizeEmail(String(row.email || ''))).filter(Boolean)
    );

    const parsedRows: ClientRegistrationRow[] = [];
    const seenEmails = new Set<string>();

    for (const row of rows as string[][]) {
      const parsed = parseRow(row);
      if (!parsed) continue;

      if (startDateIso && parsed.created_at < startDateIso) continue;
      if (seenEmails.has(parsed.email)) continue;
      seenEmails.add(parsed.email);
      if (existingEmails.has(parsed.email)) continue;

      parsedRows.push(parsed);
    }

    if (parsedRows.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, imported: 0, message: 'No new client registrations found in Google Sheets.' }),
      };
    }

    const batchSize = 200;
    let inserted = 0;

    for (let index = 0; index < parsedRows.length; index += batchSize) {
      const batch = parsedRows.slice(index, index + batchSize);
      const { error } = await adminSupabase.from('client_registrations').insert(batch);
      if (error) {
        throw new Error(`Insert failed for batch starting at ${index}: ${error.message}`);
      }
      inserted += batch.length;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, imported: inserted, message: `Imported ${inserted} registrations from Google Sheets.` }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Backfill failed.',
      }),
    };
  }
};
