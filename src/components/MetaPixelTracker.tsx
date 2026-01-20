import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * MetaPixelTracker Component
 * 
 * This component tracks route changes for Meta Pixel.
 * The Meta Pixel base code is loaded directly in index.html head section.
 * This component only handles route change tracking.
 * 
 * Features:
 * - Only runs in production mode (import.meta.env.PROD)
 * - Tracks PageView on every route change (pathname or search changes)
 * - Checks if pixel is initialized before tracking
 */
export default function MetaPixelTracker() {
  const location = useLocation();
  const isInitialMount = useRef(true);

  // Track page views on route changes
  useEffect(() => {
    // Only run in production
    if (!import.meta.env.PROD) {
      return;
    }

    // Check if fbq is available (loaded from HTML)
    if (!window.fbq) {
      return;
    }

    // Skip the initial page view (already tracked in HTML initialization)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Track subsequent route changes
    try {
      window.fbq('track', 'PageView');
    } catch (error) {
      console.error('[Meta Pixel] Failed to track PageView:', error);
    }
  }, [location.pathname, location.search]); // Track when pathname or search params change

  // This component doesn't render anything
  return null;
}
