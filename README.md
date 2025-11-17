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
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18

### 3. Deploy

Push to your GitHub repository and Netlify will automatically build and deploy.

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
