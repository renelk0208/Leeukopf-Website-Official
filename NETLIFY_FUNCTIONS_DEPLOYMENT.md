# Netlify Functions Deployment Guide

This document explains how Netlify Functions are configured and deployed for the Leeukopf website.

## Overview

The website uses **Netlify Functions** for serverless backend functionality. Functions are automatically deployed when code is pushed to the `main` branch.

## Function Configuration

### Path-Based Routing (Recommended)

All functions use path-based routing via the `export const config` syntax. This is the modern approach recommended by Netlify.

**Example:**
```typescript
export const config = {
  path: '/api/my-function'
};
```

This configuration tells Netlify to route requests to `/api/my-function` directly to this function, without needing redirects in `netlify.toml`.

## Available Functions

### 1. Test Email Function
- **File:** `netlify/functions/test-email.ts`
- **Path:** `/api/test-email`
- **Method:** GET
- **Purpose:** Test endpoint to verify Netlify Functions are working
- **Response:** JSON with success message and timestamp

**Test:**
```bash
curl https://leeukopf.com/api/test-email
```

Expected response:
```json
{
  "success": true,
  "message": "Netlify Function is working correctly!",
  "timestamp": "2025-12-08T12:00:00.000Z",
  "path": "/api/test-email",
  "method": "GET"
}
```

### 2. Send Contact Email Function
- **File:** `netlify/functions/send-contact-email.ts`
- **Path:** `/api/send-contact-email`
- **Method:** POST
- **Purpose:** Send contact form submissions via email
- **Requirements:** `RESEND_API_KEY` environment variable

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "Hello..."
}
```

### 3. Instagram Feed Function
- **File:** `netlify/functions/instagram-feed.ts`
- **Path:** `/api/instagram`
- **Method:** GET
- **Purpose:** Fetch Instagram feed data
- **Requirements:** `IG_ACCESS_TOKEN`, `IG_USER_ID` environment variables

### 4. Client Registration Email Function
- **File:** `netlify/functions/send-client-registration-email.ts`
- **Path:** `/api/client-registration-email`
- **Method:** POST
- **Purpose:** Send client registration form submissions
- **Requirements:** `RESEND_API_KEY` environment variable

## Configuration Files

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

# SPA catch-all redirect
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Key Points:**
- Functions directory is set to `netlify/functions`
- The SPA catch-all redirect (`/*`) is LAST and only applies to routes not handled by functions
- No explicit redirects needed for API routes because functions use path configuration

## Deployment Process

### 1. Build Phase
```bash
npm run build
```

This creates the `dist` folder with the static site, but **does NOT include functions**.

### 2. Functions Deployment
Netlify automatically:
1. Detects TypeScript files in `netlify/functions/`
2. Compiles them to JavaScript
3. Deploys them as serverless functions
4. Routes requests based on the `path` configuration in each function

### 3. Verification

After deployment, verify each function:

```bash
# Test the test endpoint
curl https://leeukopf.com/api/test-email

# Test Instagram feed
curl https://leeukopf.com/api/instagram

# Test contact email (requires POST with data)
curl -X POST https://leeukopf.com/api/send-contact-email \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Testing"}'
```

**Expected:** Each endpoint should return JSON responses, NOT the index.html page.

## Environment Variables

Set these in Netlify Dashboard → Site Settings → Environment Variables:

### Required for Email Functions:
- `RESEND_API_KEY`: API key for Resend email service

### Required for Instagram Function:
- `IG_ACCESS_TOKEN`: Instagram API access token
- `IG_USER_ID`: Instagram user ID

### Optional:
- `IG_CACHE_TTL_SECONDS`: Cache duration for Instagram feed (default: 300)
- `IG_GRAPH_API_VERSION`: Facebook Graph API version (default: v18.0)

## Troubleshooting

### Issue: API endpoint returns index.html instead of function response

**Possible Causes:**
1. Function not deployed or failed to build
2. Path configuration missing or incorrect
3. Netlify Functions build error

**Solutions:**
1. Check Netlify deploy logs for function build errors
2. Verify function has `export const config = { path: '/api/...' }`
3. Ensure function is in `netlify/functions/` directory
4. Run verification script: `./scripts/verify-netlify-deployment.sh`

### Issue: Function returns 500 error

**Possible Causes:**
1. Missing environment variables
2. Runtime error in function code
3. API rate limits exceeded

**Solutions:**
1. Check Netlify function logs
2. Verify environment variables are set
3. Test locally with Netlify CLI: `netlify dev`

### Issue: CORS errors

All functions include proper CORS headers. If you see CORS errors:
1. Check the `getAllowedOrigin()` function in each file
2. Ensure your domain is in the allowed origins list
3. For local development, ensure localhost ports are allowed

## Local Development

### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

### 2. Create `.env` file
```bash
cp .env.example .env
# Edit .env and add your API keys
```

### 3. Run locally
```bash
netlify dev
```

This starts:
- Vite dev server on port 5173
- Netlify Functions on `/.netlify/functions/*`
- Automatic function reloading on code changes

### 4. Test functions locally
```bash
curl http://localhost:8888/api/test-email
```

## Verification Script

Run the verification script to check deployment readiness:

```bash
./scripts/verify-netlify-deployment.sh
```

This script checks:
- ✅ Build output exists
- ✅ All functions are present
- ✅ Functions have path configuration
- ✅ netlify.toml is correctly configured
- ✅ No conflicting redirect files

## Best Practices

1. **Always use path configuration** in functions instead of netlify.toml redirects
2. **Test functions locally** with `netlify dev` before deploying
3. **Monitor function logs** in Netlify dashboard after deployment
4. **Set appropriate cache headers** for better performance
5. **Validate input** and handle errors gracefully
6. **Use environment variables** for sensitive data (never commit secrets)

## Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Netlify Functions Examples](https://github.com/netlify/functions-examples)
- [Resend Email API](https://resend.com/docs)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api/)
