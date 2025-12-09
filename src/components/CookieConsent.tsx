import { useEffect, useState, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';

const COOKIE_KEY = 'cookie-consent';

type ConsentValue = 'accepted' | 'rejected';

/**
 * CookieConsent - A GDPR-compliant cookie consent banner
 * 
 * Shows a top-fixed banner on first visit asking for cookie consent with a blocking overlay.
 * Blocks all navigation and interactions until consent is given.
 * Stores choice in localStorage and won't show again unless site data is cleared.
 */
const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const existing = window.localStorage.getItem(COOKIE_KEY) as ConsentValue | null;
    if (!existing) {
      setVisible(true);
    }
  }, []);

  const setConsent = (value: ConsentValue) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(COOKIE_KEY, value);
    }
    setVisible(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Don't allow escape to close - user must make a choice
    e.preventDefault();
  };

  if (!visible) return null;

  return (
    <>
      {/* Blocking overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
        aria-hidden="true"
      />
      
      {/* Cookie consent banner */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-description"
        onKeyDown={handleKeyDown}
        className="fixed top-0 left-0 right-0 z-[9999] bg-white border-b-2 border-brandFuchsia shadow-2xl p-4 sm:p-6"
      >
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 id="cookie-consent-title" className="text-base font-semibold text-gray-900 mb-1">
              Cookie Consent Required
            </h2>
            <p id="cookie-consent-description" className="text-sm text-gray-600">
              We use cookies to enhance your browsing experience and analyse site traffic.
              By clicking "Accept", you consent to our use of cookies.{' '}
              <Link
                to="/cookies-policy"
                className="text-brandFuchsia hover:underline focus:underline focus:outline-none"
                onClick={(e) => {
                  // Allow navigation to cookies policy even when banner is active
                  e.stopPropagation();
                }}
              >
                Learn more about our cookies policy
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setConsent('rejected')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 min-h-[44px]"
            >
              Reject
            </button>
            <button
              onClick={() => setConsent('accepted')}
              className="px-4 py-2 text-sm font-medium text-white bg-brandFuchsia hover:brightness-90 rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brandFuchsia focus-visible:ring-offset-2 min-h-[44px]"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;
