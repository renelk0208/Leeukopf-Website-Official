import { getStore } from '@netlify/blobs';
import { createHash, randomBytes } from 'node:crypto';
import { BF_CATEGORIES, BF_COLOURS } from '../../../src/data/blackFridayOffer';
import { BF_COUNTRIES, BF_VIES_PREFIX, bfIsEu, bfNormaliseVat } from '../../../src/data/bfCountries';

/**
 * Black Friday registrations + saved baskets, kept in Netlify Blobs (store "bf-baskets").
 *   b/<token>        → the registration and its basket
 *   e/<email hash>   → token, so a returning customer can be emailed a resume link
 * The token is random and only ever reaches the customer (their browser / emailed link) and the admin.
 */

export const MAX_KG_PER_LINE = 999;

export interface ViesResult {
  status: 'valid' | 'invalid' | 'unavailable' | 'not_eu';
  name: string | null;
  address: string | null;
  checkedAt: string;
}

export interface BasketContact {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
  vatNumber: string; // without country prefix for EU numbers
  vies: ViesResult;
}

export interface BasketLine {
  code: string;
  kg: number;
}

export interface Basket {
  token: string;
  status: 'open' | 'ordered';
  orderId: string | null;
  contact: BasketContact;
  lines: BasketLine[];
  totalKg: number;
  totalEur: number;
  createdAt: string;
  updatedAt: string;
  orderedAt: string | null;
  reminderSentAt?: string | null;
}

/** A basket from a visitor who has not registered: no contact details, only what they picked. */
export interface AnonBasket {
  anonId: string;
  lines: BasketLine[];
  totalKg: number;
  totalEur: number;
  country: string | null;
  createdAt: string;
  updatedAt: string;
  registered: boolean; // went on to register (then it is listed as a registration instead)
}

/** Open baskets untouched for this long count as abandoned. */
export const ABANDONED_AFTER_MS = 24 * 60 * 60 * 1000;
export const isAbandoned = (b: Pick<Basket, 'status' | 'updatedAt' | 'lines'>, now = Date.now()) =>
  b.status === 'open' && b.lines.length > 0 && now - Date.parse(b.updatedAt) >= ABANDONED_AFTER_MS;

type Store = ReturnType<typeof getStore>;

// The functions using this run in Netlify's modern format, which provides the Blobs context.
// The argument is unused; it keeps call sites unchanged.
export function basketStore(_event?: unknown): Store {
  return getStore({ name: 'bf-baskets', consistency: 'strong' });
}

export const newToken = () => randomBytes(18).toString('base64url');
export const isToken = (t: unknown): t is string => typeof t === 'string' && /^[A-Za-z0-9_-]{20,40}$/.test(t);
const emailKey = (email: string) => `e/${createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0, 32)}`;

export const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export type ContactInput = Partial<Record<Exclude<keyof BasketContact, 'vies'>, unknown>>;

/** Cleans the registration fields. Returns the contact plus a list of what is missing or wrong. */
export function cleanContact(c: ContactInput | undefined): { contact: Omit<BasketContact, 'vies'>; problems: string[] } {
  const country = str(c?.country, 80);
  const contact = {
    firstName: str(c?.firstName, 80),
    lastName: str(c?.lastName, 80),
    companyName: str(c?.companyName),
    email: str(c?.email).toLowerCase(),
    phone: str(c?.phone, 60),
    addressLine1: str(c?.addressLine1),
    addressLine2: str(c?.addressLine2),
    city: str(c?.city, 120),
    postalCode: str(c?.postalCode, 30),
    country,
    vatNumber: bfNormaliseVat(country, str(c?.vatNumber, 40)),
  };
  const problems: string[] = [];
  const need: Array<[keyof typeof contact, string]> = [
    ['firstName', 'name'],
    ['lastName', 'surname'],
    ['email', 'email'],
    ['phone', 'contact number'],
    ['addressLine1', 'address line 1'],
    ['city', 'city'],
    ['postalCode', 'postal code'],
    ['country', 'country'],
  ];
  if (bfIsEu(country)) need.push(['vatNumber', 'VAT number']);
  for (const [k, label] of need) if (!contact[k]) problems.push(label);
  if (contact.email && !isEmail(contact.email)) problems.push('a valid email');
  if (country && !BF_COUNTRIES.includes(country)) problems.push('a country from the list');
  return { contact, problems };
}

/** Checks an EU VAT number with the European Commission's VIES service. */
export async function checkVies(country: string, vatNumber: string): Promise<ViesResult> {
  const checkedAt = new Date().toISOString();
  const prefix = BF_VIES_PREFIX[country];
  if (!prefix) return { status: 'not_eu', name: null, address: null, checkedAt };
  const number = bfNormaliseVat(country, vatNumber);
  if (!number) return { status: 'invalid', name: null, address: null, checkedAt };
  try {
    const res = await fetch('https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ countryCode: prefix, vatNumber: number }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json().catch(() => ({}))) as {
      valid?: boolean;
      name?: string;
      address?: string;
      userError?: string;
      errorWrappers?: Array<{ error?: string }>;
    };
    const err = data.userError || data.errorWrappers?.[0]?.error || '';
    if (data.valid === true) {
      const clean = (s?: string) => (s && s.trim() && s.trim() !== '---' ? s.replace(/\s+/g, ' ').trim() : null);
      return { status: 'valid', name: clean(data.name), address: clean(data.address), checkedAt };
    }
    if (data.valid === false && (!err || err === 'VALID' || err === 'INVALID')) {
      return { status: 'invalid', name: null, address: null, checkedAt };
    }
    if (err === 'INVALID_INPUT') return { status: 'invalid', name: null, address: null, checkedAt };
    console.warn('[bf-baskets] VIES unavailable', res.status, err);
    return { status: 'unavailable', name: null, address: null, checkedAt };
  } catch (e) {
    console.warn('[bf-baskets] VIES request failed', e);
    return { status: 'unavailable', name: null, address: null, checkedAt };
  }
}

/** Rebuilds basket lines from the price list; unknown codes and bad quantities are dropped. */
export function cleanLines(raw: unknown): { lines: BasketLine[]; totalKg: number; totalEur: number } {
  const qty = new Map<string, number>();
  if (Array.isArray(raw)) {
    for (const l of raw.slice(0, 200)) {
      const code = str((l as BasketLine)?.code, 20);
      const kg = Number((l as BasketLine)?.kg);
      if (!BF_COLOURS.some((x) => x.code === code)) continue;
      if (!Number.isInteger(kg) || kg < 1) continue;
      qty.set(code, Math.min(MAX_KG_PER_LINE, (qty.get(code) ?? 0) + kg));
    }
  }
  const lines = BF_COLOURS.filter((x) => qty.has(x.code)).map((x) => ({ code: x.code, kg: qty.get(x.code)! }));
  let totalKg = 0;
  let totalEur = 0;
  for (const l of lines) {
    const colour = BF_COLOURS.find((x) => x.code === l.code)!;
    totalKg += l.kg;
    totalEur += l.kg * BF_CATEGORIES[colour.category].pricePerKg;
  }
  return { lines, totalKg, totalEur };
}

export async function readBasket(store: Store, token: unknown): Promise<Basket | null> {
  if (!isToken(token)) return null;
  return ((await store.get(`b/${token}`, { type: 'json' })) as Basket | null) ?? null;
}

export async function writeBasket(store: Store, basket: Basket) {
  await store.setJSON(`b/${basket.token}`, basket);
  await store.set(emailKey(basket.contact.email), basket.token);
}

export async function tokenForEmail(store: Store, email: string): Promise<string | null> {
  const t = (await store.get(emailKey(email), { type: 'text' })) as string | null;
  return isToken(t) ? t : null;
}

export async function listBaskets(store: Store): Promise<Basket[]> {
  const { blobs } = await store.list({ prefix: 'b/' });
  const all = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' }) as Promise<Basket | null>));
  return all.filter((b): b is Basket => !!b).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export const isAnonId = (t: unknown): t is string => typeof t === 'string' && /^[A-Za-z0-9_-]{16,40}$/.test(t);

export async function readAnon(store: Store, anonId: unknown): Promise<AnonBasket | null> {
  if (!isAnonId(anonId)) return null;
  return ((await store.get(`a/${anonId}`, { type: 'json' })) as AnonBasket | null) ?? null;
}

export async function writeAnon(store: Store, basket: AnonBasket) {
  await store.setJSON(`a/${basket.anonId}`, basket);
}

export async function listAnon(store: Store): Promise<AnonBasket[]> {
  const { blobs } = await store.list({ prefix: 'a/' });
  const all = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' }) as Promise<AnonBasket | null>));
  return all
    .filter((b): b is AnonBasket => !!b && !b.registered && b.lines.length > 0)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** Called by the order function once an order has gone through. Never throws. */
export async function markBasketOrdered(event: unknown, token: unknown, orderId: string) {
  try {
    const store = basketStore(event);
    const basket = await readBasket(store, token);
    if (!basket) return;
    const now = new Date().toISOString();
    await writeBasket(store, { ...basket, status: 'ordered', orderId, orderedAt: now, updatedAt: now });
  } catch (err) {
    console.error('[bf-baskets] could not mark basket as ordered', err);
  }
}

export const viesLabel = (v: ViesResult) =>
  v.status === 'valid'
    ? 'Valid in VIES'
    : v.status === 'invalid'
      ? 'NOT valid in VIES'
      : v.status === 'unavailable'
        ? 'VIES was unavailable — please check manually'
        : 'Non-EU — no VIES check';
