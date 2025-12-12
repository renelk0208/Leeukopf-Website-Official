# Meta Pixel Implementation Summary

This document summarizes the Meta Pixel (Facebook Pixel) integration for the Leeukopf website.

## Overview

Meta Pixel has been successfully integrated into the website to track page views and user interactions. The implementation follows best practices:

- ✅ Only runs in production builds
- ✅ Prevents double initialization
- ✅ Tracks initial page load
- ✅ Tracks route changes in SPA
- ✅ Type-safe with TypeScript
- ✅ Passes ESLint checks
- ✅ Build verified successfully

## Files Created/Modified

### New Files

1. **`src/lib/metaPixel.ts`** - Core Meta Pixel utility functions
   - `initMetaPixel(pixelId: string)` - Initializes Meta Pixel with the provided ID
   - `trackPageView()` - Tracks page view events
   - TypeScript global declarations for `fbq`

2. **`src/components/MetaPixelTracker.tsx`** - React component for tracking
   - Initializes pixel on mount (production only)
   - Tracks route changes using `useLocation` hook
   - Automatically tracks pathname and search parameter changes

### Modified Files

1. **`src/main.tsx`** - Added MetaPixelTracker component
   - Mounted inside `<BrowserRouter>` for access to routing context
   - Placed after `ScrollToTopOnRouteChange` component

2. **`.env.example`** - Added environment variable documentation
   - Added `VITE_META_PIXEL_ID` with placeholder value

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
- **Production** (`npm run build`): Meta Pixel is active and tracks events

### Initialization Flow

1. On first page load (production only):
   - MetaPixelTracker component mounts
   - Checks if `VITE_META_PIXEL_ID` is set
   - Calls `initMetaPixel()` which:
     - Injects the Meta Pixel script
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

1. Open browser DevTools → Console
2. Navigate to your site
3. You should see:
   ```
   [Meta Pixel] Initialized successfully with ID: YOUR_PIXEL_ID
   [Meta Pixel] PageView tracked
   ```
4. Navigate to another page
5. You should see:
   ```
   [Meta Pixel] PageView tracked
   ```

### Verify in Meta Events Manager

1. Go to Meta Events Manager (https://business.facebook.com/events_manager2)
2. Select your pixel
3. View "Test Events" or "Events" tab
4. You should see PageView events coming from your domain

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

- `[Meta Pixel] No pixel ID provided, skipping initialization`
- `[Meta Pixel] Already initialized, skipping`
- `[Meta Pixel] Initialized successfully with ID: ...`
- `[Meta Pixel] PageView tracked`
- `[Meta Pixel] Development mode detected, skipping initialization`
- `[Meta Pixel] VITE_META_PIXEL_ID environment variable not set`
- `[Meta Pixel] fbq not available, skipping PageView tracking`

## Build Verification

✅ Build passes: `npm run build` completes successfully
✅ No TypeScript errors
✅ No ESLint errors
✅ Meta Pixel code is included in production bundle
✅ Production check works correctly

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
