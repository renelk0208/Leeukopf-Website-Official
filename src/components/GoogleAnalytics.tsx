import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { hasAnalyticsConsent } from '../lib/cookieConsent';

/**
 * Google Analytics (GA4) tracking component
 * - Only loads in production
 * - Respects cookie consent
 * - Tracks page views on route changes
 */
export default function GoogleAnalytics() {
  const location = useLocation();
  const hasInitialized = useRef(false);
  const hasTrackedInitialPageView = useRef(false);

  // Initialize Google Analytics when consent is granted
  useEffect(() => {
    if (hasInitialized.current) return;

    // Only run in production
    if (!import.meta.env.PROD) {
      console.log('[GA] Skipping in development mode');
      return;
    }

    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (!measurementId) {
      console.warn('[GA] VITE_GA_MEASUREMENT_ID not configured');
      return;
    }

    const handleConsentChange = (event: CustomEvent) => {
      const { choice } = event.detail;
      const analyticsConsent = hasAnalyticsConsent();

      if (analyticsConsent && choice === 'all') {
        initGA(measurementId);
        hasInitialized.current = true;
      }
    };

    // Check initial consent state
    const analyticsConsent = hasAnalyticsConsent();
    if (analyticsConsent) {
      initGA(measurementId);
      hasInitialized.current = true;
    }

    // Listen for consent changes
    window.addEventListener('cookieConsentChanged', handleConsentChange as EventListener);

    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange as EventListener);
    };
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (!hasInitialized.current) return;
    
    const analyticsConsent = hasAnalyticsConsent();
    if (!analyticsConsent) return;

    // Skip initial page view since it's already tracked in gtag initialization
    if (!hasTrackedInitialPageView.current) {
      hasTrackedInitialPageView.current = true;
      return;
    }

    // Track page view
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

/**
 * Initialize Google Analytics
 */
function initGA(measurementId: string) {
  // Check if already loaded
  if (typeof window.gtag === 'function') {
    console.log('[GA] Already initialized');
    return;
  }

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  // Configure GA4
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: true,
    anonymize_ip: true, // GDPR compliance
  });

  console.log('[GA] Initialized with measurement ID:', measurementId);
}

/**
 * Track a page view
 */
function trackPageView(page: string) {
  if (!window.gtag) {
    console.warn('[GA] gtag not initialized');
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: page,
  });

  console.log('[GA] Page view tracked:', page);
}

// Type declarations for Google Analytics
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
