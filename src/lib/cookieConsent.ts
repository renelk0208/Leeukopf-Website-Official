/**
 * Cookie consent utilities
 * Shared functions for reading and working with cookie consent preferences
 */

export type CookieConsentChoice = "all" | "necessary";

export interface CookieConsentValue {
  choice: CookieConsentChoice;
  timestamp: number;
}

export const CONSENT_COOKIE_NAME = "lkp_cookie_consent";

/**
 * Get the current cookie consent value
 * 
 * @returns The consent value if valid cookie exists, null otherwise
 */
export function getConsentCookie(): CookieConsentValue | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split(";")
    .map(c => c.trim())
    .find(c => c.startsWith(`${CONSENT_COOKIE_NAME}=`));

  if (!match) return null;

  try {
    const [, raw] = match.split("=");
    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded) as CookieConsentValue;

    if (parsed && (parsed.choice === "all" || parsed.choice === "necessary")) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Check if analytics cookies are accepted
 * 
 * @returns true if user has accepted all cookies (including analytics)
 */
export function hasAnalyticsConsent(): boolean {
  const consent = getConsentCookie();
  return consent?.choice === "all";
}
