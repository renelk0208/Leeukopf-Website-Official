/**
 * Builder Gel Catalog Loader
 * 
 * Provides helper functions to load and access the builder gel catalog
 */

import type { CatalogEntry, BuilderGelCatalog } from '../types/catalog';

let cachedCatalog: BuilderGelCatalog | null = null;

/**
 * Loads and returns the complete builder gel catalog
 * Uses caching to avoid multiple fetch calls
 * 
 * @returns Promise<CatalogEntry[]> Array of all catalog entries
 */
export async function getBuilderGelCatalog(): Promise<CatalogEntry[]> {
  if (cachedCatalog) {
    return cachedCatalog;
  }

  try {
    const response = await fetch('/data/catalog.builder-gel.json');
    if (!response.ok) {
      throw new Error(`Failed to load catalog: ${response.statusText}`);
    }
    const catalog: BuilderGelCatalog = await response.json();
    cachedCatalog = catalog;
    return catalog;
  } catch (error) {
    console.error('Error loading builder gel catalog:', error);
    throw error;
  }
}

/**
 * Retrieves a specific catalog entry by its group code (case-insensitive)
 * 
 * @param groupCode The unique identifier for the product group
 * @returns Promise<CatalogEntry | undefined> The matching catalog entry or undefined if not found
 */
export async function getCatalogEntry(groupCode: string): Promise<CatalogEntry | undefined> {
  const catalog = await getBuilderGelCatalog();
  return catalog.find(entry => entry.groupCode.toLowerCase() === groupCode.toLowerCase());
}

/**
 * Clears the cached catalog
 * Useful for testing or if catalog needs to be reloaded
 */
export function clearCatalogCache(): void {
  cachedCatalog = null;
}
