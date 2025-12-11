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
  'gel-polish': '/img/products/gel_polishes/gel_polish_category_1.jpg',
  'cat-eye-collection': '/img/products/gel_polishes/Cat Eye Collection/leeukop-cat-eye-collection (1).jpg',
  'cream-collection': '/img/products/gel_polishes/Cream Collection/solid-cream-category image.jpg',
  'glitters-collection': '/img/products/gel_polishes/Glitters Collection/DSO.jpg',
  'solid-colour-collection': '/img/products/gel_polishes/Solid Colour Collection/FH_pure_color_gel_polish_hema_free_1.jpg',
  'transparent-color-gel-polish': '/img/products/gel_polishes/Transparent Color Gel Polish/transparent-colourgel-polish (1).jpg',
  'autumn-winter-25-26': '/img/products/gel_polishes/autumn_winter_25_26/2026_new_collection_cover.jpg',
  
  // Builder Systems
  'builder-systems': '/img/products/builder-systems/Builder Gels/3-in-1-builder_gels_category_3.jpg',
  'builder-gels': '/img/products/builder-systems/Builder Gels/3-in-1-builder_gels_category_3.jpg',
  'three-phase-builder': '/img/products/builder-systems/Builder Gels/3-phase-builder_gels_category_4.jpg',
  'three-in-one-builder': '/img/products/builder-systems/Builder Gels/3-in-1-builder_gels_category_3.jpg',
  'premium-builder-gels': '/img/products/builder-systems/Premium Builder Gels/premium-builder-gels-category.jpg',
  'colour-builder-gels': '/img/products/builder-systems/Builder Gels/colour-builder_gels_category_1_2.jpg',
  'polygel-acrygel': '/img/products/builder-systems/Acrygel/acrygel_polygel-category_image.jpg',
  'acrylic-systems': '/img/products/builder-systems/Acrylic/acrylic-powder-and liquid-category-image.jpg',
  
  // Tops & Bases
  'tops-and-bases': '/img/products/tops-and-bases/tops/tops-bases_category_1.jpg',
  'rubber-bases': '/img/products/tops-and-bases/rubber-base-category-image.jpg',
  'classic-top-coats': '/img/products/tops-and-bases/tops/tops-bases_category_1.jpg',
  'effect-tops': '/img/products/tops-and-bases/tops_&_bases_category_effects.jpg',
  'five-in-one': '/img/products/tops-and-bases/5-in-1/5-in-1_colors_1.jpg',
  'brush-on-builder': '/img/products/tops-and-bases/brush-on-builder/brush-on-builder (1).jpg',
  
  // Primers & Liquids
  'primers-liquids': '/img/products/primers-and-liquids/bonder-without-acid.jpg',
  'primers-with-acid': '/img/products/primers-and-liquids/bonder-with-acid.jpg',
  
  // Nail Art
  'nail-art': '/img/products/nail-art/nail-art-category-image.jpg',
  '3d-multifunctional-gel': '/img/products/nail-art/3D-multifunctional-gel/leeukopf_multifunctional_3D_gel_1.jpg',
  'solid-mirror-powders': '/img/products/nail-art/Solid Mirror Powders/aquarelle_color_shift_palette1.jpg',
  
  // Accessories
  'lamps': '/img/products/Consumables/Lamps/comfort-plusL1-category-image.jpg',
  'comfort-plus-l3': '/img/products/Consumables/Lamps/Comfort PlusL3/l3-lamp-category-image.png',
  'quick-cure-g1': '/img/products/Consumables/Lamps/Quick Cure G1/quick-cure-handhel-lamp (1).jpg',
  
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
      '/img/products/gel_polishes/Cream Collection/solid-cream-gel (1).jpg',
      '/img/products/gel_polishes/Cream Collection/solid-cream-gel (2).jpg',
      '/img/products/gel_polishes/Cream Collection/solid-cream-gel (3).jpg',
      '/img/products/gel_polishes/Cream Collection/solid-cream-gel (4).jpg',
      '/img/products/gel_polishes/Cream Collection/solid-cream-gel (5).jpg',
    ],
    'glitters-collection': [
      '/img/products/gel_polishes/Glitters Collection/DSO.jpg',
      '/img/products/gel_polishes/Glitters Collection/DSO_A.jpg',
      '/img/products/gel_polishes/Glitters Collection/DSO_C.jpg',
      '/img/products/gel_polishes/Glitters Collection/DSO_G.jpg',
      '/img/products/gel_polishes/Glitters Collection/DSO_GL.jpg',
      '/img/products/gel_polishes/Glitters Collection/DSO_GY.jpg',
      '/img/products/gel_polishes/Glitters Collection/DSO_SF.jpg',
    ],
    'solid-colour-collection': [
      '/img/products/gel_polishes/Solid Colour Collection/FH_pure_color_gel_polish_hema_free_1.jpg',
      '/img/products/gel_polishes/Solid Colour Collection/FH_pure_color_gel_polish_hema_free_2.jpg',
      '/img/products/gel_polishes/Solid Colour Collection/FH_pure_color_gel_polish_hema_free_3.jpg',
      '/img/products/gel_polishes/Solid Colour Collection/FH_pure_color_gel_polish_hema_free_4.jpg',
      '/img/products/gel_polishes/Solid Colour Collection/FH_pure_color_gel_polish_hema_free_5.jpg',
    ],
    'transparent-color-gel-polish': [
      '/img/products/gel_polishes/Transparent Color Gel Polish/transparent-colourgel-polish (1).jpg',
      '/img/products/gel_polishes/Transparent Color Gel Polish/transparent-colourgel-polish (2).jpg',
      '/img/products/gel_polishes/Transparent Color Gel Polish/transparent-colourgel-polish (3).jpg',
      '/img/products/gel_polishes/Transparent Color Gel Polish/transparent-colourgel-polish (4).jpg',
      '/img/products/gel_polishes/Transparent Color Gel Polish/transparent-colourgel-polish (5).jpg',
    ],
  },
  'builder-systems': {
    'acrygel': [
      '/img/products/builder-systems/Acrygel/acrygel_polygel-category_image.jpg',
      '/img/products/builder-systems/Acrygel/Liquid Polygel/liquid-polygel (1).jpg',
      '/img/products/builder-systems/Acrygel/Liquid Polygel/liquid-polygel (2).jpg',
      '/img/products/builder-systems/Acrygel/Liquid Polygel/liquid-polygel (3).jpg',
    ],
    '3-in-1-builder': [
      '/img/products/builder-systems/3-in-1 Builder gel/Colour Gels/colour-gels.jpg',
      '/img/products/builder-systems/3-in-1 Builder gel/Colour Gels/Leeukopf_UGI-V.jpg',
      '/img/products/builder-systems/3-in-1 Builder gel/Effects Gels/Leeukopf_Y2-UGI-GY.jpg',
      '/img/products/builder-systems/3-in-1 Builder gel/Effects Gels/Leeukopf_Y2-UGI-VR.jpg',
    ],
  },
  'tops-and-bases': {
    '5-in-1': [
      '/img/products/tops-and-bases/5-in-1/5-in-1_colors_1.jpg',
      '/img/products/tops-and-bases/5-in-1/5-in-1_colors_2.jpg',
      '/img/products/tops-and-bases/5-in-1/5-in-1_colors_3.jpg',
      '/img/products/tops-and-bases/5-in-1/5-in-1_colors_4.jpg',
    ],
    'brush-on-builder': [
      '/img/products/tops-and-bases/brush-on-builder/brush-on-builder (1).jpg',
      '/img/products/tops-and-bases/brush-on-builder/brush-on-builder (2).jpg',
      '/img/products/tops-and-bases/brush-on-builder/brush-on-builder (3).jpg',
      '/img/products/tops-and-bases/brush-on-builder/brush-on-builder (4).jpg',
    ],
    'rubber-bases': [
      '/img/products/tops-and-bases/rubber-bases/Standard Rubber Base/nude_rubber_base1.jpg',
      '/img/products/tops-and-bases/rubber-bases/Standard Rubber Base/cover_rubber_base1.jpg',
      '/img/products/tops-and-bases/rubber-bases/Effects Rubber Base/flash_rubber-base1.jpg',
      '/img/products/tops-and-bases/rubber-bases/Effects Rubber Base/fairy_shimmer_rubber-base1.jpg',
      '/img/products/tops-and-bases/rubber-bases/rubber_bases_category_2.jpg',
    ],
  },
  'nail-art': {
    '3d-multifunctional-gel': [
      '/img/products/nail-art/3D-multifunctional-gel/leeukopf_multifunctional_3D_gel_1.jpg',
      '/img/products/nail-art/3D-multifunctional-gel/leeukopf_multifunctional_3D_gel_2.jpg',
      '/img/products/nail-art/3D-multifunctional-gel/leeukopf_multifunctional_3D_gel_3.jpg',
    ],
    'solid-mirror-powders': [
      '/img/products/nail-art/Solid Mirror Powders/aquarelle_color_shift_palette1.jpg',
      '/img/products/nail-art/Solid Mirror Powders/aquarelle_color_shift_palette2.jpg',
      '/img/products/nail-art/Solid Mirror Powders/aquarelle_color_shift_palette3.jpg',
      '/img/products/nail-art/Solid Mirror Powders/aquarelle_color_shift_palette4.jpg',
    ],
  },
  'lamps': {
    'comfort-plus-l3': [
      '/img/products/Consumables/Lamps/Comfort PlusL3/comfort-plus-product-image (1).png',
      '/img/products/Consumables/Lamps/Comfort PlusL3/comfort-plus-product-image (2).png',
      '/img/products/Consumables/Lamps/Comfort PlusL3/comfort-plus-product-image (4).png',
    ],
    'quick-cure-g1': [
      '/img/products/Consumables/Lamps/Quick Cure G1/quick-cure-hand-held (1).jpg',
      '/img/products/Consumables/Lamps/Quick Cure G1/quick-cure-hand-held (2).jpg',
      '/img/products/Consumables/Lamps/Quick Cure G1/quick-cure-handhel-lamp (1).jpg',
    ],
  },
};

/**
 * Product placeholder images by category
 * Used as fallback when specific product image is not available
 */
export const productPlaceholder: Record<string, string> = {
  'gel-polish': '/img/products/gel_polishes/gel_polish_category_1.jpg',
  'builder-gels': '/img/products/builder-systems/Builder Gels/3-in-1-builder_gels_category_3.jpg',
  'tops-and-bases': '/img/products/tops-and-bases/tops/tops-bases_category_1.jpg',
  'primers-liquids': '/img/products/primers-and-liquids/bonder-without-acid.jpg',
  'nail-art': '/img/products/nail-art/nail-art-category-image.jpg',
  'lamps': '/img/products/Consumables/Lamps/comfort-plusL1-category-image.jpg',
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
