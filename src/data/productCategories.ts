/**
 * Product Categories Data Model
 * 
 * This file contains the data structure for all product categories across different groups.
 * Each category has a unique ID, key for URLs, display name, image path, and group.
 */

export type ProductCategory = {
  id: string;          // Unique identifier
  key: string;         // Internal key, used in URLs (kebab-case)
  displayName: string; // User-facing name
  imagePath: string;   // Path starting with /img/ from public
  group: string;       // e.g. "Gel Polish", "Builder Gels", etc.
};

/**
 * All product categories organized by group
 */
export const productCategories: ProductCategory[] = [
  // Gel Polish Categories
  {
    id: 'glitters-collection',
    key: 'glitters-collection',
    displayName: 'Glitters Collection',
    imagePath: '/img/products/gel_polishes/gel_polish_category_1.jpg',
    group: 'Gel Polish',
  },
  {
    id: 'green-collection',
    key: 'green-collection',
    displayName: 'Green Collection',
    imagePath: '/img/products/gel_polishes/gel_polish_category_1.jpg',
    group: 'Gel Polish',
  },
  {
    id: 'pastel-collection',
    key: 'pastel-collection',
    displayName: 'Pastel Collection',
    imagePath: '/img/products/gel_polishes/gel_polish_category_1.jpg',
    group: 'Gel Polish',
  },
  {
    id: 'rose-nude-collection',
    key: 'rose-nude-collection',
    displayName: 'Rose Nude Collection',
    imagePath: '/img/products/gel_polishes/gel_polish_category_1.jpg',
    group: 'Gel Polish',
  },
  {
    id: 'solid-colour-collection',
    key: 'solid-colour-collection',
    displayName: 'Solid Colour Collection',
    imagePath: '/img/products/gel_polishes/gel_polish_category_1.jpg',
    group: 'Gel Polish',
  },
  {
    id: 'solid-cream-collection',
    key: 'solid-cream-collection',
    displayName: 'Solid Cream Collection',
    imagePath: '/img/products/gel_polishes/Solid%20Cream%20Collection/solid-cream-category%20image.jpg',
    group: 'Gel Polish',
  },
  {
    id: 'transparent-color-gel-polish',
    key: 'transparent-color-gel-polish',
    displayName: 'Transparent Color Gel Polish',
    imagePath: '/img/products/gel_polishes/gel_polish_category_1.jpg',
    group: 'Gel Polish',
  },
  {
    id: 'warm-nudes-collection',
    key: 'warm-nudes-collection',
    displayName: 'Warm Nudes Collection',
    imagePath: '/img/products/gel_polishes/gel_polish_category_1.jpg',
    group: 'Gel Polish',
  },
  {
    id: 'cat-eye-collection',
    key: 'cat-eye-collection',
    displayName: 'Cat Eye Collection',
    imagePath: '/img/products/gel_polishes/gel_polish_category_1.jpg',
    group: 'Gel Polish',
  },

  // Builder Gels Categories
  {
    id: 'three-phase-builder',
    key: 'three-phase-builder',
    displayName: '3-Phase Builder Gel',
    imagePath: '/img/products/builder-systems/Builder Gels/3-phase-builder_gels_category_4.jpg',
    group: 'Builder Gels',
  },
  {
    id: 'three-in-one-builder',
    key: 'three-in-one-builder',
    displayName: '3-in-1 Builder Gel',
    imagePath: '/img/products/builder-systems/Builder Gels/3-in-1-builder_gels_category_3.jpg',
    group: 'Builder Gels',
  },
  {
    id: 'premium-builder-gels',
    key: 'premium-builder-gels',
    displayName: 'Premium Builder Gels',
    imagePath: '/img/products/builder-systems/Premium Builder Gels/premium-builder-gels-category.jpg',
    group: 'Builder Gels',
  },
  {
    id: 'colour-builder-gels',
    key: 'colour-builder-gels',
    displayName: 'Colour Builder Gels',
    imagePath: '/img/products/builder-systems/Builder Gels/colour-builder_gels_category_1_2.jpg',
    group: 'Builder Gels',
  },

  // Tops & Bases Categories
  {
    id: 'rubber-bases',
    key: 'rubber-bases',
    displayName: 'Rubber Bases',
    imagePath: '/img/products/tops-and-bases/rubber-bases/rubber%20bases%20category%20image.jpg',
    group: 'Tops & Bases',
  },
  {
    id: 'classic-top-coats',
    key: 'classic-top-coats',
    displayName: 'Classic Top Coats',
    imagePath: '/img/products/tops-and-bases/tops-bases_category_1.jpg',
    group: 'Tops & Bases',
  },
  {
    id: 'effect-tops',
    key: 'effect-tops',
    displayName: 'Effect Top Coats',
    imagePath: '/img/products/tops-and-bases/tops/Effect Tops/effect-tops-category.jpg',
    group: 'Tops & Bases',
  },
  {
    id: 'five-in-one',
    key: 'five-in-one',
    displayName: '5-in-1 System',
    imagePath: '/img/products/tops-and-bases/tops-bases_category_1.jpg',
    group: 'Tops & Bases',
  },
  {
    id: 'brush-on-builder',
    key: 'brush-on-builder',
    displayName: 'Brush-On Builder',
    imagePath: '/img/products/tops-and-bases/tops-bases_category_1.jpg',
    group: 'Tops & Bases',
  },

  // Primers & Liquids Categories
  // Note: No dedicated images available yet for primers and liquids.
  // These will be added when product images become available.
  // Until then, this group will show an empty state.

  // Specialty/Nail Art
  {
    id: 'nail-art',
    key: 'nail-art',
    displayName: 'Nail Art',
    imagePath: '/img/products/nail-art/nail-art-category.jpg',
    group: 'Accessories',
  },

  // Polygel/AcryGel
  {
    id: 'polygel-acrygel',
    key: 'polygel-acrygel',
    displayName: 'Polygel / AcryGel',
    imagePath: '/img/products/builder-systems/Acrygel/acrygel_polygel-category_image.jpg',
    group: 'Builder Gels',
  },
];
