import { useEffect } from 'react';

export interface PageMetaOptions {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}

const SITE_NAME = 'Leeukopf Laboratories';
const BASE_URL = 'https://leeukopf.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/img/hero/home-page-hero.jpg`;

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Hook for setting per-route SEO metadata.
 * Updates document.title, meta description, canonical URL and Open Graph tags.
 * Complements the static metadata in index.html with route-specific values.
 */
export function usePageMeta({ title, description, canonical, ogImage }: PageMetaOptions) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const canonicalUrl = canonical ?? `${BASE_URL}${window.location.pathname}`;
    const image = ogImage ?? DEFAULT_OG_IMAGE;

    document.title = fullTitle;

    setMeta('description', description);
    setMeta('title', fullTitle);

    setLink('canonical', canonicalUrl);

    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:image', image, 'property');
    setMeta('og:image:secure_url', image, 'property');

    setMeta('twitter:title', fullTitle, 'property');
    setMeta('twitter:description', description, 'property');
    setMeta('twitter:url', canonicalUrl, 'property');
    setMeta('twitter:image', image, 'property');
  }, [title, description, canonical, ogImage]);
}
