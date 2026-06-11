# Netlify Functions Deployment Testing Checklist

After merging this PR and deploying to Netlify, use this checklist to verify everything is working correctly.

## Pre-Deployment Verification (Already Done)

- ✅ All 4 functions exist in `netlify/functions/`
- ✅ All functions have `export const config = { path: '/api/...' }`
- ✅ netlify.toml has correct configuration
- ✅ Build completes successfully
- ✅ TypeScript compilation passes
- ✅ Linter passes
- ✅ Security scan passed (CodeQL - 0 alerts)

## Post-Deployment Testing

### 1. Check Netlify Build Logs

1. Go to Netlify Dashboard → Site → Deploys
2. Open the latest deploy
3. Check the build log for:
   - ✅ "Building functions..."
   - ✅ "4 new functions to upload" (or similar)
   - ✅ No function build errors

### 2. Test the Test Endpoint

This endpoint should work immediately and requires no environment variables:

```bash
curl https://leeukopf.com/api/test-email
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Netlify Function is working correctly!",
  "timestamp": "2025-12-08T...",
  "path": "/api/test-email",
  "method": "GET"
}
```

**❌ If you get HTML instead:**
- The function is not being routed correctly
- Check Netlify build logs for function deployment errors
- Verify the function has the correct path configuration

### 3. Test Instagram Feed Function

**Requirements:** `IG_ACCESS_TOKEN` and `IG_USER_ID` environment variables must be set

```bash
curl https://leeukopf.com/api/instagram
```

**Expected Response:**
```json
{
  "items": [...],
  "error": null
}
```

**If you get an error:**
- Check Netlify environment variables are set
- Check function logs in Netlify Dashboard

### 4. Test Contact Form

1. Visit https://leeukopf.com/contact
2. Fill out the contact form
3. Submit

**Expected Behavior:**
- Form shows "Sending..." state
- On success: Green success message appears
- User receives auto-reply email
- info@leeukopf.com receives the contact form submission

**If it fails:**
- Check browser console for errors
- Check Network tab for the API request
- Verify `RESEND_API_KEY` is set in Netlify environment variables
- Check function logs in Netlify Dashboard

### 5. Test Client Registration Form

1. Visit https://leeukopf.com/client-registration
2. Fill out the registration form
3. Submit

**Expected Behavior:**
- Form submits successfully
- User receives confirmation email
- info@leeukopf.com receives the registration details

## Environment Variables Checklist

Verify these are set in Netlify Dashboard → Site Settings → Environment Variables:

### Required:
- [ ] `RESEND_API_KEY` - For email sending
- [ ] `IG_ACCESS_TOKEN` - For Instagram feed
- [ ] `IG_USER_ID` - For Instagram feed

### Optional:
- [ ] `IG_CACHE_TTL_SECONDS` - Default: 300
- [ ] `IG_GRAPH_API_VERSION` - Default: v18.0

## Function Logs

If any function fails, check the logs:

1. Go to Netlify Dashboard → Functions
2. Click on the function name
3. View recent invocations and logs

Common issues:
- Missing environment variables
- API rate limits
- Invalid credentials
- Network errors

## Browser Testing

Test the contact form in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if available)

Test on different devices:
- [ ] Desktop
- [ ] Tablet
- [ ] Mobile

## Security Verification

Verify these security features are working:

### Contact Form:
- [ ] Honeypot field prevents spam
- [ ] HTML in form fields is properly escaped in emails
- [ ] CORS is properly configured (no CORS errors in browser console)
- [ ] Form validation works (required fields)

### General:
- [ ] API endpoints don't expose sensitive data
- [ ] Environment variables are not exposed in responses
- [ ] Error messages don't leak internal information

## Performance Testing

Check function performance:

1. Go to Netlify Dashboard → Functions
2. Click on each function
3. Check:
   - [ ] Response time is acceptable (< 1 second typical)
   - [ ] No excessive errors
   - [ ] Memory usage is reasonable

## Rollback Plan

If functions are not working after deployment:

1. Check Netlify deploy logs
2. If critical issue, revert the deployment in Netlify Dashboard
3. Investigate issue locally with `netlify dev`
4. Fix and redeploy

## Success Criteria

All of these should be true for a successful deployment:

- ✅ `/api/test-email` returns JSON (not HTML)
- ✅ Contact form sends emails successfully
- ✅ Instagram feed loads without errors
- ✅ Client registration form works
- ✅ No errors in Netlify function logs
- ✅ All environment variables are set
- ✅ No CORS errors in browser console
- ✅ Forms work on mobile and desktop

## Troubleshooting Guide

### Problem: API returns index.html instead of JSON

**Possible causes:**
- Function not deployed
- Function build error
- Missing path configuration

**Solutions:**
1. Check Netlify build logs
2. Verify function file exists in repo
3. Check for TypeScript compilation errors
4. Run `./scripts/verify-netlify-deployment.sh` locally

### Problem: 500 Internal Server Error

**Possible causes:**
- Missing environment variables
- Runtime error in function
- API credentials invalid

**Solutions:**
1. Check Netlify function logs
2. Verify environment variables
3. Test with `netlify dev` locally

### Problem: CORS errors

**Possible causes:**
- Origin not in allowed list
- Missing CORS headers

**Solutions:**
1. Check function's `getAllowedOrigin()` function
2. Add your domain to allowed origins
3. Verify headers are being sent

### Problem: Email not sending

**Possible causes:**
- Missing `RESEND_API_KEY`
- Invalid API key
- Resend service issue

**Solutions:**
1. Verify API key in Netlify settings
2. Test API key directly with Resend
3. Check function logs for error details
4. Verify sender domain is verified in Resend

## Additional Resources

- [NETLIFY_FUNCTIONS_DEPLOYMENT.md](./NETLIFY_FUNCTIONS_DEPLOYMENT.md) - Full deployment guide
- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Resend API Docs](https://resend.com/docs)
- [Instagram API Docs](https://developers.facebook.com/docs/instagram-api/)

## Contact for Issues

If you encounter issues:
1. Check function logs in Netlify Dashboard
2. Review this checklist
3. Check the NETLIFY_FUNCTIONS_DEPLOYMENT.md guide
4. Review the code changes in this PR
