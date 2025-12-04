/**
 * Product Categories Visibility Configuration
 * 
 * Control which product categories and subcategories are visible on the website.
 * Set to `true` to show the category, `false` to hide it.
 * 
 * This allows you to gradually enable categories as assets and content become available,
 * without removing any code.
 */

export const enabledCategories = {
  // Main product categories
  gelPolish: true,
  builderAndStructureGels: false, // Enable when ready
  topAndBases: false, // Enable when ready
  polygelAcrygel: false, // Enable when ready
  acrylicSystems: false, // Enable when ready
  liquidsAndSolutions: false, // Enable when ready
  nailArt: false, // Enable when ready
  accessories: false, // Enable when ready
};

export const enabledSubcategories = {
  // Builder & Structure Gels subcategories
  builderGels: {
    threePhase: false,
    threeInOne: false,
    premiumFiberGlass: false,
  },
  
  // Top & Bases subcategories
  topCoats: {
    enabled: false, // Main Top Coats page
    standard: false,
    effects: false,
  },
  baseCoats: {
    enabled: false, // Main Base Coats page
    classic: false,
    rubberBase: false,
    superiorBase: false,
  },
};

/**
 * Check if a main category is enabled
 */
export function isCategoryEnabled(category: keyof typeof enabledCategories): boolean {
  return enabledCategories[category] === true;
}

/**
 * Check if a subcategory is enabled
 */
export function isSubcategoryEnabled(
  parent: keyof typeof enabledSubcategories,
  subcategory: string
): boolean {
  const parentConfig = enabledSubcategories[parent];
  if (!parentConfig) return false;
  
  // @ts-expect-error - Dynamic subcategory access
  return parentConfig[subcategory] === true;
}
