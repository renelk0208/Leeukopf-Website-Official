# Testing Form Endpoints - Step by Step Guide

This guide helps you verify that both form submission endpoints are working correctly with absolute paths.

## Quick Test Checklist

After deployment, follow these steps:

### 1. Clear Cache
- **Chrome/Edge:** Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- **Firefox:** Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- Or use **Incognito/Private Window** for a fresh test

### 2. Open DevTools
- Press `F12` or `Ctrl+Shift+I` (Windows) or `Cmd+Option+I` (Mac)
- Go to the **Network** tab
- Check "Preserve log" to keep requests visible

### 3. Test Contact Form

1. Navigate to the homepage: `https://leeukopf.com/`
2. Scroll to the "Get In Touch" section
3. Fill in the form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Subject: `Testing Form`
   - Message: `This is a test submission`
4. Click "Send Message"
5. In DevTools Network tab, look for the request:

   ✅ **Expected Request URL:** `/api/contact-email`  
   ✅ **Expected Status:** `200 OK`  
   ✅ **Expected Response Type:** `application/json`  
   ✅ **Expected Response:** `{"success": true}`

   ❌ **Bad Signs:**
   - Request URL: `api/contact-email` (no leading slash)
   - Status: `404 Not Found`
   - Response starts with `<!DOCTYPE` (HTML instead of JSON)

### 4. Test Client Registration Form

1. Navigate to: `https://leeukopf.com/client-registration`
2. Fill in required fields (marked with *):
   - Company / Brand Name: `Test Company`
   - Contact Name: `Test User`
   - Email: `test@example.com`
   - Country: Select any country
   - Business Type: Select any type
   - Check the GDPR consent checkbox
3. Click "Submit Registration"
4. In DevTools Network tab, look for the request:

   ✅ **Expected Request URL:** `/api/client-registration-email`  
   ✅ **Expected Status:** `200 OK`  
   ✅ **Expected Response Type:** `application/json`  
   ✅ **Expected Response:** `{"success": true}`

   ❌ **Bad Signs:**
   - Request URL: `api/client-registration-email` (no leading slash)
   - Status: `404 Not Found`
   - Response starts with `<!DOCTYPE` (HTML instead of JSON)

## What to Look For in DevTools

### Good Response Example (200 OK)

```
Request URL: https://leeukopf.com/api/contact-email
Request Method: POST
Status Code: 200 OK
Content-Type: application/json

Response:
{
  "success": true
}
```

### Bad Response Example (404 Not Found)

```
Request URL: https://leeukopf.com/api/contact-email
Request Method: POST
Status Code: 404 Not Found
Content-Type: text/html

Response:
<!DOCTYPE html>
<html>...
```

**This indicates:** The function wasn't found, likely due to:
- Deployment issue
- Environment variables not set (RESEND_API_KEY)
- Netlify Functions not deployed

## Troubleshooting

### If you see 404 errors:

1. **Check Netlify Deployment:**
   - Go to Netlify dashboard
   - Check if the deployment succeeded
   - Look for Functions in the deployment log

2. **Check Environment Variables:**
   - Go to Netlify → Site settings → Environment variables
   - Verify `RESEND_API_KEY` is set

3. **Check Netlify Functions:**
   - Go to Netlify → Functions tab
   - You should see:
     - `send-contact-email`
     - `send-client-registration-email`
     - `instagram-feed`
     - `test-email`

### If you see relative paths (without `/`):

This means your browser is using cached JavaScript from before this fix:

1. **Hard Refresh:**
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

2. **Clear Site Data:**
   - DevTools → Application tab → Clear storage → Clear site data

3. **Use Incognito/Private Mode:**
   - This always uses a fresh cache

### If responses are HTML instead of JSON:

This indicates a 404 or 500 error. Common causes:

1. **Function Not Deployed:**
   - Check Netlify deployment logs
   - Verify functions built successfully

2. **Function Error:**
   - Check Netlify Function logs
   - Look for runtime errors

3. **Missing Environment Variable:**
   - Check `RESEND_API_KEY` is set in Netlify

## Testing Locally

You can also test locally before deployment:

### Using Netlify Dev (Recommended)

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Set up environment variables
# Copy .env.example to .env and fill in RESEND_API_KEY

# Start Netlify Dev
netlify dev
```

This starts a local server that simulates Netlify's environment, including Functions.

### Using Vite Dev Server (Limited)

```bash
npm run dev
```

**Note:** This won't work for testing Netlify Functions, as they require Netlify's runtime.

## Expected Flow

### Contact Form Success Flow

1. User fills form and clicks "Send Message"
2. JavaScript sends POST to `/api/contact-email`
3. Netlify Function receives request
4. Function validates honeypot field
5. Function sends email via Resend
6. Function returns `{"success": true}`
7. UI shows green success message

### Client Registration Success Flow

1. User fills form and clicks "Submit Registration"
2. JavaScript validates all required fields
3. JavaScript sends POST to `/api/client-registration-email`
4. Netlify Function receives request
5. Function validates honeypot field
6. Function sends two emails via Resend:
   - One to `info@leeukopf.com` with registration details
   - One to client's email as confirmation
7. Function returns `{"success": true}`
8. UI shows green success banner

## Need More Help?

If issues persist after:
- ✅ Clearing all caches
- ✅ Testing in incognito mode
- ✅ Verifying deployment succeeded

Provide these details:

1. **Screenshot of DevTools Network tab** showing:
   - Request URL (full URL visible)
   - Status code
   - Response Headers tab
   - Response Preview/Response tab

2. **Environment details:**
   - Browser and version
   - Operating System
   - Whether testing locally or on production
   - Netlify deployment URL

3. **Netlify details:**
   - Deployment status
   - Function logs (if accessible)
   - Build logs

This will help identify if there's a Netlify configuration issue or something else.
