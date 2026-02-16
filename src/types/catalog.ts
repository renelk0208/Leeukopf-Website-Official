/**
 * Builder Gel Catalog Types
 * 
 * Defines the structure for builder gel product catalog entries
 */

export interface CatalogEntry {
  groupCode: string;
  productName: string;
  allowedPackSizes: string[];
  moq: number;
  shades: string[];
}

export type BuilderGelCatalog = CatalogEntry[];
