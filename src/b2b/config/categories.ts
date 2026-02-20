import type { B2BCategory, CartUnitType } from "../types";

export type B2BCategoryConfig = {
  key: B2BCategory;
  label: string;
  routePath: string;
  defaultUnitType: CartUnitType;
  enabled: boolean;
};

export const b2bCategories: B2BCategoryConfig[] = [
  {
    key: "SOLID_GEL_POLISH",
    label: "Solid Colours",
    routePath: "/b2b/solid-colours",
    defaultUnitType: "PCS",
    enabled: true,
  },
  {
    key: "BUILDER_GEL",
    label: "Builder Gels",
    routePath: "/b2b/builder-gels",
    defaultUnitType: "PCS",
    enabled: true,
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
    label: "Top Coats",
    routePath: "/b2b/tops-bases",
    defaultUnitType: "PCS",
    enabled: false,
  },
  {
    key: "BASE",
    label: "Base Coats",
    routePath: "/b2b/tops-bases",
    defaultUnitType: "PCS",
    enabled: false,
  },
];

export function getB2BCategoryLabel(category: B2BCategory): string {
  return b2bCategories.find((entry) => entry.key === category)?.label ?? category;
}
