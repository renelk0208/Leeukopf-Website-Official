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
  polygelAcrygel: false, // Moved to Builder & Structure Gels subcategory
  acrylicSystems: true, // Enabled - images available
  liquidsAndSolutions: true, // Enabled - images available
  nailArt: true, // Enabled - images available
  lamps: true, // Enabled - UV & LED Lamps with 2 models
  accessories: false, // Enable when ready
  jarsAndTubes: false, // Moved to Private Label section - now at /private-label/jars-and-tubes
};

export const enabledSubcategories = {
  // Builder & Structure Gels subcategories
  builderGels: {
    threePhase: true, // Enabled - images available
    threeInOne: true, // Enabled - images available
    premiumFiberGlass: true, // Enabled - images available
    polygelAcrygel: true, // Enabled - Polygel/AcryGel
    liquidPolygel: true, // Enabled - Liquid Polygel
    noHeatSpikeBuilderGel: true, // Enabled - No Heat Spike Builder Gel
    biabBuilderInABottle: true, // Enabled - BIAB Builder in a Bottle
    thixotropicGel: true, // Enabled - Thixotropic Gel
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
    standardRubberBase: true, // Enabled - Standard Rubber Base subcategory
    effectsRubberBase: true, // Enabled - Effects Rubber Base subcategory
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
