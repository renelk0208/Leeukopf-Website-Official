# Meta Pixel Implementation Summary

This document summarizes the Meta Pixel (Facebook Pixel) integration for the Leeukopf website.

## Overview

Meta Pixel has been successfully integrated into the website to track page views and user interactions. The implementation follows best practices and respects user privacy through cookie consent:

- ✅ Only runs in production builds
- ✅ Respects cookie consent - only loads when analytics cookies are accepted
- ✅ Prevents double initialization
- ✅ Tracks initial page load
- ✅ Tracks route changes in SPA
- ✅ Provides event tracking API for forms and buttons
- ✅ Type-safe with TypeScript
- ✅ Passes ESLint checks
- ✅ Build verified successfully

## Files Created/Modified

### New Files

1. **`src/lib/metaPixel.ts`** - Core Meta Pixel utility functions
   - `loadMetaPixelScript()` - Loads the Meta Pixel script from CDN
   - `initMetaPixel(pixelId: string)` - Initializes Meta Pixel with the provided ID
   - `trackPageView()` - Tracks page view events
   - `trackEvent(name: string, params?)` - Tracks standard Meta Pixel events
   - `trackCustomEvent(name: string, params?)` - Tracks custom events
   - `isMetaPixelInitialized()` - Check initialization status
   - TypeScript global declarations for `fbq`

2. **`src/components/MetaPixelTracker.tsx`** - React component for tracking
   - Initializes pixel on mount (production only, with consent check)
   - Listens to `cookieConsentChanged` events
   - Tracks route changes using `useLocation` hook
   - Automatically tracks pathname and search parameter changes

### Modified Files

1. **`src/main.tsx`** - Added MetaPixelTracker component
   - Mounted inside `<BrowserRouter>` for access to routing context
   - Placed after `ScrollToTopOnRouteChange` component

2. **`.env.example`** - Added environment variable documentation
   - Added `VITE_META_PIXEL_ID` with placeholder value

## Cookie Consent Integration

**Important:** Meta Pixel only loads and tracks when users accept analytics cookies.

### How It Works

1. **On page load:**
   - `MetaPixelTracker` checks the `lkp_cookie_consent` cookie
   - If `choice === "all"`, the pixel loads and initializes
   - If `choice === "necessary"` or no choice, the pixel does not load

2. **When user changes consent:**
   - `MetaPixelTracker` listens to the `cookieConsentChanged` custom event
   - If user accepts all cookies, the pixel loads and initializes immediately
   - If user declines analytics, the pixel remains unloaded

3. **Cookie Consent UI:**
   - Uses existing `CookieConsent.tsx` component
   - No changes to the consent UI or flow
   - Banner appears on first visit
   - Settings can be reopened from footer

### Privacy Compliance

- ✅ No Meta Pixel script loaded until consent granted
- ✅ No `fbq` calls made until consent granted
- ✅ Respects user privacy preferences
- ✅ GDPR compliant implementation

## Configuration

### Environment Variables

Add the following to Netlify environment variables:

```
VITE_META_PIXEL_ID=YOUR_PIXEL_ID_HERE
```

**Important:** After adding the environment variable in Netlify, trigger a new deployment for the changes to take effect.

### How to Deploy

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add new variable:
   - **Key:** `VITE_META_PIXEL_ID`
   - **Value:** Your Meta Pixel ID (e.g., `123456789012345`)
3. Save the variable
4. Trigger a new deployment (or merge this PR to `main` branch)

## How It Works

### Production vs Development

The Meta Pixel only activates in production builds:

```typescript
if (!import.meta.env.PROD) {
  console.log('[Meta Pixel] Development mode detected, skipping initialization');
  return;
}
```

This means:
- **Development** (`npm run dev`): Meta Pixel is disabled, console logs indicate skipping
- **Production** (`npm run build`): Meta Pixel is active and tracks events (if consent granted)

### Initialization Flow

1. **On first page load (production only):**
   - MetaPixelTracker component mounts
   - Checks if `VITE_META_PIXEL_ID` is set
   - Checks if analytics cookies are accepted (`lkp_cookie_consent` cookie)
   - If consent granted:
     - Calls `loadMetaPixelScript()` to inject the Meta Pixel script
     - Calls `initMetaPixel(pixelId)` to initialize and track first PageView

2. **When user accepts cookies:**
   - CookieConsent dispatches `cookieConsentChanged` event
   - MetaPixelTracker listens and receives the event
   - If `choice === "all"`, loads script and initializes pixel
   - First PageView is tracked automatically

3. **On route changes:**
   - `useLocation` hook detects pathname/search changes
   - Calls `trackPageView()` for virtual pageview
   - Uses `useRef` to skip the first route change (already tracked in init)

### Event Tracking API

The implementation provides helper functions for tracking custom events:

```typescript
import { trackEvent, trackCustomEvent } from '../lib/metaPixel';

// Track standard Meta Pixel events
trackEvent('Contact');
trackEvent('Lead', { value: 1, currency: 'USD' });
trackEvent('CompleteRegistration');

// Track custom events
trackCustomEvent('FormStarted', { form_name: 'contact' });
trackCustomEvent('ProductViewed', { product_id: '123' });
trackCustomEvent('BrochureDownloaded', { category: 'gel-polish' });
```

**Standard Events:** Contact, Lead, CompleteRegistration, AddToCart, Purchase, etc.
**Custom Events:** Any business-specific action you want to track.

All tracking functions respect consent and initialization status automatically.
     - Initializes `fbq('init', pixelId)`
     - Fires initial `fbq('track', 'PageView')`

2. On route changes:
   - `useLocation` hook detects pathname/search changes
   - Calls `trackPageView()`
   - Fires `fbq('track', 'PageView')` for virtual pageview

### Anti-Double-Initialization

The `initMetaPixel()` function uses an `isInitialized` flag to prevent multiple script injections:

```typescript
if (isInitialized) {
  console.log('[Meta Pixel] Already initialized, skipping');
  return;
}
```

## Testing

### Local Testing (Development)

In development mode, you'll see console logs indicating the pixel is skipped:

```
[Meta Pixel] Development mode detected, skipping initialization
```

### Production Testing

After deployment to Netlify:

1. **Test without accepting cookies:**
   - Open browser DevTools → Console
   - Navigate to your site
   - Cookie consent banner appears
   - Click "Only necessary"
   - You should see:
     ```
     [Meta Pixel] Analytics cookies not accepted, skipping initialization
     ```
   - No Meta Pixel script loaded

2. **Test with accepting all cookies:**
   - Open site (or clear cookies)
   - Cookie consent banner appears
   - Click "Accept all"
   - You should see:
     ```
     [Meta Pixel] Script loaded successfully
     [Meta Pixel] Initialized successfully with ID: YOUR_PIXEL_ID
     [Meta Pixel] PageView tracked
     ```
   - Navigate to another page
   - You should see:
     ```
     [Meta Pixel] PageView tracked
     ```

3. **Test changing consent after page load:**
   - Start with "Only necessary" cookies
   - Open cookie settings from footer
   - Change to "Allow all cookies"
   - You should see:
     ```
     [Meta Pixel] Cookie consent changed: all
     [Meta Pixel] Script loaded successfully
     [Meta Pixel] Initialized successfully with ID: YOUR_PIXEL_ID
     [Meta Pixel] PageView tracked
     ```

### Verify in Meta Events Manager

1. Go to Meta Events Manager (https://business.facebook.com/events_manager2)
2. Select your pixel
3. View "Test Events" or "Events" tab
4. You should see PageView events coming from your domain
5. Events should only appear when users accept analytics cookies

## Usage Examples

### Track Form Submissions

```typescript
import { trackEvent } from '../lib/metaPixel';

function ContactForm() {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // ... submit form logic
    
    // Track the submission
    trackEvent('Contact', {
      content_name: 'Contact Form',
      content_category: 'form_submission'
    });
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Track Button Clicks

```typescript
import { trackCustomEvent } from '../lib/metaPixel';

function DownloadBrochureButton() {
  const handleClick = () => {
    trackCustomEvent('BrochureDownload', {
      brochure_type: 'gel-polish',
      download_method: 'button'
    });
    
    // ... download logic
  };
  
  return <button onClick={handleClick}>Download Brochure</button>;
}
```

### Track Product Views

```typescript
import { trackEvent } from '../lib/metaPixel';

function ProductPage({ product }: { product: Product }) {
  useEffect(() => {
    // Track when product page is viewed
    trackEvent('ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: 'USD'
    });
  }, [product]);
  
  return <div>...</div>;
}
```

### Check If Pixel Is Ready

```typescript
import { isMetaPixelInitialized } from '../lib/metaPixel';

function MyComponent() {
  const handleAction = () => {
    if (isMetaPixelInitialized()) {
      trackEvent('CustomAction');
    }
  };
  
  return <button onClick={handleAction}>Do Something</button>;
}
```

## TypeScript Safety

The implementation includes proper TypeScript declarations:

```typescript
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: Window['fbq'];
  }
}
```

This provides:
- Type safety when calling `window.fbq()`
- No TypeScript errors
- Proper IDE autocomplete support

## Console Logging

The implementation includes helpful console logs for debugging:

**Initialization:**
- `[Meta Pixel] Development mode detected, skipping initialization`
- `[Meta Pixel] Analytics cookies not accepted, skipping initialization`
- `[Meta Pixel] Script loaded successfully`
- `[Meta Pixel] Initialized successfully with ID: ...`
- `[Meta Pixel] Cookie consent changed: all`

**Tracking:**
- `[Meta Pixel] PageView tracked`
- `[Meta Pixel] Event tracked: Contact`
- `[Meta Pixel] Custom event tracked: BrochureDownload`
- `[Meta Pixel] Pixel not initialized, skipping ... tracking`

## Build Verification

✅ Build passes: `npm run build` completes successfully
✅ No TypeScript errors
✅ No ESLint errors
✅ Meta Pixel code is included in production bundle
✅ Production check works correctly
✅ Cookie consent integration working

## Next Steps

1. **Add environment variable in Netlify** as described above
2. **Deploy to production** (merge this PR or trigger manual deploy)
3. **Verify tracking** using Meta Events Manager
4. **Consider additional events** - Future enhancement could add:
   - Form submissions
   - Button clicks
   - Product views
   - Add to cart events
   - etc.

## Additional Event Tracking (Future)

To add more specific event tracking, you can extend `src/lib/metaPixel.ts`:

```typescript
export function trackEvent(eventName: string, params?: Record<string, any>): void {
  if (!window.fbq) {
    console.log(`[Meta Pixel] fbq not available, skipping ${eventName} tracking`);
    return;
  }
  
  try {
    window.fbq('track', eventName, params);
    console.log(`[Meta Pixel] ${eventName} tracked`, params);
  } catch (error) {
    console.error(`[Meta Pixel] Failed to track ${eventName}:`, error);
  }
}
```

Then use it in your components:

```typescript
import { trackEvent } from '../lib/metaPixel';

// Track custom events
trackEvent('ViewContent', { content_name: 'Gel Polish' });
trackEvent('Contact', { method: 'Form' });
```

## Support

For questions or issues with the Meta Pixel implementation:
- Check console logs for debugging information
- Verify environment variable is set correctly in Netlify
- Ensure deployment was triggered after adding environment variable
- Check Meta Events Manager for incoming events

---
*Last updated: December 2025*
