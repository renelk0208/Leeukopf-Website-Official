// Black Friday 2026 bulk offer — colours, categories and wording.
// Imported by the page AND the order function. PRICES ARE NOT HERE on purpose:
// they live only in netlify/functions/black-friday-prices.ts so they never
// reach the browser.

export type BfCategory = 'colors' | 'glitters' | 'shimmers' | 'metallics';

export const BF_CATEGORIES: Record<BfCategory, { label: string }> = {
  colors: { label: 'Colours' },
  glitters: { label: 'Glitters' },
  shimmers: { label: 'Shimmers' },
  metallics: { label: 'Metallics' },
};

export const BF_MIN_TOTAL_KG = 10;
export const BF_LEAD_TIME = '5 to 8 working days';
export const BF_CURRENCY = 'EUR';

export interface BfColour {
  code: string;
  category: BfCategory;
}

// Order matches the PDF swatch page. A colour's category sets its price (see the server price list).
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
  'Products are supplied in 1 kg bulk units. Black Friday prices are confirmed on your invoice.',
  `The minimum order is ${BF_MIN_TOTAL_KG} kg in total across all colours (not per colour). Colours and categories can be mixed.`,
  'Placing an order does not charge you. Thermitek LTD will email an invoice; payment is by bank transfer (TT).',
  'VAT and shipping costs, where applicable, are added on the invoice.',
  `Lead time is ${BF_LEAD_TIME}.`,
  'All colours are subject to availability. Thermitek LTD reserves the right to decline or adjust any order.',
  'On-screen colours are a guide; the physical product is the true colour reference.',
];

export const bfSwatchSrc = (code: string) => `/seasonal/black-friday/swatches/${code.toLowerCase()}.webp`;

export const bfIsColour = (code: string) => BF_COLOURS.some((x) => x.code === code);
