export type B2BCategory =
  | "SOLID_GEL_POLISH"
  | "BUILDER_GEL"
  | "POLYGEL"
  | "BIAB"
  | "TOP"
  | "BASE"
  | "OTHER";

export type CartUnitType = "PCS" | "KG";

export type BottleBranding = "PRE_PRINTED" | "LABELS";
export type BottleColor = "BLACK" | "WHITE" | "OTHER";
export type BrushType = "OVAL" | "FLAT";
export type BottleSize = "10ML" | "15ML" | "OTHER";
<<<<<<< HEAD
=======
export type BuilderJarColor = "BLACK" | "WHITE";
export type BuilderJarSize = "30G";
>>>>>>> 1687569 (feat(b2b): enforce 30g white/black jars and 25 MOQ for builder gels)

export type BottlePackaging = {
  size: BottleSize;
  color: BottleColor;
  brush: BrushType;
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
