import type { Handler, HandlerEvent } from '@netlify/functions';
import { Resend } from 'resend';

// Configure the function path
export const config = {
  path: '/api/send-contact-email'
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
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

// Generate email body
function generateEmailBody(formData: ContactFormData): string {
  return `
<h2>New Contact Form Submission</h2>

<p><strong>From:</strong> ${formData.name}</p>
<p><strong>Email:</strong> ${formData.email}</p>
<p><strong>Subject:</strong> ${formData.subject}</p>

<h3>Message:</h3>
<p>${formData.message.replace(/\n/g, '<br>')}</p>

<hr>
<p style="font-size: 12px; color: #666;">
  This message was sent from the Leeukopf website contact form.
</p>
`;
}

// Generate auto-reply email body
function generateAutoReplyBody(name: string): string {
  return `
<p>Dear ${name},</p>

<p>Thank you for contacting Leeukopf Laboratories.</p>

<p>We have received your message and will respond as soon as possible. Our team typically replies within 24-48 hours during business days.</p>

<p>If your inquiry is urgent, please feel free to call us at (+359) 73 891 041.</p>

<p>Kind regards,<br>
<strong>Leeukopf Laboratories</strong><br>
<a href="mailto:info@leeukopf.com">info@leeukopf.com</a></p>
`;
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
  let formData: ContactFormData;
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
  if (!formData.name || !formData.email || !formData.subject || !formData.message) {
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
    const emailBody = generateEmailBody(formData);
    
    const internalEmailResult = await resend.emails.send({
      from: 'Leeukopf Website <noreply@leeukopf.com>',
      to: 'info@leeukopf.com',
      subject: `Website Contact: ${formData.subject}`,
      html: emailBody,
      replyTo: formData.email,
    });
    console.log('Internal email sent successfully:', internalEmailResult.id);

    // Send auto-reply to the sender
    console.log('Sending auto-reply email to:', formData.email);
    const autoReplyBody = generateAutoReplyBody(formData.name);
    
    const autoReplyResult = await resend.emails.send({
      from: 'Leeukopf Laboratories <info@leeukopf.com>',
      to: formData.email,
      subject: 'Thank you for contacting Leeukopf Laboratories',
      html: autoReplyBody,
    });
    console.log('Auto-reply email sent successfully:', autoReplyResult.id);

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
        error: 'Failed to send emails',
        details: err instanceof Error ? err.message : 'Unknown error'
      }),
    };
  }
};

export { handler };
