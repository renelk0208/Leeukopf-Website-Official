// SERVER ONLY — Black Friday 2026 prices per 1 kg, by category.
// Never import this from src/: prices must not appear on the website.
import type { BfCategory } from '../../../src/data/blackFridayOffer';

export const BF_PRICE_PER_KG: Record<BfCategory, number> = {
  colors: 59,
  glitters: 68,
  shimmers: 68,
  metallics: 68,
};
