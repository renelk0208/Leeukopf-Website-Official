import { useEffect, useState, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';

const COOKIE_KEY = 'cookie-consent';

type ConsentValue = 'accepted' | 'rejected';

/**
 * CookieConsent - A GDPR-compliant cookie consent banner
 * 
 * Shows a bottom-fixed banner on first visit asking for cookie consent.
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
    if (e.key === 'Escape') {
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      onKeyDown={handleKeyDown}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 sm:p-6"
    >
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 id="cookie-consent-title" className="text-base font-semibold text-gray-900 mb-1">
            Cookie Consent
          </h2>
          <p id="cookie-consent-description" className="text-sm text-gray-600">
            We use cookies to enhance your browsing experience and analyse site traffic.
            By clicking "Accept", you consent to our use of cookies.{' '}
            <Link
              to="/cookies-policy"
              className="text-brandFuchsia hover:underline focus:underline focus:outline-none"
            >
              Learn more
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
  );
};

export default CookieConsent;
