/**
 * Image Map Configuration
 * 
 * Centralized image mapping for all product categories, subcategories, and hero images.
 * This file is auto-generated based on the actual images in the public/img directory.
 * 
 * Structure:
 * - categoryHero: Main category hero/banner images
 * - subcategoryImages: Images for specific subcategories/collections
 * - productPlaceholder: Default placeholder images for products
 * - heroImages: Page hero/banner images
 */

export interface ImageMap {
  categoryHero: Record<string, string>;
  subcategoryImages: Record<string, Record<string, string[]>>;
  productPlaceholder: Record<string, string>;
  heroImages: Record<string, string>;
}

/**
 * Main category hero images
 * Key: category slug (kebab-case)
 * Value: path to hero/representative image
 */
export const categoryHero: Record<string, string> = {
  // Gel Polish
  'gel-polish': '/img/products/gel_polishes/gel_polish_category_category-card-image-1.jpeg',
  'cat-eye-collection': '/img/products/gel_polishes/Cat Eye Collection/cat-eye_categoty_card-image.png',
  'cream-collection': '/img/products/gel_polishes/Cream Collection/solid-cream-category-card-image.jpg',
  'glitters-collection': '/img/products/gel_polishes/Glitters Collection/glitters-image-category-card.webp',
  'solid-colour-collection': '/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-category card image.jpg',
  'french-collection': '/img/products/gel_polishes/French Collection/french-collection-category-card-image.png',
  'autumn-winter-25-26': '/img/products/gel_polishes/autumn_winter_25_26/2026_new_collection_cover.jpg',
  'glow-in-the-dark': '/img/products/gel_polishes/Glow In the Dark/glow-in-the-dark-gel-polish-category-card-image.png',
  'platinum-gel-polish': '/img/products/gel_polishes/Platinum Gel Polish/platinum-gel-polish-collection-gel-polish-category-card-image.webp',
  'thermo-mood-changing': '/img/products/gel_polishes/Thermo Mood Changing/thermo-mood-changing-gel-polish-category-image.png',
  
  // Builder Systems
  'builder-systems': '/img/products/builder-systems/Builder Gels/3-in-1-builder_gels_category_3.jpg',
  'builder-gels': '/img/products/builder-systems/Builder Gels/3-in-1-builder_gels_category_3.jpg',
  'three-phase-builder': '/img/products/builder-systems/Builder Gels/3-phase-builder_gels_category_4.jpg',
  'three-in-one-builder': '/img/products/builder-systems/Builder Gels/3-in-1-builder_gels_category_3.jpg',
  'premium-builder-gels': '/img/products/builder-systems/Premium Builder Gels/1-premium-builder-gels-category-card-image.jpg',
  'colour-builder-gels': '/img/products/builder-systems/Builder Gels/colour-builder_gels_category_1_2.jpg',
  'polygel-acrygel': '/img/products/builder-systems/Acrygel-Polygel/acrygel-polygel-category-hero-image.jpg',
  'liquid-polygel': '/img/products/liquid polygel/liquid-polygel-category-card-image.png',
  'acrylic-systems': '/img/products/builder-systems/Acrylic/acrylic-powder-and liquid-category-card-image.jpg',
  
  // Tops & Bases
  'tops-and-bases': '/img/products/tops-and-bases/tops/tops-bases_category_1.jpg',
  'base-coats': '/img/products/tops-and-bases/base-coat-category-card-image.png',
  'rubber-bases': '/img/products/tops-and-bases/rubber-bases/rubber-base-category-image.jpg',
  'rubber-base': '/img/products/tops-and-bases/rubber-bases/rubber-base-category-image.jpg',
  'standard-rubber-base': '/img/products/tops-and-bases/rubber-bases/Standard Rubber Base/rubber-base-images (1).jpg',
  'effects-rubber-base': '/img/products/tops-and-bases/rubber-bases/Effects Rubber Base/effects-rubber-base-images (1).jpg',
  'classic-top-coats': '/img/products/tops-and-bases/tops/standard-top-coats-catergory-image.jpg',
  'standard-top-coats': '/img/products/tops-and-bases/tops/standard-top-coats-catergory-image.jpg',
  'effect-tops': '/img/products/tops-and-bases/tops/Effects Top Coats/effect-tops-category-card.jpg',
  'effects-top-coats': '/img/products/tops-and-bases/tops/Effects Top Coats/effect-tops-category-card.jpg',
  'superior-base-coat': '/img/products/tops-and-bases/Superior Base Coat/superior-base-coat-category-card-image.jpg',
  'classic-base': '/img/products/tops-and-bases/Bases/base-coat-category-card-image.png',
  'no-heat-spike-builder-gel': '/img/products/builder-systems/No Heat Spike Builder Gel/no-heat-spike-builder-gel-category-card.jpg',
  'brush-on-builder': '/img/products/tops-and-bases/brush-on-builder/brush-on-builder-category-card-image.jpg',
  'biab-builder-in-a-bottle': '/img/products/builder-systems/BIAB builder-in-a-bottle/biab-builder-in-a-bottle-category-card.jpg',
  'thixotropic-gel': '/img/products/builder-systems/thixotropic-gel/thixotropic-gel-category-image.png',
  
  // Primers & Liquids
  'primers-liquids': '/img/products/liquids-&-solutions/webp/liquids-&-solutions-category-card-image.webp',
  'liquids-and-solutions': '/img/products/liquids-&-solutions/webp/liquids-&-solutions-category-card-image.webp',
  'primers-with-acid': '/img/products/liquids-&-solutions/primer-liquid-images-1.jpg',
  
  // Nail Art
  'nail-art': '/img/products/nail-art/Nail Art/nail-art-category-card-imge.webp',
  '3d-multifunctional-gel': '/img/products/nail-art/Nail Art/nail-art-category-card-imge.webp',
  'solid-mirror-powders': '/img/products/nail-art/Solid Mirror Powders/webp/solid-mirror-category-card.webp',
  
  // Lamps
  'lamps': '/img/products/Lamps/lamps_category_card-1.jpg',
  'comfort-plus-l3': '/img/products/Lamps/Comfort PlusL3/l3-lamp-category-image.png',
  'quick-cure-g1': '/img/products/Lamps/Quick Cure G1/g1-quickcure-lamp-category-card-image.jpg',
  
  // Packaging
  'jars-and-tubes': '/img/products/jars-and-tubes/website_leeukopf_colored_jar_1.jpg',
};

/**
 * Subcategory/Collection images
 * Key: main category
 * Value: Record of subcategory to array of image paths
 */
export const subcategoryImages: Record<string, Record<string, string[]>> = {
  'gel-polish': {
    'autumn-winter-25-26': [
      '/img/products/gel_polishes/autumn_winter_25_26/2026_new_collection_cover.jpg',
      '/img/products/gel_polishes/autumn_winter_25_26/2026_new_collection_warm_colors.jpg',
      '/img/products/gel_polishes/autumn_winter_25_26/2026_new_collection_rose_jewels_glitters.jpg',
      '/img/products/gel_polishes/autumn_winter_25_26/2026_new_collection_red_cat_eye.jpg',
      '/img/products/gel_polishes/autumn_winter_25_26/2026_new_collection_cofee_cat_eye.jpg',
      '/img/products/gel_polishes/autumn_winter_25_26/2026_new_collection_galaxy_cat_eye.jpg',
      '/img/products/gel_polishes/autumn_winter_25_26/2026_new_collection_gold_leaf.jpg',
      '/img/products/gel_polishes/autumn_winter_25_26/2026_new_collection_laser_glitters.jpg',
      '/img/products/gel_polishes/autumn_winter_25_26/2026_new_collection_xmas_glitters.jpg',
    ],
    'cat-eye-collection': [
      '/img/products/gel_polishes/Cat Eye Collection/leeukop-cat-eye-collection (1).jpg',
      '/img/products/gel_polishes/Cat Eye Collection/leeukop-cat-eye-collection (2).jpg',
      '/img/products/gel_polishes/Cat Eye Collection/leeukop-cat-eye-collection (3).jpg',
      '/img/products/gel_polishes/Cat Eye Collection/leeukop-cat-eye-collection (4).jpg',
      '/img/products/gel_polishes/Cat Eye Collection/leeukop-cat-eye-collection (5).jpg',
    ],
    'cream-collection': [
      '/img/products/gel_polishes/Cream Collection/solid-cream-collection-full-colour-charts (1).jpg',
      '/img/products/gel_polishes/Cream Collection/solid-cream-collection-full-colour-charts (2).jpg',
    ],
    'glitters-collection': [
      '/img/products/gel_polishes/Glitters Collection/glitter-images.jpg',
      '/img/products/gel_polishes/Glitters Collection/glitter-images2.jpg',
      '/img/products/gel_polishes/Glitters Collection/glitter-images3.jpg',
      '/img/products/gel_polishes/Glitters Collection/glitter-images4.jpg',
      '/img/products/gel_polishes/Glitters Collection/glitter-images-4.jpg',
      '/img/products/gel_polishes/Glitters Collection/glitter-images5.jpg',
      '/img/products/gel_polishes/Glitters Collection/glitter-images6.jpg',
      '/img/products/gel_polishes/Glitters Collection/glitter-images7.jpg',
      '/img/products/gel_polishes/Glitters Collection/glitter-image8.jpg',
      '/img/products/gel_polishes/Glitters Collection/glitter-images9.jpg',
      '/img/products/gel_polishes/Glitters Collection/glitter-images10.jpg',
      '/img/products/gel_polishes/Glitters Collection/glitter-images11.jpg',
      '/img/products/gel_polishes/Glitters Collection/glitter-images12.jpg',
      '/img/products/gel_polishes/Glitters Collection/glitter-images13.jpg',
      '/img/products/gel_polishes/Glitters Collection/glitter-images14.jpg',
    ],
    'solid-colour-collection': [
      '/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-images (4).jpg',
      '/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-images (5).jpg',
      '/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-images (6).jpg',
      '/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-images (7).jpg',
      '/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-images (8).jpg',
      '/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-images (9).jpg',
      '/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-images (10).jpg',
      '/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-images (11).jpg',
      '/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-images (12).jpg',
      '/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-images (13).jpg',
      '/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-images (14).jpg',
      '/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-images (15).jpg',
      '/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-images (16).jpg',
      '/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-images (17).jpg',
      '/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-images (18).jpg',
    ],
    'french-collection': [
      '/img/products/gel_polishes/French Collection/french-collection-gel-polish (2).jpg',
      '/img/products/gel_polishes/French Collection/french-collection-gel-polish (3).jpg',
      '/img/products/gel_polishes/French Collection/french-collection-gel-polish (4).jpg',
      '/img/products/gel_polishes/French Collection/french-collection-gel-polish (5).jpg',
    ],
    'glow-in-the-dark': [
      '/img/products/gel_polishes/Glow In the Dark/glow-in-the-dark-gel-polsih (1).jpg',
      '/img/products/gel_polishes/Glow In the Dark/glow-in-the-dark-gel-polsih (2).jpg',
      '/img/products/gel_polishes/Glow In the Dark/glow-in-the-dark-gel-polsih (3).jpg',
      '/img/products/gel_polishes/Glow In the Dark/glow-in-the-dark-gel-polsih (4).jpg',
      '/img/products/gel_polishes/Glow In the Dark/glow-in-the-dark-gel-polsih (5).jpg',
      '/img/products/gel_polishes/Glow In the Dark/glow-in-the-dark-gel-polsih (6).jpg',
    ],
    'platinum-gel-polish': [
      '/img/products/gel_polishes/Platinum Gel Polish/platinum-gel-polish-collection-gel-polish (1).jpg',
      '/img/products/gel_polishes/Platinum Gel Polish/platinum-gel-polish-collection-gel-polish (2).jpg',
      '/img/products/gel_polishes/Platinum Gel Polish/platinum-gel-polish-collection-gel-polish (3).jpg',
      '/img/products/gel_polishes/Platinum Gel Polish/platinum-gel-polish-collection-gel-polish (4).jpg',
      '/img/products/gel_polishes/Platinum Gel Polish/platinum-gel-polish-collection-gel-polish (5).jpg',
      '/img/products/gel_polishes/Platinum Gel Polish/platinum-gel-polish-collection-gel-polish (6).jpg',
    ],
    'thermo-mood-changing': [
      '/img/products/gel_polishes/Thermo Mood Changing/thermo-mood-changing-gel-polish (1).jpg',
      '/img/products/gel_polishes/Thermo Mood Changing/thermo-mood-changing-gel-polish (2).jpg',
      '/img/products/gel_polishes/Thermo Mood Changing/thermo-mood-changing-gel-polish (3).jpg',
      '/img/products/gel_polishes/Thermo Mood Changing/thermo-mood-changing-gel-polish (4).jpg',
      '/img/products/gel_polishes/Thermo Mood Changing/thermo-mood-changing-gel-polish (5).jpg',
    ],
  },
  'builder-systems': {
    'acrygel': [
      '/img/products/builder-systems/Acrygel-Polygel/webp/acrygel-polygel-category-card-image.webp',
    ],
    '3-in-1-builder': [
      '/img/products/builder-systems/3-in-1 Builder gel/3-in-1-builder-gels (2).jpg',
      '/img/products/builder-systems/3-in-1 Builder gel/3-in-1-builder-gels (3).jpg',
      '/img/products/builder-systems/3-in-1 Builder gel/3-in-1-builder-gels (4).jpg',
      '/img/products/builder-systems/3-in-1 Builder gel/3-in-1-builder-gels (5).jpg',
      '/img/products/builder-systems/3-in-1 Builder gel/3-in-1-builder-gels (6).jpg',
      '/img/products/builder-systems/3-in-1 Builder gel/3-in-1-builder-gels (7).jpg',
      '/img/products/builder-systems/3-in-1 Builder gel/3-in-1-builder-gels (8).jpg',
      '/img/products/builder-systems/3-in-1 Builder gel/3-in-1-builder-gels (9).jpg',
      '/img/products/builder-systems/3-in-1 Builder gel/3-in-1-builder-gels (10).jpg',
      '/img/products/builder-systems/3-in-1 Builder gel/3-in-1-builder-gels (11).jpg',
      '/img/products/builder-systems/3-in-1 Builder gel/3-in-1-builder-gels (12).jpg',
      '/img/products/builder-systems/3-in-1 Builder gel/3-in-1-builder-gels (13).jpg',
      '/img/products/builder-systems/3-in-1 Builder gel/3-in-1-builder-gels (14).jpg',
      '/img/products/builder-systems/3-in-1 Builder gel/3-in-1-builder-gels (15).jpg',
    ],
    'premium-builder-gels': [
      '/img/products/builder-systems/Premium Builder Gels/premium-builder-gel (1).jpg',
      '/img/products/builder-systems/Premium Builder Gels/premium-builder-gel (2).jpg',
      '/img/products/builder-systems/Premium Builder Gels/premium-builder-gel (3).jpg',
      '/img/products/builder-systems/Premium Builder Gels/premium-builder-gel (4).jpg',
      '/img/products/builder-systems/Premium Builder Gels/premium-builder-gel (5).jpg',
      '/img/products/builder-systems/Premium Builder Gels/premium-builder-gel (6).jpg',
      '/img/products/builder-systems/Premium Builder Gels/premium-builder-gel (7).jpg',
      '/img/products/builder-systems/Premium Builder Gels/premium-builder-gel (8).jpg',
      '/img/products/builder-systems/Premium Builder Gels/premium-builder-gel (9).jpg',
      '/img/products/builder-systems/Premium Builder Gels/premium-builder-gel (10).jpg',
      '/img/products/builder-systems/Premium Builder Gels/premium-builder-gel (11).jpg',
      '/img/products/builder-systems/Premium Builder Gels/premium-builder-gel (12).jpg',
      '/img/products/builder-systems/Premium Builder Gels/premium-builder-gel (13).jpg',
      '/img/products/builder-systems/Premium Builder Gels/premium-builder-gel (14).jpg',
    ],
    'polygel-acrygel': [
      '/img/products/builder-systems/Acrygel-Polygel/acrygel-polygel-products-images (1).jpg',
      '/img/products/builder-systems/Acrygel-Polygel/acrygel-polygel-products-images (2).jpg',
      '/img/products/builder-systems/Acrygel-Polygel/acrygel-polygel-products-images (3).jpg',
      '/img/products/builder-systems/Acrygel-Polygel/acrygel-polygel-products-images (4).jpg',
      '/img/products/builder-systems/Acrygel-Polygel/acrygel-polygel-products-images (5).jpg',
      '/img/products/builder-systems/Acrygel-Polygel/acrygel-polygel-products-images (6).jpg',
      '/img/products/builder-systems/Acrygel-Polygel/acrygel-polygel-products-images (7).jpg',
      '/img/products/builder-systems/Acrygel-Polygel/acrygel-polygel-products-images (8).jpg',
      '/img/products/builder-systems/Acrygel-Polygel/acrygel-polygel-products-images (9).jpg',
      '/img/products/builder-systems/Acrygel-Polygel/acrygel-polygel-products-images (10).jpg',
      '/img/products/builder-systems/Acrygel-Polygel/acrygel-polygel-products-images (11).jpg',
    ],
    'liquid-polygel': [
      '/img/products/Liquid Polygel/liquid-polygel (1).jpg',
      '/img/products/Liquid Polygel/liquid-polygel (2).jpg',
      '/img/products/Liquid Polygel/liquid-polygel (3).jpg',
      '/img/products/Liquid Polygel/liquid-polygel (4).jpg',
    ],
    'biab-builder-in-a-bottle': [
      '/img/products/builder-systems/BIAB builder-in-a-bottle/biab-builder-in-a-bottle.jpg',
    ],
  },
  'tops-and-bases': {
    'superior-base-coat': [
      '/img/products/tops-and-bases/Superior Base Coat/superior-base-coats (1).jpg',
      '/img/products/tops-and-bases/Superior Base Coat/superior-base-coats (2).jpg',
    ],
    'brush-on-builder': [
      '/img/products/tops-and-bases/brush-on-builder/builder-gel-in-a-bottle.jpg',
    ],
    'rubber-bases': [
      '/img/products/tops-and-bases/rubber-bases/Standard Rubber Base/rubber-base-images (1).jpg',
      '/img/products/tops-and-bases/rubber-bases/Standard Rubber Base/rubber-base-images (2).jpg',
      '/img/products/tops-and-bases/rubber-bases/Standard Rubber Base/rubber-base-images (3).jpg',
      '/img/products/tops-and-bases/rubber-bases/Standard Rubber Base/rubber-base-images (4).jpg',
      '/img/products/tops-and-bases/rubber-bases/Standard Rubber Base/rubber-base-images (5).jpg',
      '/img/products/tops-and-bases/rubber-bases/Standard Rubber Base/rubber-base-images (6).jpg',
      '/img/products/tops-and-bases/rubber-bases/Standard Rubber Base/rubber-base-images (7).jpg',
      '/img/products/tops-and-bases/rubber-bases/Effects Rubber Base/effects-rubber-base-images (1).jpg',
      '/img/products/tops-and-bases/rubber-bases/Effects Rubber Base/effects-rubber-base-images (2).jpg',
      '/img/products/tops-and-bases/rubber-bases/Effects Rubber Base/effects-rubber-base-images (3).jpg',
      '/img/products/tops-and-bases/rubber-bases/Effects Rubber Base/effects-rubber-base-images (4).jpg',
      '/img/products/tops-and-bases/rubber-bases/Effects Rubber Base/effects-rubber-base-images (5).jpg',
      '/img/products/tops-and-bases/rubber-bases/Effects Rubber Base/effects-rubber-base-images (6).jpg',
      '/img/products/tops-and-bases/rubber-bases/Effects Rubber Base/effects-rubber-base-images (7).jpg',
      '/img/products/tops-and-bases/rubber-bases/Effects Rubber Base/effects-rubber-base-images (8).jpg',
      '/img/products/tops-and-bases/rubber-bases/Effects Rubber Base/effects-rubber-base-images (9).jpg',
      '/img/products/tops-and-bases/rubber-bases/Effects Rubber Base/effects-rubber-base-images (10).jpg',
      '/img/products/tops-and-bases/rubber-bases/Effects Rubber Base/effects-rubber-base-images (11).jpg',
      '/img/products/tops-and-bases/rubber-bases/Effects Rubber Base/effects-rubber-base-images (12).jpg',
    ],
    'standard-top-coats': [
      '/img/products/tops-and-bases/tops/standard-top-coats-catergory-image.jpg',
    ],
    'effects-top-coats': [
      '/img/products/tops-and-bases/tops/Effects Top Coats/effects-top-coat-images (1).jpg',
      '/img/products/tops-and-bases/tops/Effects Top Coats/effects-top-coat-images (2).jpg',
      '/img/products/tops-and-bases/tops/Effects Top Coats/effects-top-coat-images (3).jpg',
      '/img/products/tops-and-bases/tops/Effects Top Coats/effects-top-coat-images (4).jpg',
      '/img/products/tops-and-bases/tops/Effects Top Coats/effects-top-coat-images (5).jpg',
      '/img/products/tops-and-bases/tops/Effects Top Coats/effects-top-coat-images (6).jpg',
      '/img/products/tops-and-bases/tops/Effects Top Coats/effects-top-coat-images (7).jpg',
      '/img/products/tops-and-bases/tops/Effects Top Coats/effects-top-coat-images (8).jpg',
      '/img/products/tops-and-bases/tops/Effects Top Coats/effects-top-coat-images (9).jpg',
      '/img/products/tops-and-bases/tops/Effects Top Coats/effects-top-coat-images (10).jpg',
      '/img/products/tops-and-bases/tops/Effects Top Coats/effects-top-coat-images (11).jpg',
      '/img/products/tops-and-bases/tops/Effects Top Coats/effects-top-coat-images (12).jpg',
      '/img/products/tops-and-bases/tops/Effects Top Coats/effects-top-coat-images (13).jpg',
      '/img/products/tops-and-bases/tops/Effects Top Coats/effects-top-coat-images (14).jpg',
    ],
  },
  'liquids-and-solutions': {
    'liquids-and-solutions': [
      '/img/products/liquids-&-solutions/primer-liquid-images-1.jpg',
      '/img/products/liquids-&-solutions/primer-liquid-images-2.jpg',
      '/img/products/liquids-&-solutions/primer-liquid-images-3.jpg',
      '/img/products/liquids-&-solutions/primer-liquid-images-4.jpg',
      '/img/products/liquids-&-solutions/primer-liquid-images-5.jpg',
      '/img/products/liquids-&-solutions/primer-liquid-images-6.jpg',
      '/img/products/liquids-&-solutions/primer-liquid-images-7.jpg',
    ],
  },
  'nail-art': {
    'solid-mirror-powders': [
      '/img/products/nail-art/Solid Mirror Powders/solid mirror powders (1).jpg',
      '/img/products/nail-art/Solid Mirror Powders/solid mirror powders (2).jpg',
      '/img/products/nail-art/Solid Mirror Powders/solid mirror powders (3).jpg',
      '/img/products/nail-art/Solid Mirror Powders/solid mirror powders (4).jpg',
      '/img/products/nail-art/Solid Mirror Powders/solid mirror powders (5).jpg',
      '/img/products/nail-art/Solid Mirror Powders/solid mirror powders (6).jpg',
      '/img/products/nail-art/Solid Mirror Powders/solid mirror powders (7).jpg',
    ],
  },
  'lamps': {
    'comfort-plus-l3': [
      '/img/products/Lamps/Comfort PlusL3/webp/comfort-plus-product-image (1).webp',
      '/img/products/Lamps/Comfort PlusL3/webp/comfort-plus-product-image (2).webp',
      '/img/products/Lamps/Comfort PlusL3/webp/comfort-plus-product-image (4).webp',
      '/img/products/Lamps/Comfort PlusL3/webp/comfort-plus-product-image (5).webp',
      '/img/products/Lamps/Comfort PlusL3/webp/comfort-plus-product-image (6).webp',
    ],
    'quick-cure-g1': [
      '/img/products/Lamps/Quick Cure G1/g1-quickcure-lamp (1).jpg',
      '/img/products/Lamps/Quick Cure G1/g1-quickcure-lamp (2).jpg',
      '/img/products/Lamps/Quick Cure G1/g1-quickcure-lamp (3).jpg',
      '/img/products/Lamps/Quick Cure G1/g1-quickcure-lamp (4).jpg',
      '/img/products/Lamps/Quick Cure G1/g1-quickcure-lamp (5).jpg',
      '/img/products/Lamps/Quick Cure G1/g1-quickcure-lamp (6).jpg',
      '/img/products/Lamps/Quick Cure G1/g1-quickcure-lamp (7).jpg',
      '/img/products/Lamps/Quick Cure G1/g1-quickcure-lamp (8).jpg',
      '/img/products/Lamps/Quick Cure G1/g1-quickcure-lamp (9).jpg',
      '/img/products/Lamps/Quick Cure G1/g1-quickcure-lamp (10).jpg',
    ],
  },
};

/**
 * Product placeholder images by category
 * Used as fallback when specific product image is not available
 */
export const productPlaceholder: Record<string, string> = {
  'gel-polish': '/img/products/gel_polishes/gel_polish_category_category-card-image-1.jpeg',
  'builder-gels': '/img/products/builder-systems/Builder Gels/3-in-1-builder_gels_category_3.jpg',
  'tops-and-bases': '/img/products/tops-and-bases/tops/tops-bases_category_1.jpg',
  'primers-liquids': '/img/products/liquids-&-solutions/webp/liquids-&-solutions-category-card-image.webp',
  'nail-art': '/img/products/nail-art/Nail Art/nail-art-category-card-imge.png',
  'lamps': '/img/products/Lamps/lamps_category_card-1.jpg',
  'default': '/img/placeholders/category-placeholder.jpg',
};

/**
 * Hero/Banner images for pages
 */
export const heroImages: Record<string, string> = {
  'home': '/img/hero/home-page-hero.jpg',
  'about-us': '/img/hero/about-us-hero-image.jpg',
  'our-brand': '/img/hero/our-brand-hero.jpg',
  'our-products': '/img/hero/our-products-hero (2).jpg',
  'private-label': '/img/hero/private-label-hero.jpg',
  'certifications-compliance': '/img/hero/certifications-compliance-hero.jpg',
  'distributors-wanted': '/img/hero/distributors-wanted-hero-image-1.jpg',
  'faq': '/img/hero/faq-starting-a-gel-polish-brand.jpg',
};

/**
 * Helper function to get image with fallback logic
 * 
 * @param category - Main category (e.g., 'gel-polish')
 * @param subcategory - Optional subcategory/collection (e.g., 'cat-eye-collection')
 * @param productImage - Optional specific product image path
 * @returns Image path with fallback chain: productImage → subcategory → category → default
 */
export function getImage(
  category: string,
  subcategory?: string,
  productImage?: string
): string {
  // If specific product image is provided, use it
  if (productImage) {
    return productImage;
  }

  // Try to get subcategory image
  if (subcategory && subcategoryImages[category]?.[subcategory]?.[0]) {
    return subcategoryImages[category][subcategory][0];
  }

  // Try to get category hero image
  if (categoryHero[category]) {
    return categoryHero[category];
  }

  // Try to get product placeholder for category
  if (productPlaceholder[category]) {
    return productPlaceholder[category];
  }

  // Final fallback to default placeholder
  return productPlaceholder['default'];
}

/**
 * Helper function to get hero image with fallback
 * 
 * @param page - Page identifier (e.g., 'home', 'about-us')
 * @param fallback - Optional fallback image path
 * @returns Hero image path
 */
export function getHeroImage(page: string, fallback?: string): string {
  return heroImages[page] || fallback || heroImages['home'];
}

/**
 * Helper function to get all images for a subcategory
 * 
 * @param category - Main category
 * @param subcategory - Subcategory/collection
 * @returns Array of image paths
 */
export function getSubcategoryImages(
  category: string,
  subcategory: string
): string[] {
  return subcategoryImages[category]?.[subcategory] || [];
}

/**
 * Complete image map export
 */
export const imageMap: ImageMap = {
  categoryHero,
  subcategoryImages,
  productPlaceholder,
  heroImages,
};

export default imageMap;
