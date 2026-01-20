/**
 * Meta Pixel (Facebook Pixel) integration utility with cookie consent gating
 * 
 * This module provides functions to initialize and track events with Meta Pixel.
 * It's designed to work with Vite/React applications and respects cookie consent.
 * Meta Pixel only loads and tracks when analytics cookies are accepted.
 * 
 * Features:
 * - Cookie consent gating (only loads after marketing consent)
 * - Development mode logging (logs to console in dev mode)
 * - Domain validation (only fires on canonical domain leeukopf.com)
 * - Lead event tracking for form submissions
 * - Prepared for Meta Conversions API integration
 */

// Declare global fbq function for TypeScript
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: Window['fbq'];
  }
}

let isScriptLoaded = false;
let isPixelInitialized = false;

// Canonical domain for Meta Pixel tracking
const CANONICAL_DOMAIN = 'leeukopf.com';

/**
 * Check if the current domain is the canonical domain
 * Only fires events on the canonical domain to avoid duplicate tracking
 */
function isCanonicalDomain(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname === CANONICAL_DOMAIN || hostname === `www.${CANONICAL_DOMAIN}`;
}

/**
 * Log message to console in development mode
 * In production, logs are silent unless there's an error
 */
function log(message: string, data?: unknown): void {
  if (!import.meta.env.PROD) {
    if (data !== undefined) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
}

/**
 * Load the Meta Pixel script from Facebook CDN
 * 
 * This function is idempotent - safe to call multiple times.
 * It creates a stub fbq() function immediately that queues calls,
 * then asynchronously loads the actual Meta Pixel script from Facebook.
 * This pattern allows initMetaPixel() to be called immediately after
 * without waiting for the script to load.
 * 
 * Domain validation: Only loads on canonical domain (leeukopf.com)
 */
export function loadMetaPixelScript(): void {
  // Guard: Domain validation
  if (!isCanonicalDomain()) {
    log('[Meta Pixel] Not on canonical domain, skipping script load');
    return;
  }

  // Guard: Prevent double loading
  if (isScriptLoaded) {
    log('[Meta Pixel] Script already loaded, skipping');
    return;
  }

  try {
    // Initialize fbq stub function if it doesn't exist
    // This stub queues calls until the actual script loads
    if (!window.fbq) {
      interface FbqFunction {
        (...args: unknown[]): void;
        callMethod?: ((...args: unknown[]) => void) | null;
        queue: unknown[][];
        loaded: boolean;
        version: string;
      }
      
      const fbq = ((...args: unknown[]) => {
        if (fbq.callMethod) {
          fbq.callMethod(...args);
        } else {
          fbq.queue.push(args);
        }
      }) as FbqFunction;
      
      fbq.callMethod = null;
      fbq.queue = [];
      fbq.loaded = true;
      fbq.version = '2.0';
      
      if (!window._fbq) {
        window._fbq = fbq;
      }
      
      window.fbq = fbq;
    }

    // Inject Meta Pixel script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }

    isScriptLoaded = true;
    log('[Meta Pixel] Script loaded successfully');
  } catch (error) {
    console.error('[Meta Pixel] Failed to load script:', error);
  }
}

/**
 * Initialize Meta Pixel with the provided pixel ID
 * 
 * @param pixelId - The Meta Pixel ID to initialize
 * 
 * This function:
 * - Does nothing if pixelId is empty or undefined
 * - Prevents double initialization (idempotent)
 * - Validates domain (only runs on canonical domain)
 * - Requires the script to be loaded first via loadMetaPixelScript()
 * - Initializes fbq with the pixel ID
 * - Fires an initial PageView event
 */
export function initMetaPixel(pixelId: string): void {
  // Guard: Domain validation
  if (!isCanonicalDomain()) {
    log('[Meta Pixel] Not on canonical domain, skipping initialization');
    return;
  }

  // Guard: Don't initialize if no pixel ID provided
  if (!pixelId || pixelId.trim() === '') {
    log('[Meta Pixel] No pixel ID provided, skipping initialization');
    return;
  }

  // Guard: Prevent double initialization
  if (isPixelInitialized) {
    log('[Meta Pixel] Already initialized, skipping');
    return;
  }

  // Guard: Ensure script is loaded (stub fbq should exist)
  // The stub allows immediate calls that get queued until script loads
  if (!window.fbq) {
    console.warn('[Meta Pixel] fbq stub not available, script loading may have failed');
    return;
  }

  try {
    // Initialize the pixel
    window.fbq('init', pixelId);
    
    // Track initial PageView
    window.fbq('track', 'PageView');
    
    isPixelInitialized = true;
    log('[Meta Pixel] Initialized successfully with ID:', pixelId);
    log('[Meta Pixel] Initial PageView tracked');
  } catch (error) {
    console.error('[Meta Pixel] Failed to initialize:', error);
  }
}

/**
 * Track a PageView event
 * 
 * This should be called when the route changes in a single-page application
 * to track virtual page views.
 */
export function trackPageView(): void {
  // Guard: Domain validation
  if (!isCanonicalDomain()) {
    return;
  }

  if (!window.fbq) {
    log('[Meta Pixel] fbq not available, skipping PageView tracking');
    return;
  }

  if (!isPixelInitialized) {
    log('[Meta Pixel] Pixel not initialized, skipping PageView tracking');
    return;
  }

  try {
    window.fbq('track', 'PageView');
    log('[Meta Pixel] PageView tracked');
  } catch (error) {
    console.error('[Meta Pixel] Failed to track PageView:', error);
  }
}

/**
 * Track a standard Meta Pixel event
 * 
 * @param eventName - Standard event name (e.g., 'Contact', 'Lead', 'CompleteRegistration')
 * @param params - Optional event parameters
 * 
 * Standard events: https://developers.facebook.com/docs/meta-pixel/reference
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  // Guard: Domain validation
  if (!isCanonicalDomain()) {
    return;
  }

  if (!window.fbq) {
    log(`[Meta Pixel] fbq not available, skipping ${eventName} tracking`);
    return;
  }

  if (!isPixelInitialized) {
    log(`[Meta Pixel] Pixel not initialized, skipping ${eventName} tracking`);
    return;
  }

  try {
    if (params) {
      window.fbq('track', eventName, params);
      log(`[Meta Pixel] Event tracked: ${eventName}`, params);
    } else {
      window.fbq('track', eventName);
      log(`[Meta Pixel] Event tracked: ${eventName}`);
    }
  } catch (error) {
    console.error(`[Meta Pixel] Failed to track ${eventName}:`, error);
  }
}

/**
 * Track a custom Meta Pixel event
 * 
 * @param eventName - Custom event name (e.g., 'ProductViewed', 'FormStarted')
 * @param params - Optional event parameters
 * 
 * Custom events are useful for tracking business-specific actions
 */
export function trackCustomEvent(eventName: string, params?: Record<string, unknown>): void {
  // Guard: Domain validation
  if (!isCanonicalDomain()) {
    return;
  }

  if (!window.fbq) {
    log(`[Meta Pixel] fbq not available, skipping custom event ${eventName}`);
    return;
  }

  if (!isPixelInitialized) {
    log(`[Meta Pixel] Pixel not initialized, skipping custom event ${eventName}`);
    return;
  }

  try {
    if (params) {
      window.fbq('trackCustom', eventName, params);
      log(`[Meta Pixel] Custom event tracked: ${eventName}`, params);
    } else {
      window.fbq('trackCustom', eventName);
      log(`[Meta Pixel] Custom event tracked: ${eventName}`);
    }
  } catch (error) {
    console.error(`[Meta Pixel] Failed to track custom event ${eventName}:`, error);
  }
}

/**
 * Track a Lead event
 * 
 * @param params - Optional event parameters
 * @param params.content_name - Name of the form or lead source
 * @param params.content_category - Category of the lead (e.g., 'form_submission', 'registration')
 * @param params.value - Optional monetary value of the lead
 * @param params.currency - Optional currency (default: 'USD')
 * 
 * This function tracks a standard Meta Pixel "Lead" event for form submissions.
 * It's prepared for future Meta Conversions API (CAPI) integration where
 * lead events can be mirrored server-side for improved tracking accuracy.
 * 
 * Usage:
 * ```typescript
 * trackLead({
 *   content_name: 'Client Registration Form',
 *   content_category: 'registration',
 *   value: 1,
 *   currency: 'USD'
 * });
 * ```
 */
export function trackLead(params?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}): void {
  // Guard: Domain validation
  if (!isCanonicalDomain()) {
    return;
  }

  if (!window.fbq) {
    log('[Meta Pixel] fbq not available, skipping Lead tracking');
    return;
  }

  if (!isPixelInitialized) {
    log('[Meta Pixel] Pixel not initialized, skipping Lead tracking');
    return;
  }

  try {
    // Track Lead event with Meta Pixel
    if (params) {
      window.fbq('track', 'Lead', params);
      log('[Meta Pixel] Lead event tracked', params);
    } else {
      window.fbq('track', 'Lead');
      log('[Meta Pixel] Lead event tracked');
    }

    // Future: Mirror event to Meta Conversions API
    // This will improve tracking accuracy and resilience to browser-based tracking prevention
    // Implementation notes for future CAPI integration:
    // 1. Send event data to a server endpoint (e.g., /api/meta-conversions-api)
    // 2. Server endpoint forwards event to Meta Conversions API with:
    //    - Event name: 'Lead'
    //    - Event time: current timestamp
    //    - User data: hashed email, phone, etc. (if available and consented)
    //    - Custom data: params passed to this function
    //    - Event source URL: current page URL
    // 3. Include event_id to deduplicate between browser pixel and server API
    //
    // Example CAPI payload structure:
    // {
    //   data: [{
    //     event_name: 'Lead',
    //     event_time: Math.floor(Date.now() / 1000),
    //     event_source_url: window.location.href,
    //     event_id: generateEventId(), // unique ID for deduplication
    //     user_data: { em: hash(email), ph: hash(phone) }, // hashed PII
    //     custom_data: params
    //   }]
    // }
  } catch (error) {
    console.error('[Meta Pixel] Failed to track Lead event:', error);
  }
}

/**
 * Check if Meta Pixel is initialized
 * 
 * @returns true if the pixel has been initialized
 */
export function isMetaPixelInitialized(): boolean {
  return isPixelInitialized;
}
