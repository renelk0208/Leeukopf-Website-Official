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
  builderAndStructureGels: true, // Enabled - images available
  topAndBases: true, // Enabled - images available
  polygelAcrygel: true, // Enabled - images available
  acrylicSystems: false, // Enable when ready
  liquidsAndSolutions: false, // Enable when ready
  nailArt: true, // Enabled - images available
  accessories: false, // Enable when ready
};

export const enabledSubcategories = {
  // Builder & Structure Gels subcategories
  builderGels: {
    threePhase: true, // Enabled - images available
    threeInOne: true, // Enabled - images available
    premiumFiberGlass: true, // Enabled - images available
  },
  
  // Top & Bases subcategories
  topCoats: {
    enabled: true, // Main Top Coats page - enabled
    standard: true, // Enabled - images available
    effects: true, // Enabled - images available
  },
  baseCoats: {
    enabled: true, // Main Base Coats page - enabled
    classic: true, // Enabled - images available
    rubberBase: true, // Enabled - images available
    superiorBase: true, // Enabled - images available
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
  
  // Type-safe dynamic subcategory access
  return (parentConfig as Record<string, boolean>)[subcategory] === true;
}
