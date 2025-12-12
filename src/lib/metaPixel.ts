/**
 * Meta Pixel (Facebook Pixel) integration utility with cookie consent gating
 * 
 * This module provides functions to initialize and track events with Meta Pixel.
 * It's designed to work with Vite/React applications and respects cookie consent.
 * Meta Pixel only loads and tracks when analytics cookies are accepted.
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

/**
 * Load the Meta Pixel script from Facebook CDN
 * This function is idempotent - safe to call multiple times
 */
export function loadMetaPixelScript(): void {
  // Guard: Prevent double loading
  if (isScriptLoaded) {
    console.log('[Meta Pixel] Script already loaded, skipping');
    return;
  }

  try {
    // Initialize fbq stub function if it doesn't exist
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
    console.log('[Meta Pixel] Script loaded successfully');
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
 * - Requires the script to be loaded first via loadMetaPixelScript()
 * - Initializes fbq with the pixel ID
 * - Fires an initial PageView event
 */
export function initMetaPixel(pixelId: string): void {
  // Guard: Don't initialize if no pixel ID provided
  if (!pixelId || pixelId.trim() === '') {
    console.log('[Meta Pixel] No pixel ID provided, skipping initialization');
    return;
  }

  // Guard: Prevent double initialization
  if (isPixelInitialized) {
    console.log('[Meta Pixel] Already initialized, skipping');
    return;
  }

  // Guard: Ensure script is loaded
  if (!window.fbq) {
    console.warn('[Meta Pixel] fbq not available. Call loadMetaPixelScript() first');
    return;
  }

  try {
    // Initialize the pixel
    window.fbq('init', pixelId);
    
    // Track initial PageView
    window.fbq('track', 'PageView');
    
    isPixelInitialized = true;
    console.log('[Meta Pixel] Initialized successfully with ID:', pixelId);
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
  if (!window.fbq) {
    console.log('[Meta Pixel] fbq not available, skipping PageView tracking');
    return;
  }

  if (!isPixelInitialized) {
    console.log('[Meta Pixel] Pixel not initialized, skipping PageView tracking');
    return;
  }

  try {
    window.fbq('track', 'PageView');
    console.log('[Meta Pixel] PageView tracked');
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
  if (!window.fbq) {
    console.log(`[Meta Pixel] fbq not available, skipping ${eventName} tracking`);
    return;
  }

  if (!isPixelInitialized) {
    console.log(`[Meta Pixel] Pixel not initialized, skipping ${eventName} tracking`);
    return;
  }

  try {
    if (params) {
      window.fbq('track', eventName, params);
      console.log(`[Meta Pixel] Event tracked: ${eventName}`, params);
    } else {
      window.fbq('track', eventName);
      console.log(`[Meta Pixel] Event tracked: ${eventName}`);
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
  if (!window.fbq) {
    console.log(`[Meta Pixel] fbq not available, skipping custom event ${eventName}`);
    return;
  }

  if (!isPixelInitialized) {
    console.log(`[Meta Pixel] Pixel not initialized, skipping custom event ${eventName}`);
    return;
  }

  try {
    if (params) {
      window.fbq('trackCustom', eventName, params);
      console.log(`[Meta Pixel] Custom event tracked: ${eventName}`, params);
    } else {
      window.fbq('trackCustom', eventName);
      console.log(`[Meta Pixel] Custom event tracked: ${eventName}`);
    }
  } catch (error) {
    console.error(`[Meta Pixel] Failed to track custom event ${eventName}:`, error);
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
