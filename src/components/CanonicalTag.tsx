import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoRoutes, DEFAULT_SEO, BASE_URL } from '../config/seoRoutes';

/**
 * Injects route-specific SEO meta tags on every navigation.
 *
 * Updates:
 *  - document.title
 *  - <meta name="description">
 *  - <meta name="title">
 *  - <link rel="canonical">
 *  - Open Graph: og:url, og:title, og:description, og:image
 *  - Twitter: twitter:url, twitter:title, twitter:description, twitter:image
 *
 * Falls back to DEFAULT_SEO when no entry exists for the current pathname.
 */
export default function CanonicalTag() {
  const location = useLocation();

  useEffect(() => {
    const seo = seoRoutes[location.pathname] ?? DEFAULT_SEO;
    const canonicalUrl = `${BASE_URL}${seo.canonical ?? location.pathname}`;
    const ogImage = seo.ogImage ? `${BASE_URL}${seo.ogImage}` : undefined;

    // Title
    document.title = seo.title;

    // Helper: get-or-create a <meta> element by attribute selector
    function setMeta(selector: string, attr: string, value: string) {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        const [attrName, attrValue] = selector
          .replace(/^\[|\]$/g, '')
          .split('=')
          .map((s) => s.replace(/"/g, ''));
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    }

    // Standard meta
    setMeta('meta[name="title"]', 'content', seo.title);
    setMeta('meta[name="description"]', 'content', seo.description);

    // Canonical
    let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    // Open Graph
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:title"]', 'content', seo.title);
    setMeta('meta[property="og:description"]', 'content', seo.description);
    if (ogImage) {
      setMeta('meta[property="og:image"]', 'content', ogImage);
      setMeta('meta[property="og:image:secure_url"]', 'content', ogImage);
    }

    // Twitter
    setMeta('meta[property="twitter:url"]', 'content', canonicalUrl);
    setMeta('meta[property="twitter:title"]', 'content', seo.title);
    setMeta('meta[property="twitter:description"]', 'content', seo.description);
    if (ogImage) {
      setMeta('meta[property="twitter:image"]', 'content', ogImage);
    }
  }, [location]);

  return null;
}
