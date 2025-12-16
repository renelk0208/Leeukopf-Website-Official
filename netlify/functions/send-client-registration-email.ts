import type { Handler, HandlerEvent } from '@netlify/functions';
import { Resend } from 'resend';
import { google } from 'googleapis';

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
  website?: string;
  instagram?: string;
  businessType: string;
  interests: string[];
  monthlyVolume?: string;
  vatEori?: string;
  billingAddress?: string;
  shippingAddress?: string;
  language: string;
  notes?: string;
  attachments?: Array<{ filename: string; url: string }>;
  honeypot?: string;
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
<p><strong>Country:</strong> ${formData.country}</p>
${formData.website ? `<p><strong>Website:</strong> ${formData.website}</p>` : ''}
${formData.instagram ? `<p><strong>Instagram:</strong> ${formData.instagram}</p>` : ''}

<h3>Business Details</h3>
<p><strong>Business Type:</strong> ${formData.businessType}</p>
<p><strong>Product Interests:</strong> ${formData.interests.length > 0 ? formData.interests.join(', ') : 'None specified'}</p>
${formData.monthlyVolume ? `<p><strong>Estimated Monthly Volume:</strong> ${formData.monthlyVolume}</p>` : ''}
${formData.vatEori ? `<p><strong>VAT/EORI Number:</strong> ${formData.vatEori}</p>` : ''}

<h3>Addresses</h3>
${formData.billingAddress ? `<p><strong>Billing Address:</strong><br>${formData.billingAddress.replace(/\n/g, '<br>')}</p>` : ''}
${formData.shippingAddress ? `<p><strong>Shipping Address:</strong><br>${formData.shippingAddress.replace(/\n/g, '<br>')}</p>` : ''}

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

// Append data to Google Sheets
async function appendToGoogleSheets(formData: FormData): Promise<void> {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetTab = process.env.GOOGLE_SHEET_TAB || 'Raw_Leads';

  if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
    console.error('Missing Google Sheets configuration');
    throw new Error('Google Sheets configuration is incomplete');
  }

  // Replace \\n with actual newlines in the private key
  const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

  // Authenticate with Google Sheets API
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceAccountEmail,
      private_key: formattedPrivateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Format data in exact column order:
  // Timestamp, Source, Page, company, contact, role, email, phone, country, website, 
  // instagram, businessType, interests (comma separated), monthlyVolume, vatEori, 
  // billingAddress, shippingAddress, language, notes, gdprConsent (Yes/No), Lead Status (New)
  const timestamp = new Date().toISOString();
  const source = 'Website Form';
  const page = 'Client Registration';
  const gdprConsentText = 'Yes'; // Form requires consent to submit
  const leadStatus = 'New';
  const interestsText = formData.interests.join(', ');

  const rowData = [
    timestamp,
    source,
    page,
    formData.company || '',
    formData.contact || '',
    formData.role || '',
    formData.email || '',
    formData.phone || '',
    formData.country || '',
    formData.website || '',
    formData.instagram || '',
    formData.businessType || '',
    interestsText,
    formData.monthlyVolume || '',
    formData.vatEori || '',
    formData.billingAddress || '',
    formData.shippingAddress || '',
    formData.language || '',
    formData.notes || '',
    gdprConsentText,
    leadStatus,
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetTab}!A:U`, // Columns A through U (21 columns)
      valueInputOption: 'RAW',
      requestBody: {
        values: [rowData],
      },
    });
    console.log('Successfully appended data to Google Sheets');
  } catch (error) {
    console.error('Error appending to Google Sheets:', error);
    throw error;
  }
}

const handler: Handler = async (event: HandlerEvent) => {
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
