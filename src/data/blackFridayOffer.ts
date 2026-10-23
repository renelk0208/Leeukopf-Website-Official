// Black Friday 2026 bulk offer — single source of truth.
// Imported by the page (src/pages/BlackFridayPage.tsx) AND by the order
// function (netlify/functions/black-friday-order.ts), so prices are always
// recalculated on the server and cannot be changed from the browser.

export type BfCategory = 'colors' | 'glitters' | 'shimmers' | 'metallics';

export const BF_CATEGORIES: Record<BfCategory, { label: string; pricePerKg: number }> = {
  colors: { label: 'Colours', pricePerKg: 59 },
  glitters: { label: 'Glitters', pricePerKg: 68 },
  shimmers: { label: 'Shimmers', pricePerKg: 68 },
  metallics: { label: 'Metallics', pricePerKg: 68 },
};

export const BF_MIN_TOTAL_KG = 10;
export const BF_LEAD_TIME = '5 to 8 working days';
export const BF_CURRENCY = 'EUR';

export interface BfColour {
  code: string;
  category: BfCategory;
}

// Order matches the PDF swatch page. Change a colour's category here to change its price.
export const BF_COLOURS: BfColour[] = [
  { code: '01', category: 'colors' },
  { code: '15', category: 'colors' },
  { code: '08B', category: 'colors' },
  { code: '10', category: 'colors' },
  { code: '11', category: 'colors' },
  { code: '31', category: 'colors' },
  { code: '79', category: 'colors' },
  { code: '126', category: 'colors' },
  { code: '134', category: 'colors' },
  { code: '143', category: 'colors' },
  { code: '152', category: 'colors' },
  { code: '1804', category: 'colors' },
  { code: '1815', category: 'colors' },
  { code: '1934', category: 'colors' },
  { code: '1937', category: 'glitters' },
  { code: '2051', category: 'colors' },
  { code: '2052', category: 'colors' },
  { code: '2113P', category: 'glitters' },
  { code: '2113R', category: 'glitters' },
  { code: '2113S', category: 'glitters' },
  { code: '2319', category: 'colors' },
  { code: '2442', category: 'colors' },
  { code: '2444', category: 'colors' },
  { code: '2455', category: 'glitters' },
  { code: '2518', category: 'colors' },
  { code: '2525', category: 'colors' },
  { code: '2526', category: 'colors' },
  { code: '2527', category: 'colors' },
  { code: '2529', category: 'colors' },
  { code: 'R27', category: 'colors' },
  { code: 'R28', category: 'colors' },
  { code: 'R38', category: 'colors' },
  { code: 'R39', category: 'colors' },
  { code: 'R40', category: 'colors' },
  { code: 'SH1', category: 'shimmers' },
  { code: 'SH2', category: 'shimmers' },
  { code: 'SH3', category: 'shimmers' },
  { code: 'SH4', category: 'shimmers' },
  { code: 'MC1', category: 'metallics' },
  { code: 'MC2', category: 'metallics' },
  { code: 'MC3', category: 'metallics' },
  { code: 'MC4', category: 'metallics' },
  { code: 'MC5', category: 'metallics' },
  { code: 'MC6', category: 'metallics' },
  { code: 'MC7', category: 'metallics' },
  { code: 'MC8', category: 'metallics' },
];

// Shown in the terms box above the order button. Edit freely.
export const BF_TERMS: string[] = [
  'Black Friday prices apply to orders placed through this page only, while the offer is running.',
  'Products are supplied in 1 kg bulk units. Prices are per kg by category: colours 59€, glitters, shimmers and metallics 68€.',
  `The minimum order is ${BF_MIN_TOTAL_KG} kg in total across all colours (not per colour). Colours and categories can be mixed.`,
  'Placing an order does not charge you. Thermitek LTD will email an invoice; payment is by bank transfer (TT).',
  'VAT and shipping costs, where applicable, are added on the invoice.',
  `Lead time is ${BF_LEAD_TIME}.`,
  'All colours are subject to availability. Thermitek LTD reserves the right to decline or adjust any order.',
  'On-screen colours are a guide; the physical product is the true colour reference.',
];

export const bfSwatchSrc = (code: string) => `/seasonal/black-friday/swatches/${code.toLowerCase()}.webp`;

export const bfIsColour = (code: string) => BF_COLOURS.some((x) => x.code === code);

export function bfPrice(code: string): number | null {
  const c = BF_COLOURS.find((x) => x.code === code);
  return c ? BF_CATEGORIES[c.category].pricePerKg : null;
}
