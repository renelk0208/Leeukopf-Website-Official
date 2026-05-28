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
    imageSrc: "/img/b2b/categories/bases-category.png",
    imageAlt: "Base coats",
    navChildren: [
      { label: "Classic Base", routePath: "/b2b/extra-strength-bases/classic-base", imageSrc: "/img/b2b/categories/bases-category.png", imageAlt: "Classic base" },
      { label: "Extra Strength Base", routePath: "/b2b/extra-strength-bases/extra-strength-base", imageSrc: "/img/b2b/categories/bases-category.png", imageAlt: "Extra strength base" },
      { label: "Rubber Bases", routePath: "/b2b/extra-strength-bases/rubber-bases", imageSrc: "/img/b2b/categories/bases-category.png", imageAlt: "Rubber bases" },
      { label: "Top Coat", routePath: "/b2b/extra-strength-bases/top-coat", imageSrc: "/img/b2b/categories/bases-category.png", imageAlt: "Top coat" },
    ],
  },
  {
    key: "BUILDER_GEL",
    label: "Builder Gel Systems",
    routePath: "/b2b/builder-gels",
    defaultUnitType: "PCS",
    enabled: true,
    imageSrc: "/img/b2b/categories/builder-gels-category.jpg",
    imageAlt: "Builder gel systems",
    navChildren: [
      { label: "3-in-1 Fibreglass Gel", routePath: "/b2b/builder-gels/3-in-1-fibreglass-gel", imageSrc: "/img/b2b/categories/3-in-1-builder-gel-main-category-image.webp", imageAlt: "3-in-1 fibreglass gel" },
      { label: "Acrylics", routePath: "/b2b/builder-gels/acrylics", imageSrc: "/img/b2b/categories/builder-gels-category.jpg", imageAlt: "Acrylics" },
      { label: "Builder in a Bottle (BIAB)", routePath: "/b2b/builder-gels/biab", imageSrc: "/img/b2b/categories/builder-gels-category.jpg", imageAlt: "Builder in a bottle" },
      { label: "Colour Builder Gel", routePath: "/b2b/builder-gels/colour-builder-gel", imageSrc: "/img/b2b/categories/builder-gels-category.jpg", imageAlt: "Colour builder gel" },
      { label: "Liquid Polygel", routePath: "/b2b/polygels/liquid-polygel", imageSrc: "/img/b2b/categories/builder-gels-category.jpg", imageAlt: "Liquid polygel" },
      { label: "Master Builder Gels", routePath: "/b2b/builder-gels/master-builder-gels", imageSrc: "/img/b2b/categories/builder-gels-category.jpg", imageAlt: "Master builder gels" },
      { label: "No Heat Builder", routePath: "/b2b/builder-gels/no-heat-builder", imageSrc: "/img/b2b/categories/builder-gels-category.jpg", imageAlt: "No heat builder" },
      { label: "Polygel", routePath: "/b2b/polygels/polygel", imageSrc: "/img/b2b/categories/builder-gels-category.jpg", imageAlt: "Polygel" },
      { label: "Thixotropic Gel", routePath: "/b2b/builder-gels/thixotropic-gel", imageSrc: "/img/b2b/categories/builder-gels-category.jpg", imageAlt: "Thixotropic gel" },
    ],
  },
  {
    key: "SOLID_GEL_POLISH",
    label: "Colours",
    routePath: "/b2b/solid-colours",
    defaultUnitType: "PCS",
    enabled: true,
    imageSrc: "/img/b2b/categories/solid-colours-category.jpeg",
    imageAlt: "Gel polish colours",
    navChildren: [
      { label: "Solid Colours", routePath: "/b2b/solid-colours/solid-colours", imageSrc: "/img/b2b/categories/solid-colours-category.jpeg", imageAlt: "Solid colours" },
      { label: "Cat Eye", routePath: "/b2b/solid-colours/cat-eye", imageSrc: "/img/b2b/categories/solid-colours-category.jpeg", imageAlt: "Cat eye" },
      { label: "Cream Collection", routePath: "/b2b/solid-colours/cream-collection", imageSrc: "/img/b2b/categories/solid-colours-category.jpeg", imageAlt: "Cream collection" },
      { label: "French Collection", routePath: "/b2b/solid-colours/french-collection", imageSrc: "/img/b2b/categories/solid-colours-category.jpeg", imageAlt: "French collection" },
      { label: "Glitters", routePath: "/b2b/solid-colours/glitters", imageSrc: "/img/b2b/categories/solid-colours-category.jpeg", imageAlt: "Glitters" },
      { label: "Metallics", routePath: "/b2b/solid-colours/metallics", imageSrc: "/img/b2b/categories/solid-colours-category.jpeg", imageAlt: "Metallics" },
      { label: "Platinum", routePath: "/b2b/solid-colours/platinum", imageSrc: "/img/b2b/categories/solid-colours-category.jpeg", imageAlt: "Platinum" },
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
    imageSrc: "/img/products/liquids-&-solutions/liquids-&-solutions-category-card-image.png",
    imageAlt: "Liquids and solutions",
    navChildren: [
      { label: "Cleansers", routePath: "/b2b/liquids/cleansers", imageSrc: "/img/products/liquids-&-solutions/liquids-&-solutions-category-card-image.png", imageAlt: "Cleansers" },
      { label: "Removers", routePath: "/b2b/liquids/removers", imageSrc: "/img/products/liquids-&-solutions/liquids-&-solutions-category-card-image.png", imageAlt: "Removers" },
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
    imageSrc: "/img/b2b/categories/builder-gels-category.jpg",
    imageAlt: "Accessories",
    navChildren: [
      { label: "Brushes", routePath: "/b2b/accessories/brushes", swatchColour: "#6B7280" },
      { label: "Tools", routePath: "/b2b/accessories/tools", swatchColour: "#9CA3AF" },
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
