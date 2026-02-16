export interface CatalogEntry {
  groupCode: string;
  productName: string;
  allowedPackSizes: string[];
  moq: number;
  shades: {
    shadeCode: string;
    shadeName?: string;
  }[];
}
