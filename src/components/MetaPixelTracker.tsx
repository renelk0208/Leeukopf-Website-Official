import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initMetaPixel, trackPageView } from '../lib/metaPixel';

/**
 * MetaPixelTracker Component
 * 
 * This component handles Meta Pixel initialization and tracks route changes.
 * It should be mounted once in the app, inside the Router component.
 * 
 * Features:
 * - Only runs in production mode (import.meta.env.PROD)
 * - Initializes Meta Pixel on first mount
 * - Tracks PageView on every route change (pathname or search changes)
 */
export default function MetaPixelTracker() {
  const location = useLocation();
  const isInitialMount = useRef(true);

  // Initialize Meta Pixel on mount (production only)
  useEffect(() => {
    // Only run in production
    if (!import.meta.env.PROD) {
      console.log('[Meta Pixel] Development mode detected, skipping initialization');
      return;
    }

    const pixelId = import.meta.env.VITE_META_PIXEL_ID;
    
    if (!pixelId) {
      console.warn('[Meta Pixel] VITE_META_PIXEL_ID environment variable not set');
      return;
    }

    // Initialize the pixel (this also tracks the first PageView)
    initMetaPixel(pixelId);
  }, []); // Run only once on mount

  // Track page views on route changes
  useEffect(() => {
    // Only run in production
    if (!import.meta.env.PROD) {
      return;
    }

    // Skip the initial page view (already tracked in initMetaPixel)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Track subsequent route changes
    if (window.fbq) {
      trackPageView();
    }
  }, [location.pathname, location.search]); // Track when pathname or search params change

  // This component doesn't render anything
  return null;
}
