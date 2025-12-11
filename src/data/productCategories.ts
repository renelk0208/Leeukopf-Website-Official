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
    id: 'cat-eye-collection',
    key: 'cat-eye-collection',
    displayName: 'Cat Eye Collection',
    imagePath: '/img/products/gel_polishes/Cat Eye Collection/cat-eye_categoty_card-image.png',
    group: 'Gel Polish',
  },
  {
    id: 'cream-collection',
    key: 'cream-collection',
    displayName: 'Cream Collection',
    imagePath: '/img/products/gel_polishes/Cream Collection/solid-cream-category-card-image.jpg',
    group: 'Gel Polish',
  },
  {
    id: 'glitters-collection',
    key: 'glitters-collection',
    displayName: 'Glitters Collection',
    imagePath: '/img/products/gel_polishes/Glitters Collection/glitters-image-category-card.png',
    group: 'Gel Polish',
  },
  {
    id: 'solid-colour-collection',
    key: 'solid-colour-collection',
    displayName: 'Solid Colour Collection',
    imagePath: '/img/products/gel_polishes/Solid Colour Collection/FH_pure_color_gel_polish_hema_free_1.jpg',
    group: 'Gel Polish',
  },
  {
    id: 'french-collection',
    key: 'french-collection',
    displayName: 'French Collection',
    imagePath: '/img/products/gel_polishes/French Collection/french-collection-category-card-image.png',
    group: 'Gel Polish',
  },
  {
    id: 'autumn-winter-25-26',
    key: 'autumn-winter-25-26',
    displayName: 'Autumn Winter 25/26',
    imagePath: '/img/products/gel_polishes/autumn_winter_25_26/2026_new_collection_cover.jpg',
    group: 'Gel Polish',
  },
  {
    id: 'glow-in-the-dark',
    key: 'glow-in-the-dark',
    displayName: 'Glow In the Dark',
    imagePath: '/img/products/gel_polishes/Glow In the Dark/glow-in-the-dark-gel-polish-category-card-image.png',
    group: 'Gel Polish',
  },
  {
    id: 'platinum-gel-polish',
    key: 'platinum-gel-polish',
    displayName: 'Platinum Gel Polish',
    imagePath: '/img/products/gel_polishes/Platinum Gel Polish/platinum-gel-polish-collection-gel-polish-category-card-image.png',
    group: 'Gel Polish',
  },
  {
    id: 'thermo-mood-changing',
    key: 'thermo-mood-changing',
    displayName: 'Thermo Mood Changing',
    imagePath: '/img/products/gel_polishes/Thermo Mood Changing/thermo-mood-changing-gel-polish-category-image.png',
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
    imagePath: '/img/products/builder-systems/Premium Builder Gels/1-premium-builder-gels-category-card-image.jpg',
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
    imagePath: '/img/products/tops-and-bases/rubber-base-category-image.jpg',
    group: 'Tops & Bases',
  },
  {
    id: 'classic-top-coats',
    key: 'classic-top-coats',
    displayName: 'Classic Top Coats',
    imagePath: '/img/products/tops-and-bases/tops/standard-top-coats-catergory-image.jpg',
    group: 'Tops & Bases',
  },
  {
    id: 'effect-tops',
    key: 'effect-tops',
    displayName: 'Effect Top Coats',
    imagePath: '/img/products/tops-and-bases/tops/effect-tops-category.jpg',
    group: 'Tops & Bases',
  },
  {
    id: 'five-in-one',
    key: 'five-in-one',
    displayName: '5-in-1 System',
    imagePath: '/img/products/tops-and-bases/Superior Base Coat/superior-base-coat-category-card-image.jpg',
    group: 'Tops & Bases',
  },
  {
    id: 'brush-on-builder',
    key: 'brush-on-builder',
    displayName: 'Brush-On Builder',
    imagePath: '/img/products/tops-and-bases/brush-on-builder/brush-on-builder-category-card-image.jpg',
    group: 'Tops & Bases',
  },

  // Primers & Liquids Categories
  {
    id: 'primers-with-acid',
    key: 'primers-with-acid',
    displayName: 'Primers with Acid',
    imagePath: '/img/products/primers-and-liquids/bonder-with-acid.jpg',
    group: 'Primers & Liquids',
  },
  {
    id: 'primers-liquids',
    key: 'primers-liquids',
    displayName: 'Primers & Liquids',
    imagePath: '/img/products/primers-and-liquids/acrylic_liquid_category_1.jpg',
    group: 'Primers & Liquids',
  },

  // Specialty/Nail Art
  {
    id: 'nail-art',
    key: 'nail-art',
    displayName: 'Nail Art',
    imagePath: '/img/products/nail-art/Nail Art/nail-art-category-card-imge.png',
    group: 'Nail Art',
  },

  // Polygel/AcryGel
  {
    id: 'polygel-acrygel',
    key: 'polygel-acrygel',
    displayName: 'Polygel / AcryGel',
    imagePath: '/img/products/builder-systems/Acrygel/acrygel_polygel-category_image.jpg',
    group: 'Builder Gels',
  },

  // Lamps - UV & LED
  {
    id: 'lamps',
    key: 'lamps',
    displayName: 'UV & LED Lamps',
    imagePath: '/img/products/Lamps/UV_lamps_category_1.jpg',
    group: 'Lamps',
  },
  {
    id: 'comfort-plus-l3',
    key: 'comfort-plus-l3',
    displayName: 'Comfort Plus L3',
    imagePath: '/img/products/Lamps/Comfort PlusL3/l3-lamp-category-image.png',
    group: 'Lamps',
  },
  {
    id: 'quick-cure-g1',
    key: 'quick-cure-g1',
    displayName: 'Quick Cure G1',
    imagePath: '/img/products/Lamps/Quick Cure G1/quick-cure-hand-held-category-image.jpg',
    group: 'Lamps',
  },

  // Jars & Tubes - Packaging
  {
    id: 'jars-and-tubes',
    key: 'jars-and-tubes',
    displayName: 'Jars & Tubes',
    imagePath: '/img/products/jars-and-tubes/website_leeukopf_acrylic_jar_1.jpg',
    group: 'Packaging',
  },
];
