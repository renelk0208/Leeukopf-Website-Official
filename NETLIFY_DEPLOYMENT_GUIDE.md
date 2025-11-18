# Netlify Deployment Troubleshooting Guide

This guide helps diagnose and resolve deployment issues with Netlify.

## How Netlify Deployment Works

1. **Build Trigger**: Netlify automatically builds your site when you push to the configured branch (usually `main`)
2. **Build Process**: Netlify runs `npm install` and `npm run build` on their servers
3. **Publish**: The contents of the `dist` folder are published to your site
4. **Cache**: Static assets are cached for performance

## Common Issues and Solutions

### Issue 1: Changes Not Appearing on Live Site

**Possible Causes:**
- Pushing to the wrong branch (not the branch Netlify is monitoring)
- Build failures on Netlify (build succeeds locally but fails on Netlify)
- Browser caching (your changes deployed but browser shows old version)
- Environment variables not set in Netlify dashboard

**Solutions:**

#### A. Check Which Branch Netlify is Deploying

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site
3. Go to **Site settings** → **Build & deploy** → **Continuous deployment**
4. Check the **Branch** setting under "Deploy contexts"
5. **Important**: Make sure you're pushing to this branch (usually `main`)

#### B. Verify Build Status

1. In Netlify dashboard, go to **Deploys** tab
2. Check if recent deploys show as **Published** or **Failed**
3. If failed, click on the failed deploy to see the error log
4. Common build errors:
   - Missing environment variables
   - Node version mismatch
   - npm install failures
   - Build command errors

#### C. Set Environment Variables

In Netlify dashboard, go to **Site settings** → **Environment variables** and add:

```
VITE_SUPABASE_URL=https://yhwlbhzguzoyjtozcrtu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlod2xiaHpndXpveWp0b3pjcnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTA0MzAsImV4cCI6MjA3ODQ2NjQzMH0._KshezOAM7d1rOysmM_L8CIoTjGddtNwhL_MQW89qw0
```

#### D. Clear Browser Cache

If builds are succeeding but you don't see changes:

**Chrome/Edge:**
1. Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select "Cached images and files"
3. Click "Clear data"

**Or use hard refresh:**
- Chrome/Edge: `Ctrl+Shift+R` or `Cmd+Shift+R`
- Firefox: `Ctrl+F5` or `Cmd+Shift+R`

**Or open in incognito/private mode**

### Issue 2: How to Properly Deploy Changes

**Step-by-step process:**

1. **Make your changes** on a feature branch (e.g., `copilot/my-feature`)

2. **Test locally:**
   ```bash
   npm install
   npm run build
   npm run preview
   ```

3. **Merge to main branch:**
   - Create a Pull Request to `main` branch
   - Review and merge the PR
   - OR directly push to main (not recommended):
     ```bash
     git checkout main
     git pull origin main
     git merge your-feature-branch
     git push origin main
     ```

4. **Wait for Netlify to build:**
   - Go to Netlify dashboard → **Deploys**
   - Watch for new deploy to appear
   - Wait for it to show **Published**
   - Usually takes 1-3 minutes

5. **Verify deployment:**
   - Open your live site URL
   - Use hard refresh (`Ctrl+Shift+R`) to bypass cache
   - Or check in incognito mode

### Issue 3: Trigger Manual Deploy

If auto-deploy isn't working:

1. Go to Netlify dashboard → **Deploys**
2. Click **Trigger deploy** → **Deploy site**
3. This forces a fresh build from your configured branch

### Issue 4: Check Build Logs

To see what's happening during builds:

1. Netlify dashboard → **Deploys**
2. Click on any deploy (successful or failed)
3. Scroll down to see the complete build log
4. Look for errors in:
   - Installing dependencies
   - Build command execution
   - Environment variables

## Quick Checklist

When deployments aren't working, check:

- [ ] Am I pushing to the correct branch? (Check Netlify settings)
- [ ] Did the build succeed on Netlify? (Check Deploys tab)
- [ ] Are environment variables set? (Check Site settings)
- [ ] Have I cleared my browser cache?
- [ ] Is the site actually updated? (Check in incognito mode)
- [ ] Did I wait long enough? (Builds take 1-3 minutes)

## Build Configuration

Current configuration in `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
```

This means:
- Build command: `npm run build` (defined in package.json)
- Output directory: `dist` (Vite default)
- Node.js version: 18

## Cache Control

This site uses cache-busting strategies:

1. **HTML files**: Never cached (cache-control headers force fresh checks)
2. **Assets (JS/CSS)**: Cached for 1 year with unique hashes in filenames
3. **Images**: Served from `public` folder, also cached

If you don't see changes:
- The build might have failed (check Netlify)
- Your browser is using cached HTML (hard refresh)

## Getting Help

If none of these solutions work:

1. Check the Netlify status page: https://www.netlifystatus.com/
2. Review Netlify docs: https://docs.netlify.com/
3. Check this repository's Issues page for similar problems
4. Contact the site maintainer with:
   - What you changed
   - What branch you pushed to
   - Screenshot of Netlify deploy status
   - Browser console errors (F12 → Console tab)
