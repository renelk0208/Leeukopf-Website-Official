import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

const REQUIRED_COLUMNS = {
  timestamp: 0,
  company: 3,
  contact: 4,
  email: 6,
  country: 8,
  businessType: 17,
};

function normalizePrivateKey(value) {
  let key = (value || '').trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  key = key.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');
  return key;
}

function readGoogleCredentialsFromFile() {
  const configuredPath = process.env.GOOGLE_SERVICE_ACCOUNT_FILE;
  const candidatePaths = [
    configuredPath,
    join(process.cwd(), 'netlify/functions/assets/google-service-account.json'),
    join(process.cwd(), 'assets/google-service-account.json'),
  ].filter(Boolean);

  for (const filePath of candidatePaths) {
    if (!existsSync(filePath)) continue;
    try {
      const raw = readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed.client_email && parsed.private_key) {
        return {
          serviceAccountEmail: parsed.client_email,
          privateKey: parsed.private_key,
        };
      }
    } catch (error) {
      console.error('[backfill] Failed reading Google credentials file:', filePath, error.message);
    }
  }

  return null;
}

function getGoogleCredentials() {
  const envEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const envKey = process.env.GOOGLE_PRIVATE_KEY;

  if (envEmail && envKey) {
    return {
      serviceAccountEmail: envEmail,
      privateKey: normalizePrivateKey(envKey),
    };
  }

  const fileCreds = readGoogleCredentialsFromFile();
  if (fileCreds) {
    return {
      serviceAccountEmail: fileCreds.serviceAccountEmail,
      privateKey: normalizePrivateKey(fileCreds.privateKey),
    };
  }

  throw new Error('Google credentials missing. Set GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY or GOOGLE_SERVICE_ACCOUNT_FILE.');
}

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase credentials missing. Set SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.');
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function toIsoDate(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return new Date().toISOString();
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

function parseRow(row) {
  const email = String(row[REQUIRED_COLUMNS.email] || '').trim().toLowerCase();
  if (!email) return null;

  const company = String(row[REQUIRED_COLUMNS.company] || '').trim();
  const contact = String(row[REQUIRED_COLUMNS.contact] || '').trim();
  const country = String(row[REQUIRED_COLUMNS.country] || '').trim();
  const businessType = String(row[REQUIRED_COLUMNS.businessType] || '').trim();

  if (!company || !contact || !country || !businessType) {
    return null;
  }

  return {
    email,
    company,
    contact,
    country,
    business_type: businessType,
    created_at: toIsoDate(String(row[REQUIRED_COLUMNS.timestamp] || '')),
  };
}

async function getSheetRows(authClient, spreadsheetId, sheetTab) {
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  const range = `${sheetTab}!A2:AL`;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return response.data.values || [];
}

async function getExistingEmails(supabase) {
  const { data, error } = await supabase
    .from('client_registrations')
    .select('email')
    .limit(10000);

  if (error) {
    throw new Error(`Failed to fetch existing client registrations: ${error.message}`);
  }

  return new Set((data || []).map((row) => String(row.email || '').toLowerCase()).filter(Boolean));
}

async function insertInBatches(supabase, rows) {
  const batchSize = 200;
  let inserted = 0;

  for (let index = 0; index < rows.length; index += batchSize) {
    const batch = rows.slice(index, index + batchSize);
    const { error } = await supabase
      .from('client_registrations')
      .insert(batch);

    if (error) {
      throw new Error(`Insert failed for batch starting at ${index}: ${error.message}`);
    }

    inserted += batch.length;
  }

  return inserted;
}

async function main() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetTab = process.env.GOOGLE_SHEET_TAB || 'Raw_Leads';

  if (!spreadsheetId) {
    throw new Error('Missing GOOGLE_SHEET_ID environment variable.');
  }

  const { serviceAccountEmail, privateKey } = getGoogleCredentials();

  const authClient = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const supabase = getSupabaseClient();

  const [sheetRows, existingEmails] = await Promise.all([
    getSheetRows(authClient, spreadsheetId, sheetTab),
    getExistingEmails(supabase),
  ]);

  const parsed = [];
  const seenEmails = new Set();

  for (const row of sheetRows) {
    const parsedRow = parseRow(row);
    if (!parsedRow) continue;

    if (seenEmails.has(parsedRow.email)) continue;
    seenEmails.add(parsedRow.email);

    if (existingEmails.has(parsedRow.email)) continue;

    parsed.push(parsedRow);
  }

  if (parsed.length === 0) {
    console.log('[backfill] No new client registrations to import.');
    return;
  }

  const insertedCount = await insertInBatches(supabase, parsed);
  console.log(`[backfill] Imported ${insertedCount} client registrations into client_registrations.`);
}

main().catch((error) => {
  console.error('[backfill] Failed:', error.message);
  process.exit(1);
});
