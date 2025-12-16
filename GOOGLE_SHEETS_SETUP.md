# Google Sheets Integration Setup

This guide explains how to set up the Google Sheets integration for the client registration email function.

## Overview

When a user submits the client registration form, the system:
1. Sends an internal notification email to info@leeukopf.com
2. Sends an auto-reply email to the client
3. **Appends the submission data to a Google Sheets spreadsheet**

## Prerequisites

- A Google Cloud Platform account
- A Google Sheets spreadsheet for storing leads

## Setup Steps

### 1. Create a Google Cloud Service Account

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **IAM & Admin** > **Service Accounts**
4. Click **Create Service Account**
5. Give it a name (e.g., "Leeukopf Leads Integration")
6. Click **Create and Continue**
7. Skip the optional steps and click **Done**

### 2. Generate Service Account Key

1. Click on the newly created service account
2. Go to the **Keys** tab
3. Click **Add Key** > **Create new key**
4. Select **JSON** format
5. Click **Create** - this will download a JSON file

### 3. Extract Credentials from JSON

Open the downloaded JSON file and extract these values:
- `client_email` - This is your `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` - This is your `GOOGLE_PRIVATE_KEY`

### 4. Enable Google Sheets API

1. In Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google Sheets API"
3. Click on it and click **Enable**

### 5. Create and Configure Your Google Sheet

1. Create a new Google Sheet or use an existing one
2. Create a tab named `Raw_Leads` (or use a custom name)
3. Add headers in the first row (optional but recommended):
   ```
   Timestamp | Source | Page | Company | Contact | Role | Email | Phone | Country | Website | Instagram | Business Type | Interests | Monthly Volume | VAT/EORI | Billing Address | Shipping Address | Language | Notes | GDPR Consent | Lead Status
   ```

4. Share the spreadsheet with the service account email:
   - Click **Share** in the top right
   - Paste the service account email (`GOOGLE_SERVICE_ACCOUNT_EMAIL`)
   - Give it **Editor** permissions
   - Click **Send**

5. Get the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
   ```

### 6. Configure Environment Variables in Netlify

Add the following environment variables in your Netlify dashboard:

1. Go to **Site settings** > **Environment variables**
2. Add these variables:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----
GOOGLE_SHEET_ID=your_spreadsheet_id_here
GOOGLE_SHEET_TAB=Raw_Leads
```

**Important Notes:**
- The `GOOGLE_PRIVATE_KEY` should include the `\n` characters (not actual newlines)
- Copy the entire private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- The function will automatically convert `\n` to actual newlines

### 7. Redeploy Your Site

After adding the environment variables:
1. Trigger a new deployment in Netlify
2. The function will now append form submissions to your Google Sheet

## Testing

To test the integration:

1. Submit a test form on your website
2. Check that emails were sent successfully
3. Open your Google Sheet and verify that a new row was added
4. Check the Netlify function logs for any errors

## Data Structure

Each submission creates a row with 21 columns in this exact order:

1. **Timestamp** - ISO 8601 format (e.g., "2024-12-16T09:00:00.000Z")
2. **Source** - Always "Website Form"
3. **Page** - Always "Client Registration"
4. **Company** - Company/brand name
5. **Contact** - Contact person's name
6. **Role** - Contact person's role/title
7. **Email** - Contact email address
8. **Phone** - Phone number
9. **Country** - Selected country
10. **Website** - Company website URL
11. **Instagram** - Instagram handle
12. **Business Type** - Type of business (Distributor, Salon Supply, etc.)
13. **Interests** - Comma-separated list of product interests
14. **Monthly Volume** - Estimated monthly volume
15. **VAT/EORI** - VAT or EORI number
16. **Billing Address** - Billing address
17. **Shipping Address** - Shipping address
18. **Language** - Preferred language (EN, EL, BG, Other)
19. **Notes** - Additional notes/requirements
20. **GDPR Consent** - Always "Yes" (form requires consent)
21. **Lead Status** - Always "New"

## Troubleshooting

### "Google Sheets configuration is incomplete" error

- Verify all environment variables are set correctly in Netlify
- Make sure there are no extra spaces in the variable values
- Redeploy the site after adding variables

### "Permission denied" error

- Ensure the spreadsheet is shared with the service account email
- Verify the service account has "Editor" permissions
- Check that the Google Sheets API is enabled in Google Cloud Console

### Private key format issues

- Make sure the private key includes `\n` characters (not actual newlines) in the environment variable
- The key should start with `-----BEGIN PRIVATE KEY-----\n`
- The key should end with `\n-----END PRIVATE KEY-----\n`

### Data not appearing in Sheet

- Check the Netlify function logs for errors
- Verify the spreadsheet ID is correct
- Ensure the tab name matches exactly (case-sensitive)
- Check that the service account has edit permissions

## Error Handling

The function is designed to be resilient:
- If Google Sheets append fails, the emails will still be sent
- The form submission will still show as successful to the user
- Errors are logged in the Netlify function logs for debugging
- A warning is returned in the response if Sheets append fails but emails succeed

## Security Considerations

- The service account key is sensitive - never commit it to version control
- Store it only in Netlify environment variables
- Limit the service account's access to only the necessary spreadsheet
- Regularly rotate service account keys (every 90 days recommended)
- Monitor the Netlify function logs for suspicious activity
