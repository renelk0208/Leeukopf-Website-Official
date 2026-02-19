/**
 * B2B Order Engine category rules.
 *
 * Use this file for ordering logic such as allowed units, packaging,
 * and order-form behavior flags.
 */
export const categories = {
  solidColour: {
    label: "Solid Colour Gel Polish",
    allowedUnits: ["pcs", "kg"],
    allowedPackaging: ["bottle", "bucket"],
    hasGlobalBrush: true,
    hasJarSizeSelector: false
  },

  topBase: {
    label: "Top & Base Coats",
    allowedUnits: ["pcs"],
    allowedPackaging: ["bottle"],
    hasGlobalBrush: true,
    hasJarSizeSelector: false
  }
};

type OrderCategoryKey = keyof typeof categories;

const categoryCsvAliases: Record<OrderCategoryKey, string[]> = {
  solidColour: ["Solid Colour Gel Polish", "Gel Polish"],
  topBase: ["Top & Base Coats", "Top & Base"],
};

export function resolveOrderCategoryKey(csvCategory: string): OrderCategoryKey | null {
  const normalizedCategory = csvCategory.trim().toLowerCase();

  for (const key of Object.keys(categoryCsvAliases) as OrderCategoryKey[]) {
    const isMatch = categoryCsvAliases[key].some(
      (alias) => alias.toLowerCase() === normalizedCategory
    );

    if (isMatch) {
      return key;
    }
  }

  return null;
}

export function resolveOrderCategoryLabel(csvCategory: string): string | null {
  const categoryKey = resolveOrderCategoryKey(csvCategory);
  return categoryKey ? categories[categoryKey].label : null;
}