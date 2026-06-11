import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Declare global fbq function for TypeScript
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * MetaPixelTracker Component
 * 
 * This component tracks route changes (virtual pageviews) for Meta Pixel.
 * 
 * IMPORTANT: 
 * - Meta Pixel initialization is handled in index.html
 * - Initial PageView is tracked in index.html after initialization
 * - This component ONLY tracks subsequent route changes (not the initial page load)
 * 
 * Features:
 * - Only runs in production mode (import.meta.env.PROD)
 * - Tracks PageView on every route change (pathname or search changes)
 * - Skips initial mount to prevent duplicate PageView with index.html
 * - Checks if fbq is available before tracking
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
