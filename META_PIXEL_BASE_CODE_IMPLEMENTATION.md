# Meta Pixel Base Code Implementation

## Overview

The Meta Pixel script is now injected directly into the `<head>` section of `index.html`, ensuring it loads immediately on all pages without relying solely on deferred loaders or consent flags.

## What Changed

### 1. Meta Pixel Base Code in `index.html`

**Location**: `<head>` section of `index.html`

The Meta Pixel base code is now present in the HTML from the start, which includes:

- **Facebook Pixel stub function**: Creates the `fbq` function immediately
- **Script loading**: Asynchronously loads `fbevents.js` from `connect.facebook.net`
- **Consent checking**: Checks for cookie consent before initializing
- **Event listener**: Listens for consent changes via `cookieConsentChanged` custom event

**Key features**:
- ✅ Script is present in DOM from page load
- ✅ Respects cookie consent (only initializes when user accepts all cookies)
- ✅ Works on all pages automatically
- ✅ No dependency on React rendering

### 2. Vite Plugin for Environment Variable Injection

**Location**: `vite.config.ts`

A custom Vite plugin replaces the `__VITE_META_PIXEL_ID__` placeholder with the actual pixel ID from the `VITE_META_PIXEL_ID` environment variable during build.

```typescript
{
  name: 'html-transform',
  transformIndexHtml(html) {
    const pixelId = process.env.VITE_META_PIXEL_ID || '';
    return html.replace(/__VITE_META_PIXEL_ID__/g, pixelId);
  },
}
```

### 3. Updated MetaPixelTracker Component

**Location**: `src/components/MetaPixelTracker.tsx`

The React component has been simplified to only track route changes:

- **Removed**: Script loading logic (now handled by HTML)
- **Removed**: Initialization logic (now handled by HTML)
- **Removed**: Consent checking logic (now handled by HTML)
- **Kept**: Route change tracking for SPA navigation

## How It Works

### On Page Load

1. Browser parses HTML and encounters Meta Pixel base code in `<head>`
2. `fbq` stub function is created immediately
3. Facebook Pixel script (`fbevents.js`) starts loading asynchronously
4. JavaScript checks for existing cookie consent:
   - If user previously accepted all cookies → initializes pixel and tracks PageView
   - If no consent or only necessary → pixel remains dormant

### When User Accepts Cookies

1. User clicks "Accept all" in cookie consent banner
2. `CookieConsent` component dispatches `cookieConsentChanged` event
3. Event listener in HTML catches the event
4. Checks if choice is "all" and `fbq` is available
5. Initializes pixel with `fbq('init', pixelId)`
6. Tracks initial PageView with `fbq('track', 'PageView')`

### On Route Changes (SPA Navigation)

1. User navigates to a new page (React Router route change)
2. `MetaPixelTracker` component detects location change
3. Calls `fbq('track', 'PageView')` for virtual pageview
4. Skips initial mount (already tracked on initialization)

## Environment Variables

### Required in Netlify

Set the following environment variable in Netlify Dashboard → Site Settings → Environment Variables:

- **Key**: `VITE_META_PIXEL_ID`
- **Value**: Your Meta Pixel ID (e.g., `123456789012345`)

### Build Process

When Netlify builds the site:
1. Reads `VITE_META_PIXEL_ID` from environment
2. Vite plugin replaces `__VITE_META_PIXEL_ID__` in HTML
3. Generated `dist/index.html` contains actual pixel ID

### Local Development

For local testing with a specific pixel ID:

```bash
# Create .env file
echo "VITE_META_PIXEL_ID=your_test_pixel_id" > .env

# Build
npm run build

# The built HTML will contain your test pixel ID
```

**Note**: The `.env` file is gitignored and should not be committed.

## Testing

### Verify Script is in DOM

1. Deploy to Netlify (or build locally with pixel ID)
2. Open the site in a browser
3. Open DevTools → Elements/Inspector
4. Look in `<head>` section
5. Verify presence of:
   - `<script>` tag with `connect.facebook.net/en_US/fbevents.js`
   - Inline script with `fbq` function
   - Consent checking logic

### Test Cookie Consent Flow

**Without Consent**:
1. Open site in incognito/private window
2. Open DevTools → Console
3. Reject cookies or close banner
4. Verify: No `fbq('init')` or `fbq('track')` calls
5. Check Network tab: Script loads but doesn't initialize

**With Consent**:
1. Clear cookies and refresh
2. Open DevTools → Console
3. Accept all cookies
4. Verify console shows (in dev mode):
   - `[Meta Pixel] Initialized successfully`
   - `[Meta Pixel] Initial PageView tracked`
5. Navigate to another page
6. Verify: `[Meta Pixel] PageView tracked`

### Use Meta Pixel Helper

1. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/) extension
2. Visit the site after accepting cookies
3. Click the extension icon
4. Verify:
   - Pixel ID is detected and correct
   - Pixel status shows "Active"
   - PageView events appear in the list

### Check Meta Events Manager

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your pixel
3. View "Test Events" tab
4. Perform actions on the site (navigate, submit forms)
5. Verify events appear in real-time

## Comparison: Before vs After

### Before

| Aspect | Status |
|--------|--------|
| Script location | Dynamically injected by React component |
| Load timing | After React hydration |
| DOM presence | Not in initial HTML source |
| Dependencies | React, consent check, environment variable |
| Route tracking | Via React component |

### After

| Aspect | Status |
|--------|--------|
| Script location | Directly in `<head>` of `index.html` |
| Load timing | Immediately on page load |
| DOM presence | ✅ Always in HTML source |
| Dependencies | Only consent check (HTML-based) |
| Route tracking | Via React component (simplified) |

## Benefits

1. **Immediate Script Presence**: Script is in the HTML source from the start
2. **No Deferred Loading**: Doesn't rely on React component mounting
3. **Better SEO**: Search engines and crawlers can see the script
4. **Faster Initialization**: Script loads in parallel with React bundle
5. **Simpler Architecture**: Less JavaScript logic for initialization
6. **Still Respects Consent**: Only initializes when user accepts cookies

## Files Modified

1. **index.html**
   - Added Meta Pixel base code in `<head>`
   - Added noscript fallback in `<body>`

2. **vite.config.ts**
   - Added custom plugin to inject `VITE_META_PIXEL_ID`

3. **src/components/MetaPixelTracker.tsx**
   - Simplified to only track route changes
   - Removed script loading and initialization logic

## Troubleshooting

### Script Not Initializing

**Check**:
1. Environment variable `VITE_META_PIXEL_ID` is set in Netlify
2. Cookie consent has been accepted (choice === "all")
3. Browser console for errors
4. Network tab shows `fbevents.js` loaded successfully

### Pixel ID Not Replaced

**Check**:
1. Build was triggered after adding environment variable
2. Netlify build logs show the variable is available
3. Look for `__VITE_META_PIXEL_ID__` in built HTML (shouldn't be there)

### Events Not Tracking

**Check**:
1. Meta Pixel Helper shows pixel is active
2. `window.fbq` is defined in console
3. Cookie consent was accepted
4. Check Meta Events Manager for incoming events

## Additional Notes

- The script loads asynchronously and won't block page rendering
- The stub `fbq` function queues calls until the main script loads
- Cookie consent is checked on every page load
- The noscript fallback works for users with JavaScript disabled
- The implementation is production-ready and follows Meta's best practices

---

**Last Updated**: January 2026
