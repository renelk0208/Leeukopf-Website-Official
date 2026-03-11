export type B2BCategory =
  | "SOLID_GEL_POLISH"
  | "BUILDER_GEL"
  | "POLYGEL"
  | "BIAB"
  | "TOP"
  | "BASE"
  | "OTHER";

export type BuyerType = "finished_goods" | "bulk";

/** Price tier assigned to a client by Leeukopf admin. null = new/unpriced client (quote flow). */
export type PriceTier = string; // e.g. 'standard' | 'distributor' | 'key_account'

export type CartUnitType = "PCS" | "KG";

export type BottleBranding = "PRE_PRINTED" | "LABELS";
export type BottleColor = "BLACK" | "WHITE" | "OTHER";
export type BrushType = "OVAL" | "FLAT";
export type BottleSize = "10ML" | "15ML" | "OTHER";
export type JarSize = "30G" | "40G" | "OTHER";

export type BottlePackaging = {
  size: BottleSize;
  color: BottleColor;
  brush: BrushType;
  branding: BottleBranding;
};

export type JarPackaging = {
  size: JarSize;
  color: BottleColor;
  branding: BottleBranding;
};

export interface CartItem {
  category: B2BCategory;
  code: string;
  internalSku?: string;
  name?: string;
  quantity: number;
  unitType?: CartUnitType;
  swatchImage?: string;
  meta?: Record<string, string | number | boolean | null>;
}

export interface CartTotals {
  totalLines: number;
  totalQty: number;
}

export type QuantityValidation = {
  hasQuantityError: boolean;
  reason: string | null;
};
