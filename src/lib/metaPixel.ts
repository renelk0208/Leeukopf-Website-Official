/**
 * Meta Pixel (Facebook Pixel) event tracking utility
 * 
 * This module provides functions to track events with Meta Pixel.
 * 
 * IMPORTANT: Meta Pixel initialization is handled in index.html
 * This utility only provides event tracking functions.
 * 
 * Features:
 * - Domain validation (only fires on canonical domain leeukopf.com)
 * - Lead event tracking for form submissions
 * - Standard and custom event tracking
 * - Development mode logging
 */

// Declare global fbq function for TypeScript
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: Window['fbq'];
  }
}

// Canonical domain for Meta Pixel tracking
const CANONICAL_DOMAIN = 'leeukopf.com';

/**
 * Check if the current domain is the canonical domain
 * Only fires events on the canonical domain to avoid duplicate tracking
 * In development, allows localhost for testing
 */
function isCanonicalDomain(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  
  // Production domains
  if (hostname === CANONICAL_DOMAIN || hostname === `www.${CANONICAL_DOMAIN}`) {
    return true;
  }
  
  // Development environment - allow localhost for testing
  if (!import.meta.env.PROD && (hostname === 'localhost' || hostname.includes('127.0.0.1'))) {
    return true;
  }
  
  return false;
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
