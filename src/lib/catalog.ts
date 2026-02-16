/**
 * Builder Gel Catalog Loader
 *
 * Synchronous loader for the builder gel catalog JSON.
 * (No fetch, no async) — safest for Vite + avoids "catalog.find is not a function".
 */

import type { CatalogEntry } from "../types/catalog";
import builderGelCatalog from "../../data/catalog.builder-gel.json";

let cachedCatalog: CatalogEntry[] | null = null;

/**
 * Returns the complete builder gel catalog.
 */
export function getBuilderGelCatalog(): CatalogEntry[] {
  if (cachedCatalog) return cachedCatalog;
  cachedCatalog = (builderGelCatalog as CatalogEntry[]) ?? [];
  return cachedCatalog;
}

/**
 * Returns a single catalog entry by groupCode (case-insensitive).
 */
export function getCatalogEntry(groupCode: string): CatalogEntry | undefined {
  const catalog = getBuilderGelCatalog();
  return catalog.find(
    (entry) => entry.groupCode.toLowerCase() === groupCode.toLowerCase()
  );
}

/**
 * Clears the cached catalog (useful for testing).
 */
export function clearCatalogCache(): void {
  cachedCatalog = null;
}
