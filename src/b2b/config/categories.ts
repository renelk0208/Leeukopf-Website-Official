import type { B2BCategory, CartUnitType } from "../types";

export type B2BCategoryNavChild = {
  label: string;
  routePath: string;
  imageSrc?: string;
  imageAlt?: string;
  swatchColour?: string;
};

export type B2BCategoryConfig = {
  key: B2BCategory;
  label: string;
  routePath: string;
  defaultUnitType: CartUnitType;
  enabled: boolean;
  imageSrc?: string;
  imageAlt?: string;
  parentLabel?: string;
  navChildren?: B2BCategoryNavChild[];
};

export const b2bCategories: B2BCategoryConfig[] = [
  {
    key: "BASE",
    label: "Bases & Coatings",
    routePath: "/b2b/extra-strength-bases",
    defaultUnitType: "PCS",
    enabled: true,
    imageSrc: "/img/products/tops-and-bases/tops/tops-bases_category_1.jpg",
    imageAlt: "Base coats",
    navChildren: [
      { label: "Classic Base", routePath: "/b2b/extra-strength-bases/classic-base", imageSrc: "/img/products/tops-and-bases/Bases/base-coat-category-card-image.png", imageAlt: "Classic base" },
      { label: "Extra Strength Base", routePath: "/b2b/extra-strength-bases/extra-strength-base", imageSrc: "/img/products/tops-and-bases/Superior Base Coat/superior-base-coat-category-card-image.jpg", imageAlt: "Extra strength base" },
      { label: "Rubber Bases", routePath: "/b2b/extra-strength-bases/rubber-bases", imageSrc: "/img/products/tops-and-bases/rubber-bases/rubber-base-category-card-image.jpg", imageAlt: "Rubber bases" },
      { label: "Top Coat", routePath: "/b2b/extra-strength-bases/top-coat", imageSrc: "/img/products/tops-and-bases/tops/tops-bases_category_1.jpg", imageAlt: "Top coat" },
    ],
  },
  {
    key: "BUILDER_GEL",
    label: "Builder Gel Systems",
    routePath: "/b2b/builder-gels",
    defaultUnitType: "PCS",
    enabled: true,
    imageSrc: "/img/products/builder-systems/Builder Gels/builder_gels_category_2.jpg",
    imageAlt: "Builder gel systems",
    navChildren: [
      { label: "3-in-1 Fibreglass Gel", routePath: "/b2b/builder-gels/3-in-1-fibreglass-gel", imageSrc: "/img/products/builder-systems/3-in-1 Builder gel/3-in-1-builder-gel-main-category-image.webp", imageAlt: "3-in-1 fibreglass gel" },
      { label: "Acrylics", routePath: "/b2b/builder-gels/acrylics", imageSrc: "/img/products/builder-systems/Acrylic/acrylic-powder-and liquid-category-card-image.jpg", imageAlt: "Acrylics" },
      { label: "Builder in a Bottle (BIAB)", routePath: "/b2b/builder-gels/biab", imageSrc: "/img/products/builder-systems/BIAB builder-in-a-bottle/BIAB-brush-on-builder-category-card-image.jpg", imageAlt: "Builder in a bottle" },
      { label: "Colour Builder Gel", routePath: "/b2b/builder-gels/colour-builder-gel", imageSrc: "/img/products/builder-systems/Builder Gels/colour-builder_gels_category_1_2.jpg", imageAlt: "Colour builder gel" },
      { label: "Liquid Polygel", routePath: "/b2b/polygels/liquid-polygel", imageSrc: "/img/products/liquid polygel/liquid-polygel-category-card-image.png", imageAlt: "Liquid polygel" },
      { label: "Master Builder Gels", routePath: "/b2b/builder-gels/master-builder-gels", imageSrc: "/img/products/builder-systems/Premium Builder Gels/1-premium-builder-gels-category-card-image.jpg", imageAlt: "Master builder gels" },
      { label: "No Heat Builder", routePath: "/b2b/builder-gels/no-heat-builder", imageSrc: "/img/products/builder-systems/No Heat Spike Builder Gel/no-heat-spike-builder-gel-category-card.jpg", imageAlt: "No heat builder" },
      { label: "Polygel", routePath: "/b2b/polygels/polygel", imageSrc: "/img/products/builder-systems/Acrygel-Polygel/webp/acrygel-polygel-category-card-image.webp", imageAlt: "Polygel" },
      { label: "Shimmer Builder Gel", routePath: "/b2b/builder-gels/shimmer-builder-gel", imageSrc: "/img/b2b/builder-gels/3-in-1-builder/shimmer-builder-gels/MI-GLB1-01.webp", imageAlt: "Shimmer builder gel" },
      { label: "Thixotropic Gel", routePath: "/b2b/builder-gels/thixotropic-gel", imageSrc: "/img/products/builder-systems/thixotropic-gel/thixotropic-gel-category-image.png", imageAlt: "Thixotropic gel" },
    ],
  },
  {
    key: "SOLID_GEL_POLISH",
    label: "Colours",
    routePath: "/b2b/solid-colours",
    defaultUnitType: "PCS",
    enabled: true,
    imageSrc: "/img/products/gel_polishes/gel_polish_category_category-card-image-1.jpeg",
    imageAlt: "Gel polish colours",
    navChildren: [
      { label: "Solid Colours", routePath: "/b2b/solid-colours/solid-colours", imageSrc: "/img/products/gel_polishes/Solid Colour Collection/solid-colour-collection-category card image.jpg", imageAlt: "Solid colours" },
      { label: "Cat Eye", routePath: "/b2b/solid-colours/cat-eye", imageSrc: "/img/products/gel_polishes/Cat Eye Collection/cat-eye_categoty_card-image.png", imageAlt: "Cat eye" },
      { label: "Cream Collection", routePath: "/b2b/solid-colours/cream-collection", imageSrc: "/img/products/gel_polishes/Cream Collection/solid-cream-category-card-image.jpg", imageAlt: "Cream collection" },
      { label: "French Collection", routePath: "/b2b/solid-colours/french-collection", imageSrc: "/img/products/gel_polishes/French Collection/french-collection-category-card-image.png", imageAlt: "French collection" },
      { label: "Glitters", routePath: "/b2b/solid-colours/glitters", imageSrc: "/img/products/gel_polishes/Glitters Collection/glitters-image-category-card.webp", imageAlt: "Glitters" },
      { label: "Metallics", routePath: "/b2b/solid-colours/metallics", imageSrc: "/img/products/gel_polishes/builder_gels_category_shimmer.jpg", imageAlt: "Metallics" },
      { label: "Platinum", routePath: "/b2b/solid-colours/platinum", imageSrc: "/img/products/gel_polishes/Platinum Gel Polish/platinum-gel-polish-collection-gel-polish-category-card-image.webp", imageAlt: "Platinum" },
      { label: "Shell Shimmer", routePath: "/b2b/solid-colours/shell-shimmer", imageSrc: "/img/b2b/shell_shimmer_gel_polish/SH-SHC-1_01.webp", imageAlt: "Shell shimmer collection" },
      { label: "Blues", routePath: "/b2b/solid-colours/blues", swatchColour: "#4169E1" },
      { label: "Greens", routePath: "/b2b/solid-colours/greens", swatchColour: "#2E8B57" },
      { label: "Reds", routePath: "/b2b/solid-colours/reds", swatchColour: "#DC143C" },
      { label: "Pinks", routePath: "/b2b/solid-colours/pinks", swatchColour: "#FF69B4" },
      { label: "Purples", routePath: "/b2b/solid-colours/purples", swatchColour: "#7B2D8B" },
      { label: "Oranges", routePath: "/b2b/solid-colours/oranges", swatchColour: "#FF8C00" },
      { label: "Yellows", routePath: "/b2b/solid-colours/yellows", swatchColour: "#FFD700" },
      { label: "Teals", routePath: "/b2b/solid-colours/teals", swatchColour: "#008080" },
      { label: "Browns", routePath: "/b2b/solid-colours/browns", swatchColour: "#8B4513" },
      { label: "Nudes & Beiges", routePath: "/b2b/solid-colours/nudes-beiges", swatchColour: "#D4A574" },
      { label: "Whites", routePath: "/b2b/solid-colours/whites", swatchColour: "#F0F0F0" },
      { label: "Blacks", routePath: "/b2b/solid-colours/blacks", swatchColour: "#1A1A1A" },
      { label: "Greys", routePath: "/b2b/solid-colours/greys", swatchColour: "#808080" },
    ],
  },
  {
    key: "LIQUID",
    label: "Liquids & Solutions",
    routePath: "/b2b/liquids",
    defaultUnitType: "PCS",
    enabled: true,
    imageSrc: "/img/products/liquids-&-solutions/webp/liquids-&-solutions-category-card-image.webp",
    imageAlt: "Liquids and solutions",
    navChildren: [
      { label: "Liquids & Solutions", routePath: "/b2b/liquids", imageSrc: "/img/products/liquids-&-solutions/webp/liquids-&-solutions-category-card-image.webp", imageAlt: "Liquids & Solutions" },
    ],
  },
  {
    key: "NAIL_ART",
    label: "Nail Art",
    routePath: "/b2b/nail-art",
    defaultUnitType: "PCS",
    enabled: true,
    imageSrc: "/img/products/nail-art/Nail Art/nail-art-category-card-imge.webp",
    imageAlt: "Nail art",
    navChildren: [
      { label: "3D Gel", routePath: "/b2b/nail-art/3d-gel", imageSrc: "/img/b2b/nail-art/3D Gel/3DG-1-01.webp", imageAlt: "3D Gel" },
      { label: "Glitters", routePath: "/b2b/nail-art/glitters", imageSrc: "/img/products/nail-art/Nail Art/nail-art-category-card-imge.webp", imageAlt: "Glitters" },
      { label: "Pigments", routePath: "/b2b/nail-art/pigments", imageSrc: "/img/products/nail-art/Nail Art/nail-art-category-card-imge.webp", imageAlt: "Pigments" },
    ],
  },
  {
    key: "ACCESSORY",
    label: "Accessories",
    routePath: "/b2b/accessories",
    defaultUnitType: "PCS",
    enabled: true,
    imageSrc: "/img/products/Lamps/lamps_category_card-1.jpg",
    imageAlt: "Accessories",
    navChildren: [
      { label: "Tools", routePath: "/b2b/accessories/tools", imageSrc: "/img/products/Lamps/lamps_category_card-1.jpg", imageAlt: "Tools" },
    ],
  },
  {
    key: "POLYGEL",
    label: "Polygels",
    routePath: "/b2b/polygels",
    defaultUnitType: "PCS",
    enabled: false,
  },
  {
    key: "BIAB",
    label: "BIAB",
    routePath: "/b2b/biab",
    defaultUnitType: "PCS",
    enabled: false,
  },
  {
    key: "TOP",
    label: "Top Coat",
    routePath: "/b2b/tops-bases",
    defaultUnitType: "PCS",
    enabled: false,
  },
];

export function getB2BCategoryLabel(category: B2BCategory): string {
  return b2bCategories.find((entry) => entry.key === category)?.label ?? category;
}
