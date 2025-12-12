import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { loadMetaPixelScript, initMetaPixel, trackPageView } from '../lib/metaPixel';
import { hasAnalyticsConsent } from '../lib/cookieConsent';

/**
 * MetaPixelTracker Component
 * 
 * This component handles Meta Pixel initialization and tracks route changes.
 * It should be mounted once in the app, inside the Router component.
 * 
 * Features:
 * - Only runs in production mode (import.meta.env.PROD)
 * - Respects cookie consent - only loads when analytics cookies are accepted
 * - Listens for consent changes via 'cookieConsentChanged' event
 * - Initializes Meta Pixel when consent is granted
 * - Tracks PageView on every route change (pathname or search changes)
 */
export default function MetaPixelTracker() {
  const location = useLocation();
  const isInitialMount = useRef(true);
  const hasInitialized = useRef(false);

  // Initialize Meta Pixel when analytics consent is granted
  const initializePixel = () => {
    // Only run in production
    if (!import.meta.env.PROD) {
      console.log('[Meta Pixel] Development mode detected, skipping initialization');
      return;
    }

    // Check if already initialized
    if (hasInitialized.current) {
      console.log('[Meta Pixel] Already initialized');
      return;
    }

    const pixelId = import.meta.env.VITE_META_PIXEL_ID;
    
    if (!pixelId) {
      console.warn('[Meta Pixel] VITE_META_PIXEL_ID environment variable not set');
      return;
    }

    // Check for analytics consent
    if (!hasAnalyticsConsent()) {
      console.log('[Meta Pixel] Analytics cookies not accepted, skipping initialization');
      return;
    }

    // Load script and initialize pixel
    loadMetaPixelScript();
    initMetaPixel(pixelId);
    hasInitialized.current = true;
  };

  // Initialize on mount if consent is already granted
  useEffect(() => {
    initializePixel();
  }, []); // Run only once on mount

  // Listen for cookie consent changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ choice: string }>;
      console.log('[Meta Pixel] Cookie consent changed:', customEvent.detail.choice);
      
      // If user accepts all cookies, initialize the pixel
      if (customEvent.detail.choice === 'all') {
        initializePixel();
      }
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange);
    
    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange);
    };
  }, []);

  // Track page views on route changes
  useEffect(() => {
    // Only run in production
    if (!import.meta.env.PROD) {
      return;
    }

    // Only track if pixel is initialized
    if (!hasInitialized.current) {
      return;
    }

    // Skip the initial page view (already tracked in initMetaPixel)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Track subsequent route changes
    trackPageView();
  }, [location.pathname, location.search]); // Track when pathname or search params change

  // This component doesn't render anything
  return null;
}
