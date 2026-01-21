# Leeukopf Website Pixel Installation

## Overview

This document describes the installation of the **Leeukopf Website Pixel** (Meta Pixel ID: `25315890148110700`) on leeukopf.com.

## Pixel Information

- **Pixel Name**: Leeukopf Website Pixel
- **Pixel ID**: `25315890148110700`
- **Domain**: leeukopf.com
- **Installation Date**: January 2026

## Installation Details

### Single Pixel Policy

**IMPORTANT**: This is the ONLY Meta Pixel that should be installed on leeukopf.com. All other Meta Pixel IDs have been removed.

### Implementation

The pixel is hardcoded directly in the HTML:

1. **Pixel ID**: `25315890148110700` (hardcoded in `index.html`)
2. **No Environment Variable Required**: The pixel ID is directly embedded in the code
3. **Configuration**: No additional configuration needed

### How It Works

1. **Direct Installation**:
   - The pixel ID `25315890148110700` is hardcoded in `index.html`
   - No build-time replacement needed
   - Pixel is ready to fire immediately after build

2. **Initialization**:
   - Pixel initializes ONCE when user accepts cookies
   - Located in `index.html` (lines 128-138)
   - Only fires after cookie consent is granted

3. **PageView Tracking**:
   - **Initial PageView**: Fires once on page load after pixel initialization (line 134 in index.html)
   - **Route Changes**: Fires once per route change via `MetaPixelTracker.tsx` component
   - **Deduplication**: Initial mount is skipped to prevent duplicate PageView events

4. **Lead Event Tracking**:
   - Fires on successful form submissions
   - Implemented in:
     - `ClientRegistrationPage.tsx` - Client registration form
     - `BrochureRequestModal.tsx` - Brochure request form
   - Session-based deduplication prevents duplicate Lead events

## Verification

### Check Pixel Installation

1. **Build with Pixel ID**:
   ```bash
   npm run build
   ```

2. **Verify in Built HTML**:
   - Check `dist/index.html`
   - Search for `25315890148110700`
   - Should appear in 2 places:
     - Line ~134: `fbq('init', pixelId);` where `pixelId = '25315890148110700'`
     - Line ~179: `<img ... src="...id=25315890148110700..."/>`

3. **Use Meta Pixel Helper**:
   - Install [Meta Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/meta-pixel-helper/)
   - Visit leeukopf.com
   - Accept cookies
   - Extension should show:
     - ✅ Pixel ID: 25315890148110700
     - ✅ Status: Active
     - ✅ PageView event detected

### Check PageView Fires Once

1. **Initial Page Load**:
   - Open browser DevTools → Console
   - Navigate to leeukopf.com
   - Accept cookies
   - Should see ONE PageView event in Meta Pixel Helper

2. **Route Changes** (SPA Navigation):
   - Click navigation links to different pages
   - Each route change should trigger ONE PageView event
   - Verify in Meta Pixel Helper

3. **Browser Refresh**:
   - Refresh the page
   - Should see ONE PageView event (not duplicate)

## Files Modified

- **`index.html`**: Hardcoded Meta Pixel ID `25315890148110700` directly in the script
- **`vite.config.ts`**: Removed the html-transform plugin (no longer needed)
- **`.env.example`**: Updated to document the new pixel ID (for reference only)
- **`LEEUKOPF_WEBSITE_PIXEL.md`**: This documentation file (updated)
- **`META_PIXEL_SINGLE_INSTALLATION.md`**: Updated to reflect new pixel ID
- **`SECURITY_SUMMARY_META_PIXEL.md`**: Updated to reflect new pixel ID
- **`vite.config.ts`**: Already has replacement logic (no changes needed)
- **`src/components/MetaPixelTracker.tsx`**: Already tracks route changes correctly (no changes needed)
- **`src/lib/metaPixel.ts`**: Lead event tracking with deduplication (no changes needed)

## Deployment Instructions

### For Netlify

1. Go to Netlify Dashboard
2. Select the leeukopf.com site
3. Navigate to: Site Settings → Environment Variables
4. Add or update:
   - **Key**: `VITE_META_PIXEL_ID`
   - **Value**: `25315890148110700`
5. Redeploy the site

### Verification After Deployment

1. Visit leeukopf.com
2. Open browser DevTools
3. Accept cookies
4. Check Meta Pixel Helper shows pixel ID: 25315890148110700
5. Navigate between pages - verify PageView fires once per page
6. Submit a form - verify Lead event fires once

## Troubleshooting

### Pixel Not Firing

**Check**:
1. ✅ Environment variable `VITE_META_PIXEL_ID` is set to `25315890148110700` in Netlify
2. ✅ Site has been rebuilt after setting the environment variable
3. ✅ Cookie consent has been accepted (pixel only fires after consent)
4. ✅ Browser has not blocked third-party cookies

### Multiple PageViews on Load

**Check**:
1. ✅ Only ONE pixel initialization in index.html (line 136)
2. ✅ MetaPixelTracker skips initial mount (line 44-46 in MetaPixelTracker.tsx)
3. ✅ No duplicate pixel code in other files

### Lead Event Not Firing

**Check**:
1. ✅ Form submission completed successfully
2. ✅ Cookie consent accepted
3. ✅ trackLead() is called after successful submission
4. ✅ Domain is leeukopf.com (events don't fire on other domains)

## Security & Privacy

- ✅ Pixel respects cookie consent (GDPR compliant)
- ✅ Only fires on canonical domain (leeukopf.com)
- ✅ No personally identifiable information (PII) is tracked without consent
- ✅ Deduplication prevents tracking spam

## Support

For questions or issues:
1. Check this documentation
2. Review [META_PIXEL_IMPLEMENTATION.md](./META_PIXEL_IMPLEMENTATION.md) for technical details
3. Check Meta Events Manager for live event data
4. Use Meta Pixel Helper for debugging

---

**Last Updated**: January 2026  
**Pixel ID**: 25315890148110700  
**Status**: ✅ Active
