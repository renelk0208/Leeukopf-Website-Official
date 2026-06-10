import { useEffect, useState } from 'react';
import CalendlyButton from './CalendlyButton';

export default function StickyBooking() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-3 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-full px-5 py-2.5 text-sm font-medium text-gray-700 animate-fade-in"
      role="complementary"
      aria-label="Book a consultation"
    >
      <span className="whitespace-nowrap">Ready to launch your brand?</span>
      <CalendlyButton size="sm" />
    </div>
  );
}
