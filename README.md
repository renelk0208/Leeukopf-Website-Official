# Leeukopf Laboratories Website

Premium gel polish manufacturing website built with React, TypeScript, Vite, and Supabase.

## Netlify Deployment Setup

This project is configured for Netlify deployment. Follow these steps:

### 1. Environment Variables

In your Netlify dashboard, go to **Site settings > Environment variables** and add:

```
VITE_SUPABASE_URL=https://yhwlbhzguzoyjtozcrtu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlod2xiaHpndXpveWp0b3pjcnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTA0MzAsImV4cCI6MjA3ODQ2NjQzMH0._KshezOAM7d1rOysmM_L8CIoTjGddtNwhL_MQW89qw0
```

### 2. Build Settings

The `netlify.toml` file is already configured with:
- Build command: `npm run build` (automatically updates version.json before building)
- Publish directory: `dist`
- Node version: 18

### 3. Deploy Workflow

**Important:** Netlify deploys from the `main` branch by default.

To deploy changes:
1. Make changes on a feature branch
2. Test locally with `npm run build`
3. Create a Pull Request to `main` branch
4. Merge the PR
5. Netlify will automatically build and deploy

### 4. Verify Deployment

After pushing to `main`:
1. Check Netlify Dashboard → **Deploys** tab
2. Wait for build to complete (1-3 minutes)
3. Visit `yourdomain.com/deployment-check.html` to verify
4. Check `yourdomain.com/version.json` for build info

**If you don't see changes:**
- Clear browser cache (Ctrl+Shift+R)
- View in incognito mode
- Check [NETLIFY_DEPLOYMENT_GUIDE.md](./NETLIFY_DEPLOYMENT_GUIDE.md) for troubleshooting

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
