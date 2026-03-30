#!/usr/bin/env node
/**
 * inject-route-meta.cjs
 *
 * Build-time prerendering helper (Priority 2 / Priority 3).
 *
 * After `vite build` produces dist/index.html this script creates a copy of
 * that file for every important route listed in src/config/seo-routes.json.
 * Each copy has its <title> and <meta name="description"> / Open Graph tags
 * replaced with the correct route-specific values.
 *
 * This gives search engine crawlers route-specific metadata in the initial
 * HTML response without requiring a full SSR migration.
 *
 * The Netlify SPA catch-all redirect (`/* -> /index.html`) still serves the
 * React app for real users; the generated per-route HTML files are served by
 * Netlify before the catch-all fires because Netlify serves real files first.
 *
 * SEO data is loaded from src/config/seo-routes.json — the single source of
 * truth shared with the client-side CanonicalTag component.
 */

const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const TEMPLATE = path.join(DIST, 'index.html');
const BASE_URL = 'https://leeukopf.com';

// Load SEO data from the shared JSON source of truth.
const seoRoutes = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'src', 'config', 'seo-routes.json'), 'utf8')
);



// ---------------------------------------------------------------------------
// HTML injection helpers
// ---------------------------------------------------------------------------

/**
 * Escapes a string for safe use inside an HTML attribute value.
 */
function escapeAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Given the full dist/index.html as a string, replaces the SEO-sensitive meta
 * tags with route-specific values.
 */
function injectMeta(html, routePath, seo) {
  const canonical = `${BASE_URL}${seo.canonical ?? routePath}`;
  const ogImage = seo.ogImage ? `${BASE_URL}${seo.ogImage}` : undefined;

  const title = escapeAttr(seo.title);
  const description = escapeAttr(seo.description);

  let result = html;

  // <title>
  result = result.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);

  // Standard meta
  result = replaceMeta(result, 'name="title"', title);
  result = replaceMeta(result, 'name="description"', description);

  // Canonical
  result = result.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeAttr(canonical)}" />`
  );

  // Open Graph
  result = replaceMeta(result, 'property="og:url"', escapeAttr(canonical));
  result = replaceMeta(result, 'property="og:title"', title);
  result = replaceMeta(result, 'property="og:description"', description);
  if (ogImage) {
    result = replaceMeta(result, 'property="og:image"', escapeAttr(ogImage));
    result = replaceMeta(result, 'property="og:image:secure_url"', escapeAttr(ogImage));
  }

  // Twitter
  result = replaceMeta(result, 'property="twitter:url"', escapeAttr(canonical));
  result = replaceMeta(result, 'property="twitter:title"', title);
  result = replaceMeta(result, 'property="twitter:description"', description);
  if (ogImage) {
    result = replaceMeta(result, 'property="twitter:image"', escapeAttr(ogImage));
  }

  return result;
}

/**
 * Replaces the content attribute of a specific <meta> tag in the HTML string.
 * Handles both `content="..."` and `content='...'` variants, and both
 * self-closing and non-self-closing forms.
 */
function replaceMeta(html, attrSelector, newContent) {
  // Build a regex that matches the whole meta tag regardless of attribute order
  const escaped = attrSelector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `(<meta\\s[^>]*${escaped}[^>]*content=")[^"]*("[^>]*\\/?>)`,
    'i'
  );
  if (pattern.test(html)) {
    return html.replace(pattern, `$1${newContent}$2`);
  }
  // Also try reversed attribute order (content comes first)
  const patternReversed = new RegExp(
    `(<meta\\s[^>]*content=")[^"]*("[^>]*${escaped}[^>]*\\/?>)`,
    'i'
  );
  return html.replace(patternReversed, `$1${newContent}$2`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function run() {
  if (!fs.existsSync(TEMPLATE)) {
    console.error('✗ dist/index.html not found. Run `npm run build` first.');
    process.exit(1);
  }

  const template = fs.readFileSync(TEMPLATE, 'utf8');
  let generated = 0;

  for (const [routePath, seo] of Object.entries(seoRoutes)) {
    // Skip the root — dist/index.html already contains the homepage meta
    if (routePath === '/') continue;

    const routeDir = path.join(DIST, ...routePath.split('/').filter(Boolean));
    const outputFile = path.join(routeDir, 'index.html');

    // Don't overwrite files that were genuinely produced by the bundler
    // (e.g. if SSG is added later). Skip if the file already differs from the
    // generic SPA shell.
    if (fs.existsSync(outputFile)) {
      const existing = fs.readFileSync(outputFile, 'utf8');
      // If the file is already route-specific (different from the template) skip it
      if (existing !== template) continue;
    }

    fs.mkdirSync(routeDir, { recursive: true });

    const injected = injectMeta(template, routePath, seo);
    fs.writeFileSync(outputFile, injected, 'utf8');
    generated += 1;
  }

  console.log(`✓ inject-route-meta: generated ${generated} pre-rendered HTML files in dist/`);
}

run();
