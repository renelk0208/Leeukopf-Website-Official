import React, { useEffect, useState } from "react";
import { getConsentCookie, CookieConsentChoice, CookieConsentValue, CONSENT_COOKIE_NAME } from "../lib/cookieConsent";

const CONSENT_COOKIE_MAX_AGE_DAYS = 365;

function setConsentCookie(value: CookieConsentValue) {
  const maxAge = CONSENT_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60; // seconds
  const encoded = encodeURIComponent(JSON.stringify(value));
  document.cookie = `${CONSENT_COOKIE_NAME}=${encoded};path=/;max-age=${maxAge};SameSite=Lax`;
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

  // Block body scroll when modal is visible
  useEffect(() => {
    if (isVisible || showSettings) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible, showSettings]);

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
      {/* Centered Modal with Backdrop */}
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" style={{ overflow: 'hidden' }}>
          <div className="mx-4 max-w-2xl w-full rounded-2xl bg-white p-6 md:p-8 shadow-2xl border border-primary-100">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  Cookies on Leeukopf Laboratories
                </h2>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  We use cookies to keep our site working properly and to
                  understand how it&apos;s used, so we can improve your
                  experience. You can accept all cookies or keep only the ones
                  that are strictly necessary.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => handleConsent("necessary")}
                  className="w-full sm:w-auto rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Reject non-essential
                </button>

                <button
                  type="button"
                  onClick={openSettings}
                  className="w-full sm:w-auto rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Manage preferences
                </button>

                <button
                  type="button"
                  onClick={() => handleConsent("all")}
                  className="w-full sm:w-auto rounded-full px-6 py-3 text-sm font-semibold text-white bg-brightPink hover:bg-brightPink-hover transition"
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 md:p-8 shadow-2xl border border-primary-100">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold mb-2 text-slate-900">
                  Cookie settings
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  Choose whether you allow only strictly necessary cookies or
                  also analytics and marketing cookies. You can change your
                  choice at any time.
                </p>
              </div>
              <button
                type="button"
                onClick={closeSettings}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60">
                <p className="text-sm font-semibold mb-2 text-slate-900">
                  Necessary cookies
                </p>
                <p className="text-xs text-slate-600">
                  Required for core functionality such as navigation, security,
                  and submitting forms. These are always on and cannot be
                  disabled.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold mb-2 text-slate-900">
                  Analytics & marketing cookies
                </p>
                <p className="text-xs text-slate-600 mb-3">
                  Used to understand how our website is used and to improve our
                  marketing (for example, Google Analytics, Meta or TikTok
                  pixels). These only run if you allow them.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handleConsent("necessary")}
                    className="w-full rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    Allow only necessary
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConsent("all")}
                    className="w-full rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-brightPink hover:bg-brightPink-hover transition"
                  >
                    Allow all cookies
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
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
