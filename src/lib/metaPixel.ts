/**
 * Meta Pixel (Facebook Pixel) integration utility
 * 
 * This module provides functions to initialize and track events with Meta Pixel.
 * It's designed to work with Vite/React applications and only activates in production.
 */

// Declare global fbq function for TypeScript
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: Window['fbq'];
  }
}

let isInitialized = false;

/**
 * Initialize Meta Pixel with the provided pixel ID
 * 
 * @param pixelId - The Meta Pixel ID to initialize
 * 
 * This function:
 * - Does nothing if pixelId is empty or undefined
 * - Prevents double initialization (idempotent)
 * - Injects the Meta Pixel base code script
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
  if (isInitialized) {
    console.log('[Meta Pixel] Already initialized, skipping');
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

    // Initialize the pixel
    window.fbq('init', pixelId);
    
    // Track initial PageView
    window.fbq('track', 'PageView');
    
    isInitialized = true;
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

  try {
    window.fbq('track', 'PageView');
    console.log('[Meta Pixel] PageView tracked');
  } catch (error) {
    console.error('[Meta Pixel] Failed to track PageView:', error);
  }
}
