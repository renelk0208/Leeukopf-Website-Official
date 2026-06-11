import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { PriceTier } from "../types";

export interface PriceEntry {
  price: number;
  currency: string;
}

export type PriceMap = Map<string, PriceEntry>; // key: `${subcategory}|${"pcs" | "kg"}`

/**
 * Fetches price tiers from the `b2b_price_tiers` table for the given tier.
 * Returns a lookup map keyed by `"${subcategory}|${unit}"` (unit = "pcs" | "kg").
 *
 * Usage:
 *   const priceMap = useB2BPricing(priceTier);
 *   const entry = priceMap.get("Cat Eye|pcs"); // { price: 2.50, currency: "EUR" }
 */
export function useB2BPricing(priceTier: PriceTier | null): PriceMap {
  const [priceMap, setPriceMap] = useState<PriceMap>(new Map());

  useEffect(() => {
    if (!priceTier) {
      setPriceMap(new Map());
      return;
    }

    let active = true;

    supabase
      .from("b2b_price_tiers")
      .select("subcategory, unit, price, currency")
      .eq("tier", priceTier)
      .then(({ data }) => {
        if (!active) return;
        const map = new Map<string, PriceEntry>();
        data?.forEach((row) => {
          map.set(`${String(row.subcategory)}|${String(row.unit)}`, {
            price: Number(row.price),
            currency: String(row.currency ?? "EUR"),
          });
        });
        setPriceMap(map);
      });

    return () => {
      active = false;
    };
  }, [priceTier]);

  return priceMap;
}

/** Convenience helper: look up a price by subcategory + unit. Returns null if not found. */
export function lookupPrice(
  priceMap: PriceMap,
  subcategory: string,
  unit: "pcs" | "kg"
): number | null {
  return priceMap.get(`${subcategory}|${unit}`)?.price ?? null;
}
