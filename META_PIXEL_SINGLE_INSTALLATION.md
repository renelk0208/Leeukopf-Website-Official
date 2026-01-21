# Meta Pixel Single Installation - Implementation Summary

## Overview

This document explains the consolidated Meta Pixel implementation that ensures **only ONE Meta Pixel installation** and **only ONE PageView event per page load**.

## Problem Solved

**Previous Issue:** The codebase had two separate Meta Pixel implementation approaches:
1. Direct script injection in `index.html` (ACTIVE)
2. Programmatic initialization in `src/lib/metaPixel.ts` (UNUSED but could cause duplication if called)

**Solution:** Removed the duplicate initialization code from `metaPixel.ts`, keeping only event tracking functions.

## Current Implementation

### 1. Single Pixel Installation Location

**File:** `index.html` (lines 116-176)

The Meta Pixel is loaded **only once** in the HTML head section with the following features:

```javascript
// Meta Pixel stub function created immediately
!function(f,b,e,v,n,t,s){...}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

// Initialization with cookie consent gating
function initializeMetaPixel() {
  if (!window.fbq) return;
  
  // Leeukopf Laboratories Meta Pixel ID
  var pixelId = '25315890148110700';
  
  fbq('init', pixelId); // ONLY initialization point
  fbq('track', 'PageView'); // ONLY initial PageView
}

// Cookie consent check
function checkConsentAndInit() {
  var consentMatch = document.cookie
    .split(';')
    .find(function(c) { return c.startsWith('lkp_cookie_consent='); });
  
  if (consentMatch) {
    var consentValue = JSON.parse(decodeURIComponent(consentMatch.split('=')[1]));
    if (consentValue.choice === 'all') {
      initializeMetaPixel(); // Initialize only if user accepts all cookies
    }
  }
}
```

**Key Features:**
- ✅ Cookie consent gating (GDPR compliant)
- ✅ Single `fbq('init')` call
- ✅ Single initial `fbq('track', 'PageView')` call
- ✅ Pixel ID injected from environment variable `VITE_META_PIXEL_ID` at build time

### 2. PageView Tracking Flow

#### Initial Page Load
- **Where:** `index.html` (line 137)
- **When:** After user accepts cookies and pixel initializes
- **Count:** 1 PageView event

#### Route Changes (SPA Navigation)
- **Where:** `src/components/MetaPixelTracker.tsx` (line 51)
- **When:** User navigates to different pages within the SPA
- **Count:** 1 PageView event per route change
- **Important:** Skips the initial mount to avoid duplicate with index.html

```typescript
// MetaPixelTracker.tsx
export default function MetaPixelTracker() {
  const location = useLocation();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!import.meta.env.PROD) return; // Only in production
    if (!window.fbq) return; // Check if pixel loaded
    
    // Skip initial mount - already tracked in index.html
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Track subsequent route changes
    window.fbq('track', 'PageView');
  }, [location.pathname, location.search]);

  return null;
}
```

### 3. Event Tracking Utility

**File:** `src/lib/metaPixel.ts`

This file now **ONLY** provides event tracking functions. It does NOT handle initialization.

**Available Functions:**

```typescript
// Track standard Meta Pixel events
trackEvent('Contact', { content_name: 'Contact Form' });

// Track custom events
trackCustomEvent('ProductViewed', { product_id: '123' });

// Track Lead events (for form submissions)
trackLead({
  content_name: 'Client Registration Form',
  content_category: 'registration',
  value: 1,
  currency: 'USD'
});
```

**Removed Functions (to prevent duplication):**
- ❌ `loadMetaPixelScript()` - Now only in index.html
- ❌ `initMetaPixel()` - Now only in index.html
- ❌ `trackPageView()` - Now only in MetaPixelTracker.tsx
- ❌ `isMetaPixelInitialized()` - No longer needed

## Pixel ID Configuration

### Hardcoded Pixel ID

**Pixel ID:** `25315890148110700`

**Implementation:**
- Hardcoded directly in `index.html` (line 132)
- No environment variable needed
- No build-time replacement required

```javascript
// index.html
function initializeMetaPixel() {
  if (!window.fbq) return;
  
  // Leeukopf Laboratories Meta Pixel ID
  var pixelId = '25315890148110700';
  
  fbq('init', pixelId);
  fbq('track', 'PageView');
}
```

## Verification Checklist

### ✅ Single Pixel Installation
- [ ] Only one `fbq('init')` call in the entire codebase (index.html line 136)
- [ ] No other files call `fbq('init')`
- [ ] `metaPixel.ts` does NOT have initialization functions

### ✅ Single PageView per Page Load
- [ ] Initial page load: 1 PageView from index.html
- [ ] Route changes: 1 PageView per route change from MetaPixelTracker
- [ ] No duplicate PageViews on initial load (MetaPixelTracker skips first render)

### ✅ Cookie Consent Integration
- [ ] Pixel only initializes when user accepts all cookies
- [ ] Pixel does NOT load if user rejects marketing cookies
- [ ] Cookie consent choice is checked via `lkp_cookie_consent` cookie

### ✅ Production-Only Behavior
- [ ] MetaPixelTracker only runs in production (`import.meta.env.PROD`)
- [ ] Development mode shows console logs but doesn't track

## Testing with Meta Pixel Helper

### Expected Behavior

**1. Before Cookie Consent:**
- Meta Pixel Helper: No pixel detected
- Console: No Meta Pixel messages

**2. After Accepting All Cookies:**
- Meta Pixel Helper: 1 Pixel detected (ID: 25315890148110700)
- Meta Pixel Helper: 1 PageView event
- Console: `[Meta Pixel] Initialized successfully with ID: 25315890148110700`
- Console: `[Meta Pixel] Initial PageView tracked`

**3. After Route Change (e.g., navigating to /about):**
- Meta Pixel Helper: 1 additional PageView event (total 2)
- Console: No messages in production (tracking happens silently)

**4. After Form Submission:**
- Meta Pixel Helper: 1 Lead event
- Console: `[Meta Pixel] Lead event tracked` (in development only)

## Common Issues & Solutions

### Issue: Multiple PageView Events on Initial Load

**Cause:** MetaPixelTracker not skipping initial mount

**Solution:** Ensure `isInitialMount.current` check is in place (line 44-47 of MetaPixelTracker.tsx)

### Issue: Pixel Not Initializing

**Possible Causes:**
1. User hasn't accepted cookies
2. Browser blocking third-party scripts
3. JavaScript errors in console

**Solution:**
1. Check cookie consent status - pixel only fires after user accepts all cookies
2. Test in different browser/incognito mode
3. Check browser console for errors

### Issue: Duplicate Pixel IDs

**Prevention:** 
- Only ONE pixel ID should exist in the codebase: `25315890148110700`
- Pixel ID is hardcoded in `index.html` (line 132)
- Never add additional Meta Pixel installations

## File Locations

| File | Purpose | Contains Pixel Code? |
|------|---------|---------------------|
| `index.html` | Single pixel installation | ✅ YES - ONLY initialization point |
| `src/lib/metaPixel.ts` | Event tracking utilities | ❌ NO - Only event tracking functions |
| `src/components/MetaPixelTracker.tsx` | Route change tracking | ✅ YES - Only PageView for route changes |
| `src/pages/ClientRegistrationPage.tsx` | Form submission tracking | ⚙️ Uses `trackLead()` from metaPixel.ts |
| `vite.config.ts` | Build-time Pixel ID injection | ⚙️ Replaces placeholder at build |

## Summary

**Before:** Two potential initialization paths (index.html + metaPixel.ts)
**After:** ONE initialization path (index.html only)

**Before:** Risk of duplicate PageView events
**After:** Single PageView on load, single PageView per route change

**Before:** Unclear separation of concerns
**After:** Clear separation:
- `index.html`: Initialization
- `MetaPixelTracker.tsx`: Route tracking
- `metaPixel.ts`: Event tracking

## Migration Notes for Developers

If you need to add Meta Pixel tracking:

✅ **DO:**
- Use `trackEvent()` from `src/lib/metaPixel.ts` for standard events
- Use `trackCustomEvent()` for custom events
- Use `trackLead()` for form submissions
- Add new tracking functions to `metaPixel.ts` if needed

❌ **DON'T:**
- Call `fbq('init')` anywhere (already done in index.html)
- Add initialization code to React components
- Create duplicate tracking utilities
- Hardcode Pixel IDs in the code

---

**Last Updated:** 2026-01-21
**Pixel ID:** 25315890148110700
**Implementation:** Single installation, cookie consent gated, production-only
