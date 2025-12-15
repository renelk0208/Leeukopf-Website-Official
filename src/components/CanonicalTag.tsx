import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component to dynamically add canonical tags to pages
 * This helps prevent duplicate content issues
 */
export default function CanonicalTag() {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = 'https://www.leeukopf.com';
    const canonicalUrl = `${baseUrl}${location.pathname}`;

    // Remove existing canonical tag if it exists
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.setAttribute('href', canonicalUrl);
    } else {
      // Create new canonical tag if it doesn't exist
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', canonicalUrl);
      document.head.appendChild(link);
    }

    // Update Open Graph URL
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', canonicalUrl);
    }

    // Update Twitter URL
    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.setAttribute('content', canonicalUrl);
    }
  }, [location]);

  return null;
}
