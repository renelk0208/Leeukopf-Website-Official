/**
 * Remembers a registered client's trade-documents access link in this browser,
 * so returning to /trade-documents works without digging out the email.
 * Storage can be unavailable (private mode, blocked cookies) — everything here is best-effort.
 */
const KEY = 'leeukopf.trade-docs.access.v1';

export function saveTradeDocsAccess(token: string) {
  try {
    window.localStorage.setItem(KEY, token);
  } catch {
    /* ignore */
  }
}

export function readTradeDocsAccess(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function clearTradeDocsAccess() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
