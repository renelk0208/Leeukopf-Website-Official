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
    key: "BASE",
    label: "Bases",
    routePath: "/b2b/extra-strength-bases",
    defaultUnitType: "PCS",
    enabled: true,
    imageSrc: "/img/b2b/categories/bases-category.png",
    imageAlt: "Base coats",
    navChildren: [
      { label: "Classic Base", routePath: "/b2b/extra-strength-bases/classic-base" },
      { label: "Extra Strength Base", routePath: "/b2b/extra-strength-bases/extra-strength-base" },
      { label: "Rubber Bases", routePath: "/b2b/extra-strength-bases/rubber-bases" },
      { label: "Top Coat", routePath: "/b2b/extra-strength-bases/top-coat" },
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
      { label: "3-in-1 Builder Gels", routePath: "/b2b/builder-gels/3-in-1-builder-gels" },
      { label: "3-in-1 Fibreglass Gel", routePath: "/b2b/builder-gels/3-in-1-fibreglass-gel" },
      { label: "Builder in a Bottle (BIAB)", routePath: "/b2b/builder-gels/biab" },
      { label: "Colour Builder Gel", routePath: "/b2b/builder-gels/colour-builder-gel" },
      { label: "Liquid Polygel", routePath: "/b2b/polygels/liquid-polygel" },
      { label: "Master Builder Gels", routePath: "/b2b/builder-gels/master-builder-gels" },
      { label: "No Heat Builder", routePath: "/b2b/builder-gels/no-heat-builder" },
      { label: "Polygel", routePath: "/b2b/polygels/polygel" },
      { label: "Thixotropic Gel", routePath: "/b2b/builder-gels/thixotropic-gel" },
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
      { label: "Solid Colours", routePath: "/b2b/solid-colours/solid-colours" },
      { label: "Cat Eye", routePath: "/b2b/solid-colours/cat-eye" },
      { label: "Cream Collection", routePath: "/b2b/solid-colours/cream-collection" },
      { label: "French Collection", routePath: "/b2b/solid-colours/french-collection" },
      { label: "Glitters", routePath: "/b2b/solid-colours/glitters" },
      { label: "Platinum", routePath: "/b2b/solid-colours/platinum" },
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
