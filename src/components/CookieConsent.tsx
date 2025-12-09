import React, { useEffect, useState } from "react";

type CookieConsentChoice = "all" | "necessary";

interface CookieConsentValue {
  choice: CookieConsentChoice;
  timestamp: number;
}

const CONSENT_COOKIE_NAME = "lkp_cookie_consent";
const CONSENT_COOKIE_MAX_AGE_DAYS = 365;

function setConsentCookie(value: CookieConsentValue) {
  const maxAge = CONSENT_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60; // seconds
  const encoded = encodeURIComponent(JSON.stringify(value));
  document.cookie = `${CONSENT_COOKIE_NAME}=${encoded};path=/;max-age=${maxAge};SameSite=Lax`;
}

function getConsentCookie(): CookieConsentValue | null {
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

function dispatchConsentEvent(choice: CookieConsentChoice) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("cookieConsentChanged", { detail: { choice } })
  );
}

/**
 * CookieConsent - A GDPR-compliant cookie consent banner with settings
 * 
 * Shows a banner on first visit with options to accept all, only necessary, or open settings.
 * Includes a detailed settings modal explaining cookie types.
 * Can be reopened from footer via custom event.
 * Stores choice in a cookie for 365 days.
 */
export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentChoice, setCurrentChoice] = useState<CookieConsentChoice | null>(null);

  useEffect(() => {
    const existing = getConsentCookie();
    if (existing) {
      setCurrentChoice(existing.choice);
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, []);

  // Listen for global "openCookieSettings" so the footer can trigger it
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = () => {
      setShowSettings(true);
      setIsVisible(false);
    };

    window.addEventListener("openCookieSettings", handler);
    return () => {
      window.removeEventListener("openCookieSettings", handler);
    };
  }, []);

  const handleConsent = (choice: CookieConsentChoice) => {
    const value: CookieConsentValue = {
      choice,
      timestamp: Date.now(),
    };

    setConsentCookie(value);
    setCurrentChoice(choice);
    setIsVisible(false);
    setShowSettings(false);
    dispatchConsentEvent(choice);
  };

  const openSettings = () => {
    setShowSettings(true);
    setIsVisible(false);
  };

  const closeSettings = () => {
    setShowSettings(false);
    if (!currentChoice) {
      setIsVisible(true);
    }
  };

  if (!isVisible && !showSettings) return null;

  return (
    <>
      {/* Banner */}
      {isVisible && (
        <div className="fixed inset-x-0 bottom-0 z-40">
          <div className="mx-auto mb-4 max-w-5xl rounded-2xl bg-white/95 p-4 shadow-lg border border-primary-100 backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1 pr-0 md:pr-4">
                <p className="text-sm font-semibold text-slate-900">
                  Cookies on Leeukopf Laboratories
                </p>
                <p className="text-xs text-slate-600 leading-snug">
                  We use cookies to keep our site working properly and to
                  understand how it&apos;s used, so we can improve your
                  experience. You can accept all cookies or keep only the ones
                  that are strictly necessary.
                </p>
              </div>

              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <button
                  type="button"
                  onClick={() => handleConsent("necessary")}
                  className="w-full rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition md:w-auto"
                >
                  Only necessary
                </button>

                <button
                  type="button"
                  onClick={() => handleConsent("all")}
                  className="w-full rounded-full px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-600 transition md:w-auto"
                >
                  Accept all
                </button>

                <button
                  type="button"
                  onClick={openSettings}
                  className="w-full text-[11px] text-slate-500 underline underline-offset-2 hover:text-slate-700 md:w-auto"
                >
                  Cookie settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl border border-primary-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold mb-1 text-slate-900">
                  Cookie settings
                </h2>
                <p className="text-xs text-slate-600 mb-3">
                  Choose whether you allow only strictly necessary cookies or
                  also analytics and marketing cookies. You can change your
                  choice at any time.
                </p>
              </div>
              <button
                type="button"
                onClick={closeSettings}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 space-y-3">
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/60">
                <p className="text-xs font-semibold mb-1 text-slate-900">
                  Necessary cookies
                </p>
                <p className="text-[11px] text-slate-600">
                  Required for core functionality such as navigation, security,
                  and submitting forms. These are always on and cannot be
                  disabled.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs font-semibold mb-1 text-slate-900">
                  Analytics & marketing cookies
                </p>
                <p className="text-[11px] text-slate-600 mb-2">
                  Used to understand how our website is used and to improve our
                  marketing (for example, Google Analytics, Meta or TikTok
                  pixels). These only run if you allow them.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handleConsent("necessary")}
                    className="w-full rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    Allow only necessary
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConsent("all")}
                    className="w-full rounded-full px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-600 transition"
                  >
                    Allow all cookies
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-3 text-[10px] text-slate-400">
              Your choice will be saved for 12 months (365 days). You can reopen these
              settings any time via the &quot;Cookie settings&quot; link in the
              footer.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
