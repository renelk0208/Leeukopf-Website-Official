// src/config/seasonal.ts

export type Season = "christmas" | "winter" | "spring" | "summer" | "autumn" | "none";

// Manual flag (recommended). Change these when swapping seasons.
export const CURRENT_SEASON: Season = "none";
export const CURRENT_YEAR = "2025";

// Our Products page seasonal hero video
export function getOurProductsVideoSrc(): string {
  if (CURRENT_SEASON === "none") return "";
  return `/videos/seasonal/our-products__${CURRENT_SEASON}__${CURRENT_YEAR}.mp4`;
}

// Show snow during Christmas and winter seasons
export const shouldShowSnow = CURRENT_SEASON === "christmas" || CURRENT_SEASON === "winter";
