# Email Service Setup for Client Registration Form

This document describes the email functionality for the Client Registration Form and how to configure it.

## Overview

When a user submits the Client Registration Form, two emails are automatically sent:

1. **Internal Email** - Sent to `info@leeukopf.com` with all form details
2. **Auto-Reply Email** - Sent to the client as a confirmation

## Email Service: Resend

We use [Resend](https://resend.com) as the email service provider. Resend offers:
- Simple API
- High deliverability
- Easy domain verification
- Free tier available

## Setup Instructions

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your account

### 2. Verify Your Domain

To send emails from `@leeukopf.com`, you need to verify the domain:

1. In Resend dashboard, go to "Domains"
2. Add domain: `leeukopf.com`
3. Add the DNS records Resend provides to your domain's DNS settings
4. Wait for verification (usually takes a few minutes to a few hours)

### 3. Get Your API Key

1. In Resend dashboard, go to "API Keys"
2. Create a new API key
3. Copy the key (it will only be shown once)

### 4. Configure Netlify Environment Variables

Add the following environment variable in your Netlify dashboard:

1. Go to your Netlify site dashboard
2. Navigate to: Site settings → Environment variables
3. Add variable:
   - **Key**: `RESEND_API_KEY`
   - **Value**: Your Resend API key from step 3

### 5. Deploy

Once the environment variable is set, deploy your site. The email functionality will be active.

## Testing

### Development Testing

For local development testing:

1. Add `RESEND_API_KEY` to your local `.env` file (copy from `.env.example`)
2. Run `netlify dev` to test the function locally
3. Submit a test form to verify emails are sent

### Production Testing

After deployment:

1. Go to the Client Registration page
2. Fill out and submit the form with a test email address
3. Verify that:
   - You receive the auto-reply at the submitted email address
   - The internal team receives the notification at info@leeukopf.com

## Email Templates

### Internal Email (to info@leeukopf.com)

Subject: **New Client Registration Form Submission**

Contains all submitted form fields including:
- Company information
- Contact details
- Business details
- Product interests
- Addresses
- Notes
- Attachments (if any)

### Auto-Reply Email (to client)

Subject: **Thank you for completing the client registration form**

A simple confirmation message letting the client know:
- Their submission was received
- The team will review and respond soon

## Troubleshooting

### Emails Not Sending

1. **Check API Key**: Verify `RESEND_API_KEY` is set in Netlify environment variables
2. **Check Domain Verification**: Ensure leeukopf.com is verified in Resend
3. **Check Netlify Function Logs**: View logs in Netlify dashboard under Functions tab
4. **Check Form Submission**: Verify the form data is reaching the function

### Emails Going to Spam

1. Verify SPF, DKIM, and DMARC records are properly configured
2. Check with Resend support for deliverability improvements
3. Consider using a dedicated sending domain

## Security

- API keys are stored as environment variables (never in code)
- Honeypot field prevents spam submissions
- CORS headers restrict function access to approved domains
- Email validation prevents malformed submissions

## Cost

Resend offers:
- **Free tier**: 3,000 emails/month
- **Pro tier**: Starting at $20/month for 50,000 emails/month

For typical use, the free tier should be sufficient.

## Alternative Email Services

If you prefer a different service, the function can be adapted to use:
- **SendGrid**: Another popular email service
- **AWS SES**: Amazon's email service
- **Mailgun**: Email service with good deliverability
- **Postmark**: Transactional email service

To switch services, update the `send-client-registration-email.ts` function and install the corresponding npm package.

## Support

For issues with:
- **Resend service**: Contact [Resend support](https://resend.com/support)
- **Email function code**: Check the source in `netlify/functions/send-client-registration-email.ts`
- **Form submission**: Check the source in `src/pages/ClientRegistrationPage.tsx`
