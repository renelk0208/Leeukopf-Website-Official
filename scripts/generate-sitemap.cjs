#!/usr/bin/env node

/**
 * Generate sitemap.xml for the Leeukopf website
 * This script creates a sitemap with all pages for better SEO
 */

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://leeukopf.com';

// All pages on the website
const pages = [
  // Main pages
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/about', priority: '0.9', changefreq: 'monthly' },
  { url: '/contact', priority: '0.9', changefreq: 'monthly' },
  { url: '/products', priority: '0.9', changefreq: 'weekly' },
  { url: '/certificates-and-compliance', priority: '0.8', changefreq: 'monthly' },
  { url: '/cpnp-compliance-support', priority: '0.8', changefreq: 'monthly' },
  { url: '/distributors-wanted', priority: '0.8', changefreq: 'monthly' },
  { url: '/client-registration', priority: '0.8', changefreq: 'monthly' },
  { url: '/season-trends', priority: '0.7', changefreq: 'weekly' },
  { url: '/valentines', priority: '0.8', changefreq: 'yearly' },
  { url: '/live-feed', priority: '0.7', changefreq: 'daily' },
  { url: '/faq-starting-a-gel-polish-brand', priority: '0.8', changefreq: 'monthly' },
  
  // Product categories
  { url: '/products/gel-polish', priority: '0.9', changefreq: 'weekly' },
  { url: '/products/gel-polish/cat-eye-gel-polish', priority: '0.8', changefreq: 'monthly' },
  { url: '/products/builder-and-structure-gels', priority: '0.9', changefreq: 'weekly' },
  { url: '/products/top-and-bases', priority: '0.9', changefreq: 'weekly' },
  { url: '/products/polygel-acrygel', priority: '0.8', changefreq: 'weekly' },
  { url: '/products/liquid-polygel', priority: '0.8', changefreq: 'weekly' },
  { url: '/products/acrylic-systems', priority: '0.8', changefreq: 'weekly' },
  { url: '/products/liquids-and-solutions', priority: '0.8', changefreq: 'weekly' },
  { url: '/products/nail-art', priority: '0.8', changefreq: 'weekly' },
  { url: '/products/accessories', priority: '0.7', changefreq: 'weekly' },
  { url: '/products/lamps', priority: '0.8', changefreq: 'weekly' },
  
  // Builder Gels Subcategories
  { url: '/products/builder-and-structure-gels/3-phase', priority: '0.7', changefreq: 'monthly' },
  { url: '/products/builder-and-structure-gels/3-in-1', priority: '0.7', changefreq: 'monthly' },
  { url: '/products/builder-and-structure-gels/premium-fiber-glass', priority: '0.7', changefreq: 'monthly' },
  { url: '/products/builder-and-structure-gels/no-heat-spike-builder-gel', priority: '0.7', changefreq: 'monthly' },
  { url: '/products/builder-and-structure-gels/biab-builder-in-a-bottle', priority: '0.7', changefreq: 'monthly' },
  { url: '/products/builder-and-structure-gels/thixotropic-gel', priority: '0.7', changefreq: 'monthly' },
  
  // Top & Bases Subcategories
  { url: '/products/top-and-bases/top-coats', priority: '0.7', changefreq: 'monthly' },
  { url: '/products/top-and-bases/top-coats/standard', priority: '0.6', changefreq: 'monthly' },
  { url: '/products/top-and-bases/top-coats/effects', priority: '0.6', changefreq: 'monthly' },
  { url: '/products/top-and-bases/base-coats', priority: '0.7', changefreq: 'monthly' },
  { url: '/products/top-and-bases/base-coats/classic', priority: '0.6', changefreq: 'monthly' },
  { url: '/products/top-and-bases/base-coats/rubber-base', priority: '0.6', changefreq: 'monthly' },
  { url: '/products/top-and-bases/base-coats/rubber-base/effects', priority: '0.6', changefreq: 'monthly' },
  { url: '/products/top-and-bases/base-coats/superior-base-5-in-1', priority: '0.6', changefreq: 'monthly' },
  { url: '/products/top-and-bases/brush-on-builder', priority: '0.7', changefreq: 'monthly' },
  
  // Lamps
  { url: '/products/lamps/comfort-plus-l3', priority: '0.6', changefreq: 'monthly' },
  { url: '/products/lamps/quick-cure-g1', priority: '0.6', changefreq: 'monthly' },
  
  // Nail Art Subcategories
  { url: '/products/nail-art/nail-art-products', priority: '0.6', changefreq: 'monthly' },
  
  // Private Label
  { url: '/private-label', priority: '0.9', changefreq: 'monthly' },
  { url: '/private-label/bottles', priority: '0.8', changefreq: 'monthly' },
  { url: '/private-label/jars-and-tubes', priority: '0.7', changefreq: 'monthly' },
  { url: '/private-label/bulk', priority: '0.8', changefreq: 'monthly' },
  
  // Brands
  { url: '/our-brands', priority: '0.8', changefreq: 'monthly' },
  { url: '/our-brands/gel-it-up', priority: '0.7', changefreq: 'monthly' },
  
  // Legal Pages
  { url: '/terms-of-use', priority: '0.3', changefreq: 'yearly' },
  { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { url: '/cookies-policy', priority: '0.3', changefreq: 'yearly' },
  { url: '/privacy-notice-distributors', priority: '0.3', changefreq: 'yearly' },
];

function generateSitemap() {
  const now = new Date().toISOString();
  
  // For better SEO, use different lastmod dates based on page type
  // Static pages: use less frequent updates
  // Dynamic pages: use more recent dates
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  pages.forEach(page => {
    // Use different lastmod based on changefreq to avoid unnecessary re-crawling
    let lastmod = now;
    if (page.changefreq === 'yearly') {
      lastmod = lastMonth;
    } else if (page.changefreq === 'monthly') {
      lastmod = lastMonth;
    } else if (page.changefreq === 'weekly') {
      lastmod = lastWeek;
    }
    
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}${page.url}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

// Generate and save sitemap
const sitemap = generateSitemap();
const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

fs.writeFileSync(outputPath, sitemap, 'utf8');
console.log('✓ Sitemap generated successfully at:', outputPath);
console.log(`  Total pages: ${pages.length}`);
