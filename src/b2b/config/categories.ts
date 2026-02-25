import type { B2BCategory, CartUnitType } from "../types";

export type B2BCategoryConfig = {
  key: B2BCategory;
  label: string;
  routePath: string;
  defaultUnitType: CartUnitType;
  enabled: boolean;
  imageSrc?: string;
  imageAlt?: string;
  parentLabel?: string;
  navChildren?: Array<{ label: string; routePath: string }>;
};

export const b2bCategories: B2BCategoryConfig[] = [
  {
    key: "SOLID_GEL_POLISH",
    label: "Colours",
    routePath: "/b2b/solid-colours",
    defaultUnitType: "PCS",
    enabled: true,
    imageSrc: "/img/products/gel_polishes/gel_polish_category_category-card-image-1.jpeg",
    imageAlt: "Gel polish colours",
    navChildren: [
      { label: "Solid Colours", routePath: "/b2b/solid-colours/solid-colours" },
      { label: "Cat Eye", routePath: "/b2b/solid-colours/cat-eye" },
      { label: "French Collection", routePath: "/b2b/solid-colours/french-collection" },
      { label: "Glitters", routePath: "/b2b/solid-colours/glitters" },
      { label: "Platinum", routePath: "/b2b/solid-colours/platinum" },
      { label: "Cream Collection", routePath: "/b2b/solid-colours/cream-collection" },
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
      { label: "Acrylics", routePath: "/b2b/builder-gels/acrylics" },
      { label: "3-in-1 Builder Gels", routePath: "/b2b/builder-gels/3-in-1-builder-gels" },
      { label: "3-in-1 Fibreglass Gel", routePath: "/b2b/builder-gels/3-in-1-fibreglass-gel" },
      { label: "Builder in a Bottle (BIAB)", routePath: "/b2b/builder-gels/biab" },
      { label: "Liquid polygel", routePath: "/b2b/polygels/liquid-polygel" },
      { label: "Polygel", routePath: "/b2b/polygels/polygel" },
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
    parentLabel: "Top Coat",
  },
  {
    key: "BASE",
    label: "Bases",
    routePath: "/b2b/extra-strength-bases",
    defaultUnitType: "PCS",
    enabled: true,
    imageSrc: "/img/products/tops-and-bases/base-coat-category-card-image.png",
    imageAlt: "Base coats",
    navChildren: [
      { label: "Rubber Bases", routePath: "/b2b/extra-strength-bases/rubber-bases" },
      { label: "Classic Base", routePath: "/b2b/extra-strength-bases/classic-base" },
    ],
  },
];

export function getB2BCategoryLabel(category: B2BCategory): string {
  return b2bCategories.find((entry) => entry.key === category)?.label ?? category;
}
