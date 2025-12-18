import type { Handler, HandlerEvent } from '@netlify/functions';
import { Resend } from 'resend';
import * as jose from 'jose';
import { webcrypto } from 'crypto';

// Polyfill global crypto for jose on Netlify
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = webcrypto as any;
}

// Force deployment version marker
const __force = 'prod-force-upload-2025-12-17-1016';

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
  businessType: string;
  interests: string[];
  interestPrivateLabel?: boolean;
  interestDistribution?: boolean;
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

<h3>Business Details</h3>
<p><strong>Business Type:</strong> ${formData.businessType}</p>
<p><strong>Business Interest:</strong> ${[
  formData.interestPrivateLabel ? 'Private Label' : '',
  formData.interestDistribution ? 'Distribution' : ''
].filter(Boolean).join(', ')}</p>
<p><strong>Product Interests:</strong> ${formData.interests.length > 0 ? formData.interests.join(', ') : 'None specified'}</p>
${formData.monthlyVolume ? `<p><strong>Estimated Monthly Volume:</strong> ${formData.monthlyVolume}</p>` : ''}
${formData.vatEori ? `<p><strong>VAT/EORI Number:</strong> ${formData.vatEori}</p>` : ''}

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

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

// Append data to Google Sheets using jose for authentication
async function appendToGoogleSheets(formData: FormData): Promise<void> {
  console.log('FUNCTION VERSION: prod-force-upload-2025-12-17-1016');
  
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetTab = process.env.GOOGLE_SHEET_TAB || 'Raw_Leads';

  if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
    console.error('Missing Google Sheets configuration');
    throw new Error('Google Sheets configuration is incomplete');
  }

  // Get OAuth access token using jose
  const accessToken = await getGoogleAccessToken(serviceAccountEmail, privateKey);

  // Format data in exact column order matching the header:
  // Timestamp, Source, Page, Company, Contact, Role, Email, Phone, Country, Country Other, 
  // District, Postal Code, Street, Billing Address, Shipping Address, Website, Instagram, 
  // Business Type, Interests, Monthly Volume, VAT/EORI, Interest: Distribution, 
  // Interest: Private Label, Request Sample Box, Notes, GDPR Consent, Honeypot
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
