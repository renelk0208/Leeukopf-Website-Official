import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const DISMISS_KEY = 'leeukopf_sticky_booking_dismissed';

export default function StickyBooking() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(window.localStorage.getItem(DISMISS_KEY) === 'true');
  }, []);

  useEffect(() => {
    if (dismissed) {
      setVisible(false);
      return;
    }

    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  const handleDismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, 'true');
    setDismissed(true);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-white shadow-lg"
      role="complementary"
      aria-label="Launch consultation call to action"
    >
      <div className="mx-auto flex h-12 w-full max-w-screen-2xl items-center justify-between gap-2 px-4 sm:px-6">
        <div className="truncate text-sm font-medium">
          <span className="hidden sm:inline">Ready to launch your brand? - </span>
          <Link to="/client-registration" className="font-semibold underline underline-offset-2 hover:opacity-90">
            Book a Free Consultation -&gt;
          </Link>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/80 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss sticky booking bar"
        >
          X
        </button>
      </div>
    </div>
  );
}
