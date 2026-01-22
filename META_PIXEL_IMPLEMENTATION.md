# Meta Pixel Implementation Summary

This document summarizes the Meta Pixel (Facebook Pixel) integration for the Leeukopf website with cookie consent, domain validation, and Lead event tracking.

## Overview

Meta Pixel has been successfully integrated into the website to track page views, form submissions, and user interactions. The implementation follows best practices and respects user privacy through cookie consent:

- ✅ Only runs in production builds
- ✅ Respects cookie consent - only loads when analytics cookies are accepted
- ✅ Only fires on canonical domain (leeukopf.com)
- ✅ Prevents double initialization
- ✅ Tracks initial page load and route changes
- ✅ Tracks Lead events on form submissions
- ✅ Development mode logging (silent in production)
- ✅ Prepared for Meta Conversions API integration
- ✅ Type-safe with TypeScript
- ✅ Passes ESLint checks

## Key Features

### 1. Cookie Consent Integration

**Important:** Meta Pixel only loads and tracks when users accept marketing/analytics cookies.

#### How It Works

1. **On page load:**
   - `MetaPixelTracker` checks the `lkp_cookie_consent` cookie
   - If `choice === "all"`, the pixel loads and initializes
   - If `choice === "necessary"` or no choice, the pixel does not load

2. **When user changes consent:**
   - `MetaPixelTracker` listens to the `cookieConsentChanged` custom event
   - If user accepts all cookies, the pixel loads and initializes immediately
   - Initial PageView is tracked automatically
   - If user declines analytics, the pixel remains unloaded

3. **Privacy Compliance:**
   - ✅ No Meta Pixel script loaded until consent granted
   - ✅ No `fbq` calls made until consent granted
   - ✅ Respects user privacy preferences
   - ✅ GDPR compliant implementation

### 2. Domain Validation

**Important:** Meta Pixel only fires events on the canonical domain (leeukopf.com).

- Prevents duplicate tracking across multiple domains
- Only `leeukopf.com` and `www.leeukopf.com` will track events
- Other domains are silently ignored
- Ensures clean, accurate tracking data

### 3. Lead Event Tracking

**Standard Meta Pixel "Lead" Event** - Tracks successful form submissions.

- Fires ONLY after successful form submission (not on page load)
- Currently integrated with ClientRegistrationPage
- Passes structured data: content_name, content_category, value, currency
- Prepared for future Meta Conversions API (CAPI) server-side mirroring

**Example Lead Event:**
```typescript
trackLead({
  content_name: 'Client Registration Form',
  content_category: 'registration',
  value: 1,
  currency: 'USD'
});
```

### 4. Development Mode Logging

**Console Logging Strategy:**

- **Development Mode** (`npm run dev`):
  - All tracking events log to console
  - Shows initialization status
  - Shows when consent is granted/denied
  - Shows when events fire (PageView, Lead, etc.)
  - Helps debugging during development

- **Production Mode** (`npm run build`):
  - Standard logs are silent (no console spam)
  - Only errors log to console
  - Clean production experience

**Example Development Logs:**
```
[Meta Pixel] Script loaded successfully
[Meta Pixel] Initialized successfully with ID: 123456789
[Meta Pixel] Initial PageView tracked
[Meta Pixel] PageView tracked
[Meta Pixel] Lead event tracked { content_name: 'Client Registration Form', ... }
```

### 5. Meta Conversions API Preparation

The codebase is structured to support future server-side event mirroring via Meta Conversions API (CAPI):

- Event structure follows CAPI requirements
- Detailed implementation notes in `trackLead()` function
- Ready for event deduplication using event_id
- Prepared for PII hashing (email, phone)

**Future CAPI Integration:**
- Create server endpoint (e.g., `/api/meta-conversions-api`)
- Forward events with hashed user data
- Use event_id to deduplicate browser + server events
- Improve tracking resilience against ad blockers

## Files Created/Modified

### Modified Files

1. **`src/lib/metaPixel.ts`** - Core Meta Pixel utility functions
   - Added `isCanonicalDomain()` - Domain validation function
   - Added `log()` - Development-only logging helper
   - Updated `loadMetaPixelScript()` - Added domain validation
   - Updated `initMetaPixel()` - Added domain validation and improved logging
   - Updated `trackPageView()` - Added domain validation
   - Updated `trackEvent()` - Added domain validation
   - Updated `trackCustomEvent()` - Added domain validation
   - **NEW** `trackLead()` - Lead event tracking with CAPI preparation
   - All functions now respect domain and use centralized logging

2. **`src/components/MetaPixelTracker.tsx`** - React component for tracking
   - Updated all console logs to respect development mode
   - Logs visible only in development (`npm run dev`)
   - Silent in production (`npm run build`)
   - Initializes pixel on mount (production only, with consent check)
   - Listens to `cookieConsentChanged` events
   - Tracks route changes using `useLocation` hook

3. **`src/pages/ClientRegistrationPage.tsx`** - Registration form
   - Added `trackLead` import
   - Calls `trackLead()` after successful form submission
   - Passes structured event data (content_name, content_category, value, currency)

4. **`META_PIXEL_IMPLEMENTATION.md`** - This documentation file
   - Comprehensive update with all new features
   - Testing instructions
   - CAPI preparation notes

### Environment Variables

**Required:**
- `VITE_META_PIXEL_ID` - Your Meta Pixel ID (e.g., `123456789012345`)

Set in Netlify Dashboard → Site Settings → Environment Variables

**Important:** After adding the environment variable, trigger a new deployment.

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

### Local Testing (Development Mode)

In development mode (`npm run dev`), you'll see console logs:

```
[Meta Pixel] Development mode detected, skipping initialization
```

The pixel doesn't actually load in development to avoid polluting Meta's analytics with dev data.

### Production Testing

After deployment to Netlify with `VITE_META_PIXEL_ID` environment variable set:

#### 1. Test Cookie Consent Flow

**Reject Cookies:**
1. Open browser DevTools → Console
2. Navigate to the site
3. Cookie consent banner appears
4. Click "Reject non-essential"
5. In dev console: `[Meta Pixel] Analytics cookies not accepted, skipping initialization`
6. Verify: No Meta Pixel script loaded (check Network tab)

**Accept Cookies:**
1. Clear cookies and refresh
2. Cookie consent banner appears
3. Click "Accept all"
4. In dev console (if dev mode):
   ```
   [Meta Pixel] Script loaded successfully
   [Meta Pixel] Initialized successfully with ID: YOUR_PIXEL_ID
   [Meta Pixel] Initial PageView tracked
   ```
5. Navigate to another page
6. In dev console: `[Meta Pixel] PageView tracked`

#### 2. Test Domain Validation

- Test on `leeukopf.com` → Events fire ✅
- Test on `www.leeukopf.com` → Events fire ✅
- Test on any other domain → Events don't fire ❌

#### 3. Test Lead Event

1. Accept all cookies
2. Navigate to Client Registration page
3. Fill out and submit the form successfully
4. Wait for success message
5. In dev console: `[Meta Pixel] Lead event tracked { content_name: 'Client Registration Form', ... }`
6. Verify in Meta Events Manager

#### 4. Meta Pixel Helper Extension

1. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/) browser extension
2. Visit site after accepting cookies
3. Click the extension icon
4. Verify:
   - Pixel ID is detected
   - Pixel status shows "Active"
   - PageView event shows in the list
5. Navigate to another page → New PageView event appears
6. Submit registration form → Lead event appears

#### 5. Meta Events Manager

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your pixel
3. View "Test Events" tab (for real-time testing)
4. View "Events" tab (for production events)
5. Verify:
   - PageView events appear when navigating
   - Lead events appear when forms are submitted
   - Events only come from leeukopf.com domain
   - Events only appear when cookies are accepted

### Verification Checklist

- [ ] Pixel doesn't load when cookies are rejected
- [ ] Pixel loads and initializes when cookies are accepted
- [ ] Initial PageView fires on first load after consent
- [ ] PageView fires on every route change
- [ ] Lead event fires after successful form submission
- [ ] Lead event does NOT fire on page load
- [ ] Pixel is detected by Meta Pixel Helper
- [ ] Events appear in Meta Events Manager
- [ ] Events only fire on leeukopf.com domain
- [ ] No duplicate pixel installations detected
- [ ] Development logs work in dev mode
- [ ] Production logs are silent

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
