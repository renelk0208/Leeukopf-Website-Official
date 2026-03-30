/**
 * Route-level SEO configuration.
 *
 * The canonical data lives in seo-routes.json so it can be shared between
 * this TypeScript module (used by CanonicalTag at runtime) and the CJS build
 * script scripts/inject-route-meta.cjs (used to pre-render per-route HTML).
 *
 * To add or update SEO for a route, edit seo-routes.json only.
 */

import rawRoutes from './seo-routes.json';

export interface RouteSEO {
  title: string;
  description: string;
  /** Absolute path to an OG image (relative to the site root). */
  ogImage?: string;
  /** Explicit canonical path — defaults to the map key if omitted. */
  canonical?: string;
}

export const seoRoutes: Record<string, RouteSEO> = rawRoutes as Record<string, RouteSEO>;

export const DEFAULT_SEO: RouteSEO = {
  title: 'GMP Private Label Gel Polish Manufacturer (EU) | Leeukopf',
  description:
    'Premium private label gel polish manufacturer in Bulgaria (EU). 2000+ colors, HEMA & TPO-free formulas, GMP-compliant production, cruelty-free approval. Enquire.',
  ogImage: '/img/hero/home-page-hero.jpg',
};

export const BASE_URL = 'https://leeukopf.com';

