# White Screen Issue - Troubleshooting Guide

This guide helps diagnose and fix the "white screen" issue where the website doesn't load properly.

## Quick Diagnostic Steps

### 1. Access the Diagnostic Page

First, try accessing the diagnostic page:

```
https://yourdomain.com/diagnostic.html
```

or if using Netlify domain:

```
https://your-site-name.netlify.app/diagnostic.html
```

This page will show you:
- Whether the site is loading at all
- React app configuration status
- Version information
- System environment details
- Quick actions to test and troubleshoot

### 2. Check Browser Console

1. Open your browser's developer tools (F12 or right-click → Inspect)
2. Go to the **Console** tab
3. Look for any **red error messages**
4. Common errors and their meanings:

   - `Failed to load module` - Build/deployment issue
   - `Supabase` errors - Missing environment variables
   - `Uncaught TypeError` - JavaScript runtime error
   - `404 Not Found` - Missing files or routing issue

### 3. Clear Browser Cache

The issue might be cached content:

**Windows/Linux:**
- Chrome/Edge: `Ctrl + Shift + R`
- Firefox: `Ctrl + Shift + Delete`

**Mac:**
- Chrome/Edge: `Cmd + Shift + R`
- Firefox: `Cmd + Shift + Delete`

**Or use Incognito/Private Mode:**
- Chrome: `Ctrl/Cmd + Shift + N`
- Firefox: `Ctrl/Cmd + Shift + P`

## Common Causes and Solutions

### Cause 1: Missing Environment Variables

**Symptoms:**
- White screen on production
- Works fine locally
- Console errors about Supabase

**Solution:**

1. Go to Netlify Dashboard → Your Site → **Site Settings**
2. Navigate to **Environment Variables**
3. Verify these variables are set:

```
VITE_SUPABASE_URL=https://yhwlbhzguzoyjtozcrtu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlod2xiaHpndXpveWp0b3pjcnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTA0MzAsImV4cCI6MjA3ODQ2NjQzMH0._KshezOAM7d1rOysmM_L8CIoTjGddtNwhL_MQW89qw0
```

4. **Important:** After adding/changing environment variables:
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Clear cache and deploy site**

### Cause 2: Build Failure

**Symptoms:**
- Site doesn't update after pushing changes
- Netlify shows "Failed" status

**Solution:**

1. Go to Netlify Dashboard → **Deploys**
2. Click on the failed deploy
3. Scroll down to see the build log
4. Look for error messages
5. Common build errors:
   - **npm install failed**: Check package.json for issues
   - **Build command failed**: Check for TypeScript or lint errors
   - **Out of memory**: Contact Netlify support or optimize build

### Cause 3: DNS Issues (Custom Domain)

**Symptoms:**
- White screen on custom domain (e.g., leeukopf.com)
- Works on Netlify subdomain (e.g., leeukopf.netlify.app)

**Solution:**

DNS changes can take 24-48 hours to propagate globally.

1. **Test Netlify subdomain first:**
   ```
   https://your-site-name.netlify.app
   ```
   If this works but custom domain doesn't, it's DNS.

2. **Verify DNS settings:**
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Check that your domain points to Netlify
   - Netlify should provide DNS settings in: Site Settings → Domain Management

3. **Wait or clear DNS cache:**
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

### Cause 4: SPA Routing Not Configured

**Symptoms:**
- Homepage works
- Direct navigation to routes (e.g., /about) shows 404 or white screen
- Routes work after navigating from homepage

**Solution:**

This should already be configured in `netlify.toml`, but verify:

1. Check that `netlify.toml` contains:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. If missing, add it and redeploy

### Cause 5: JavaScript Runtime Error

**Symptoms:**
- White screen
- Console shows JavaScript errors
- Error boundary catches the error (if implemented)

**Solution:**

With the new error boundary, you should now see an error message instead of white screen:

1. If you see an error message with "Something went wrong"
2. Click "Refresh Page" to try again
3. If error persists, check browser console for details
4. Report the error to developers with:
   - Browser and version
   - Screenshot of error
   - Steps to reproduce

## Step-by-Step Troubleshooting Checklist

Go through these steps in order:

- [ ] **Step 1:** Try accessing `/diagnostic.html` page
  - If it loads: Site is deployed, issue is with main app
  - If it doesn't: Deployment or DNS issue

- [ ] **Step 2:** Check version.json
  - Access: `https://yourdomain.com/version.json`
  - Verify `buildDate` is recent (within last hour/day)
  - Verify `commit` matches latest GitHub commit

- [ ] **Step 3:** Clear browser cache
  - Use hard refresh (Ctrl/Cmd + Shift + R)
  - Or try incognito/private mode

- [ ] **Step 4:** Check Netlify build status
  - Go to Netlify Dashboard → Deploys
  - Verify latest deploy shows "Published" not "Failed"
  - Check build time is recent

- [ ] **Step 5:** Verify environment variables
  - Netlify Dashboard → Site Settings → Environment Variables
  - Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set

- [ ] **Step 6:** Check browser console
  - Press F12
  - Look at Console tab
  - Note any error messages

- [ ] **Step 7:** Test Netlify subdomain
  - Try: `https://your-site-name.netlify.app`
  - If this works but custom domain doesn't: DNS issue

- [ ] **Step 8:** Trigger clean deploy
  - Netlify Dashboard → Deploys
  - Click "Trigger deploy" → "Clear cache and deploy site"

## Testing After Fixes

After making any changes:

1. **Wait for build to complete** (1-3 minutes)
2. **Clear your browser cache**
3. **Test in incognito mode** first
4. **Check multiple pages:**
   - Homepage: `/`
   - About: `/about`
   - Products: `/products`
   - Diagnostic: `/diagnostic.html`
5. **Check browser console** for any new errors

## When to Contact Support

Contact the developer or Netlify support if:

- [ ] All troubleshooting steps completed
- [ ] Diagnostic page confirms deployment is working
- [ ] Browser console shows specific error
- [ ] Issue persists in incognito mode after cache clear
- [ ] Netlify subdomain also shows white screen

**When contacting support, include:**

1. Screenshots of:
   - The white screen
   - Browser console errors (F12 → Console)
   - Netlify deploy status
   - Diagnostic page output

2. Information about:
   - Browser and version
   - Operating system
   - URL where issue occurs
   - When issue started
   - What was changed recently

3. Results from:
   - `/diagnostic.html` page
   - `/version.json` content
   - Browser console errors
   - Netlify build logs

## Recent Changes

The following improvements have been made to help diagnose and fix white screen issues:

### ✅ Error Boundary Added
- App now shows error message instead of white screen when JavaScript errors occur
- Error details shown in development mode
- "Refresh Page" button provided

### ✅ Improved Error Handling
- Supabase initialization errors no longer crash the app
- Better error logging for debugging
- App continues to work even if Supabase is unavailable

### ✅ Diagnostic Page Added
- Comprehensive deployment diagnostic tool at `/diagnostic.html`
- Real-time system status checks
- Quick action buttons for common fixes
- Troubleshooting tips included

### ✅ Version Tracking
- `version.json` automatically updated with each build
- Contains build date, commit hash, and branch info
- Helps verify which version is deployed

## Prevention

To prevent white screen issues in the future:

1. **Always test locally before deploying:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Monitor Netlify build logs** after each deploy

3. **Use feature branches** and test before merging to main

4. **Keep environment variables documented** and backed up

5. **Set up Netlify deploy notifications** (email/Slack)

6. **Use the diagnostic page** after deployments to verify

## Additional Resources

- [NETLIFY_DEPLOYMENT_GUIDE.md](./NETLIFY_DEPLOYMENT_GUIDE.md) - General Netlify deployment guide
- [DEPLOYMENT_FIXES_SUMMARY.md](./DEPLOYMENT_FIXES_SUMMARY.md) - Previous deployment fixes
- [Netlify Docs](https://docs.netlify.com/) - Official documentation
- [Netlify Status](https://www.netlifystatus.com/) - Check if Netlify is having issues

## Quick Reference Commands

```bash
# Test build locally
npm run build
npm run preview

# Check TypeScript
npm run typecheck

# Check for code issues
npm run lint

# Clear Git cache (if needed)
git rm -r --cached .
git add .
git commit -m "Clear cache"
```

## Helpful URLs to Check

When troubleshooting, check these URLs:

```
https://yourdomain.com/                    # Homepage
https://yourdomain.com/diagnostic.html     # Diagnostic page
https://yourdomain.com/version.json        # Build version info
https://yourdomain.com/deployment-check.html  # Deployment checker
```

Replace `yourdomain.com` with your actual domain or Netlify subdomain.
