import type { Handler, HandlerEvent } from '@netlify/functions';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import * as jose from 'jose';
import { webcrypto } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Polyfill global crypto for jose on Netlify
if (!globalThis.crypto) {
  // @ts-expect-error - Polyfill required for Netlify environment compatibility
  globalThis.crypto = webcrypto as Crypto;
}

// Configure the function path
export const config = {
  path: '/api/client-registration-email'
};

interface FormData {
  company: string;
  contact: string;
  role?: string;
  email: string;
  phone?: string;
  country: string;
  countryOther?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  businessType: string;
  interests: string[];
  interestPrivateLabel?: boolean;
  interestDistribution?: boolean;
  interestInfluencer?: boolean;
  monthlyVolume?: string;
  vatEori?: string;
  billingAddress?: string;
  shippingAddress?: string;
  requestSampleBox?: boolean;
  street?: string;
  district?: string;
  postalCode?: string;
  language: string;
  notes?: string;
  attachments?: Array<{ filename: string; url: string }>;
  honeypot?: string;
  source?: string;
  page?: string;
  gdprConsent?: boolean;
  client_type?: string;
  // Distributors fields
  countries_covered?: string;
  distribution_channels?: string;
  estimated_monthly_volume?: string;
  years_in_business?: string;
  // Private Label fields
  brand_name?: string;
  product_interest?: string;
  target_moq?: string;
  target_launch_date?: string;
  // Influencers fields
  country_audience?: string;
  avg_views?: string;
}

interface GoogleCredentials {
  serviceAccountEmail: string;
  privateKey: string;
}

function readGoogleCredentialsFromFile(): GoogleCredentials | null {
  const configuredPath = process.env.GOOGLE_SERVICE_ACCOUNT_FILE;
  const candidatePaths = [
    configuredPath,
    join(process.cwd(), 'netlify/functions/assets/google-service-account.json'),
    join(process.cwd(), 'assets/google-service-account.json'),
  ].filter((value): value is string => Boolean(value && value.trim()));

  for (const filePath of candidatePaths) {
    try {
      if (!existsSync(filePath)) continue;
      const raw = readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw) as {
        client_email?: string;
        private_key?: string;
      };

      if (parsed.client_email && parsed.private_key) {
        return {
          serviceAccountEmail: parsed.client_email,
          privateKey: parsed.private_key,
        };
      }
    } catch (error) {
      console.error('Failed reading Google credentials file:', filePath, error);
    }
  }

  return null;
}

function getGoogleCredentials(): GoogleCredentials {
  const envServiceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const envPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (envServiceAccountEmail && envPrivateKey) {
    return {
      serviceAccountEmail: envServiceAccountEmail,
      privateKey: envPrivateKey,
    };
  }

  const fileCredentials = readGoogleCredentialsFromFile();
  if (fileCredentials) {
    return fileCredentials;
  }

  throw new Error(
    'Google Sheets credentials missing. Set GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY or provide netlify/functions/assets/google-service-account.json (or GOOGLE_SERVICE_ACCOUNT_FILE).'
  );
}

// Get allowed origins for CORS
function getAllowedOrigin(requestOrigin: string | undefined): string {
  const allowedOrigins = [
    'https://leeukopf.com',
    'https://www.leeukopf.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ];
  
  if (requestOrigin && (
    allowedOrigins.includes(requestOrigin) ||
    requestOrigin.endsWith('.netlify.app')
  )) {
    return requestOrigin;
  }
  
  return 'https://leeukopf.com';
}

// Generate internal email body
function generateInternalEmailBody(formData: FormData): string {
  let body = `
<h2>New Client Registration Form Submission</h2>

<h3>Company Information</h3>
<p><strong>Company/Brand Name:</strong> ${formData.company}</p>
<p><strong>Contact Name:</strong> ${formData.contact}</p>
${formData.role ? `<p><strong>Role/Title:</strong> ${formData.role}</p>` : ''}
<p><strong>Email:</strong> ${formData.email}</p>
${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ''}
<p><strong>Country:</strong> ${formData.country}${formData.country === 'Other' && formData.countryOther ? ` (${formData.countryOther})` : ''}</p>
${formData.website ? `<p><strong>Website:</strong> ${formData.website}</p>` : ''}
${formData.instagram ? `<p><strong>Instagram:</strong> ${formData.instagram}</p>` : ''}
${formData.facebook ? `<p><strong>Facebook:</strong> ${formData.facebook}</p>` : ''}
${formData.tiktok ? `<p><strong>TikTok:</strong> ${formData.tiktok}</p>` : ''}

<h3>Business Details</h3>
<p><strong>Client Type:</strong> ${formData.client_type || 'Not specified'}</p>
<p><strong>Business Type:</strong> ${formData.businessType}</p>
<p><strong>Business Interest:</strong> ${[
  formData.interestPrivateLabel ? 'Private Label' : '',
  formData.interestDistribution ? 'Distribution' : '',
  formData.interestInfluencer ? 'Influencer' : ''
].filter(Boolean).join(', ')}</p>
<p><strong>Product Interests:</strong> ${formData.interests.length > 0 ? formData.interests.join(', ') : 'None specified'}</p>
${formData.monthlyVolume ? `<p><strong>Estimated Monthly Volume:</strong> ${formData.monthlyVolume}</p>` : ''}
${formData.vatEori ? `<p><strong>VAT Registration number:</strong> ${formData.vatEori}</p>` : ''}
`;

  // Add client type specific information
  if (formData.client_type === 'Distributors') {
    body += `
<h3>Distribution Information</h3>
${formData.countries_covered ? `<p><strong>Countries Covered:</strong> ${formData.countries_covered}</p>` : ''}
${formData.distribution_channels ? `<p><strong>Distribution Channels:</strong><br>${formData.distribution_channels.replace(/\n/g, '<br>')}</p>` : ''}
${formData.estimated_monthly_volume ? `<p><strong>Estimated Monthly Volume:</strong> ${formData.estimated_monthly_volume}</p>` : ''}
${formData.years_in_business ? `<p><strong>Years in Business:</strong> ${formData.years_in_business}</p>` : ''}
`;
  } else if (formData.client_type === 'PrivateLabel') {
    body += `
<h3>Private Label Information</h3>
${formData.brand_name ? `<p><strong>Brand Name:</strong> ${formData.brand_name}</p>` : ''}
${formData.product_interest ? `<p><strong>Product Interest:</strong> ${formData.product_interest}</p>` : ''}
${formData.target_moq ? `<p><strong>Target MOQ:</strong> ${formData.target_moq}</p>` : ''}
${formData.target_launch_date ? `<p><strong>Target Launch Date:</strong> ${formData.target_launch_date}</p>` : ''}
`;
  } else if (formData.client_type === 'Influencers') {
    body += `
<h3>Influencer Information</h3>
${formData.country_audience ? `<p><strong>Country Audience:</strong> ${formData.country_audience}</p>` : ''}
${formData.avg_views ? `<p><strong>Average Views/Engagement:</strong> ${formData.avg_views}</p>` : ''}
`;
  }

  body += `
<h3>Addresses</h3>
${formData.billingAddress ? `<p><strong>Billing Address:</strong><br>${formData.billingAddress.replace(/\n/g, '<br>')}</p>` : ''}
${formData.shippingAddress ? `<p><strong>Shipping Address:</strong><br>${formData.shippingAddress.replace(/\n/g, '<br>')}</p>` : ''}

${formData.requestSampleBox ? `
<h3>Sample Box Request</h3>
<p><strong>Sample Box Requested:</strong> Yes</p>
${formData.street ? `<p><strong>Street Address:</strong> ${formData.street}</p>` : ''}
${formData.district ? `<p><strong>Suburb/District:</strong> ${formData.district}</p>` : ''}
${formData.postalCode ? `<p><strong>Postal Code:</strong> ${formData.postalCode}</p>` : ''}
` : ''}

<h3>Additional Information</h3>
<p><strong>Preferred Language:</strong> ${formData.language}</p>
${formData.notes ? `<p><strong>Notes/Requirements:</strong><br>${formData.notes.replace(/\n/g, '<br>')}</p>` : ''}
`;

  if (formData.attachments && formData.attachments.length > 0) {
    body += '\n<h3>Attachments</h3>\n';
    formData.attachments.forEach(attachment => {
      body += `<p><a href="${attachment.url}">${attachment.filename}</a></p>\n`;
    });
  }

  return body;
}

// Generate auto-reply email body
function generateAutoReplyBody(): string {
  return `
<p>Thank you for completing the Leeukopf Laboratories client registration form.</p>

<p>We have received your details and will review your request.</p>

<p>A member of our team will revert back to you with more information and next steps as soon as possible.</p>

<p>Kind regards,<br>
<strong>Leeukopf Laboratories</strong><br>
<a href="mailto:info@leeukopf.com">info@leeukopf.com</a></p>
`;
}

// JWT expiration time in seconds (1 hour)
const JWT_EXPIRATION_SECONDS = 3600;

// Get OAuth access token using jose for JWT signing
async function getGoogleAccessToken(serviceAccountEmail: string, privateKey: string): Promise<string> {
  // Normalize the private key exactly as specified
  const rawKey = privateKey || "";
  let key = rawKey.trim();
  
  // Remove wrapping quotes if present
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  
  // Restore newlines if stored with escaped \n
  key = key.replace(/\\n/g, "\n");
  
  // Also handle accidental \r\n sequences
  key = key.replace(/\\r\\n/g, "\n");
  
  // Strict validation before importPKCS8
  if (!key.includes("-----BEGIN PRIVATE KEY-----") || !key.includes("-----END PRIVATE KEY-----")) {
    throw new Error("GOOGLE_PRIVATE_KEY is not a valid PKCS#8 PEM. Check header/footer and newline formatting.");
  }
  
  // Safe debug logs (no secrets)
  console.log("GOOGLE_PRIVATE_KEY length:", key.length);
  console.log("GOOGLE_PRIVATE_KEY header ok:", key.startsWith("-----BEGIN PRIVATE KEY-----"));
  
  // Import the private key for RS256 signing
  const privateKeyObj = await jose.importPKCS8(key, 'RS256');

  // Create JWT assertion
  const now = Math.floor(Date.now() / 1000);
  const jwt = await new jose.SignJWT({
    scope: 'https://www.googleapis.com/auth/spreadsheets',
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(serviceAccountEmail)
    .setSubject(serviceAccountEmail)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt(now)
    .setExpirationTime(now + JWT_EXPIRATION_SECONDS)
    .sign(privateKeyObj);

  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    console.error('Failed to get OAuth access token:', tokenResponse.status);
    throw new Error(`Failed to get access token: ${tokenResponse.status}`);
  }

  const tokenData = (await tokenResponse.json()) as { access_token: string };
  return tokenData.access_token;
}

// Append data to Google Sheets using jose for authentication
async function appendToGoogleSheets(formData: FormData): Promise<void> {
  console.log('FUNCTION VERSION: prod-force-upload-2025-12-17-1016');

  const { serviceAccountEmail, privateKey } = getGoogleCredentials();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetTab = process.env.GOOGLE_SHEET_TAB || 'Raw_Leads';

  if (!spreadsheetId) {
    console.error('Missing Google Sheets configuration');
    throw new Error('Google Sheets configuration is incomplete');
  }

  // Get OAuth access token using jose
  const accessToken = await getGoogleAccessToken(serviceAccountEmail, privateKey);

  // Format data in exact column order matching the header:
  // Timestamp, Source, Page, Company, Contact, Role, Email, Phone, Country, Country Other, 
  // District, Postal Code, Street, Billing Address, Shipping Address, Website, Instagram, 
  // Business Type, Interests, Monthly Volume, VAT Registration, Interest: Distribution, 
  // Interest: Private Label, Request Sample Box, Notes, GDPR Consent, Honeypot, Client Type,
  // Countries Covered, Distribution Channels, Estimated Monthly Volume, Years in Business,
  // Brand Name, Product Interest, Target MOQ, Target Launch Date,
  // Country Audience, Avg Views
  const interestsStr = Array.isArray(formData.interests) ? formData.interests.join(", ") : "";

  const row = [
    new Date().toISOString(),
    formData.source || "Website Form",
    formData.page || "Client Registration",
    formData.company || "",
    formData.contact || "",
    formData.role || "",
    formData.email || "",
    formData.phone || "",
    formData.country || "",
    formData.countryOther || "",
    formData.district || "",
    formData.postalCode || "",
    formData.street || "",
    formData.billingAddress || "",
    formData.shippingAddress || "",
    formData.website || "",
    formData.instagram || "",
    formData.businessType || "",
    interestsStr,
    formData.monthlyVolume || "",
    formData.vatEori || "",
    formData.interestDistribution ? "Yes" : "No",
    formData.interestPrivateLabel ? "Yes" : "No",
    formData.requestSampleBox ? "Yes" : "No",
    formData.notes || "",
    formData.gdprConsent ? "Yes" : "No",
    formData.honeypot || "",
    formData.client_type || "",
    // Distributors fields
    formData.countries_covered || "",
    formData.distribution_channels || "",
    formData.estimated_monthly_volume || "",
    formData.years_in_business || "",
    // Private Label fields
    formData.brand_name || "",
    formData.product_interest || "",
    formData.target_moq || "",
    formData.target_launch_date || "",
    // Influencers fields
    formData.country_audience || "",
    formData.avg_views || "",
  ];

  try {
    // Call Google Sheets API directly using fetch with the access token
    const appendResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTab}!A2:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [row],
        }),
      }
    );

    if (!appendResponse.ok) {
      console.error('Failed to append to Google Sheets:', appendResponse.status);
      const errorBody = await appendResponse.text();
      console.error('Sheets API error body:', errorBody);
      throw new Error(`Failed to append to Google Sheets: ${appendResponse.status} - ${errorBody}`);
    }

    console.log('Successfully appended data to Google Sheets');
  } catch (error) {
    console.error('Error appending to Google Sheets:', error);
    throw error;
  }
}

async function persistClientRegistration(formData: FormData): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('[client-registration-email] Supabase persistence skipped: missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { error } = await supabase
    .from('client_registrations')
    .insert({
      company: formData.company?.trim() || null,
      contact: formData.contact?.trim() || null,
      email: formData.email?.trim().toLowerCase() || null,
      country: formData.country?.trim() || null,
      business_type: formData.businessType?.trim() || null,
    });

  if (error) {
    throw new Error(`Failed to persist client registration: ${error.message}`);
  }
}

const handler: Handler = async (event: HandlerEvent) => {
  console.log('FUNCTION VERSION: prod-force-upload-2025-12-17-1016');
  
  const requestOrigin = event.headers.origin || event.headers.Origin;
  
  const headers = {
    'Access-Control-Allow-Origin': getAllowedOrigin(requestOrigin),
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Check for API key
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error('RESEND_API_KEY environment variable is not set');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Email service not configured' }),
    };
  }

  // Parse request body
  let formData: FormData;
  try {
    formData = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid request body' }),
    };
  }

  // Check honeypot field (spam protection)
  if (formData.honeypot) {
    console.log('Honeypot triggered - potential spam');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }), // Return success to prevent spam detection
    };
  }

  // Validate required fields
  if (!formData.company || !formData.contact || !formData.email || !formData.country || !formData.businessType) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  const resend = new Resend(resendApiKey);

  try {
    // Send internal notification email
    console.log('Sending internal notification email to info@leeukopf.com');
    const internalEmailBody = generateInternalEmailBody(formData);
    
    const internalEmailResult = await resend.emails.send({
      from: 'Leeukopf Website <noreply@leeukopf.com>',
      to: 'info@leeukopf.com',
      subject: 'New Client Registration Form Submission',
      html: internalEmailBody,
    });
    console.log('Internal email sent successfully:', internalEmailResult.id);

    // Send auto-reply to client
    console.log('Sending auto-reply email to:', formData.email);
    const autoReplyBody = generateAutoReplyBody();
    
    const autoReplyResult = await resend.emails.send({
      from: 'Leeukopf Laboratories <info@leeukopf.com>',
      to: formData.email,
      subject: 'Thank you for completing the client registration form',
      html: autoReplyBody,
    });
    console.log('Auto-reply email sent successfully:', autoReplyResult.id);

    // Append data to Google Sheets
    console.log('Appending data to Google Sheets...');
    try {
      await appendToGoogleSheets(formData);
    } catch (sheetsError) {
      console.error('Failed to append to Google Sheets:', sheetsError);
      // Continue execution - email was sent successfully
      // We'll still return success but log the Sheets error
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          warning: 'Email sent but failed to log to spreadsheet'
        }),
      };
    }

    // Persist registration for Admin Dashboard approvals
    console.log('Persisting registration to Supabase client_registrations...');
    try {
      await persistClientRegistration(formData);
    } catch (persistError) {
      console.error('Failed to persist registration to Supabase:', persistError);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          warning: 'Submission accepted but failed to queue for admin approval list',
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('Error sending emails:', err);
    console.error('Error details:', {
      message: err instanceof Error ? err.message : 'Unknown error',
      name: err instanceof Error ? err.name : 'Unknown',
      stack: err instanceof Error ? err.stack : undefined
    });
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false,
        error: 'Failed to send emails',
        details: err instanceof Error ? err.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
