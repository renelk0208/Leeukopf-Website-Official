import { Link } from 'react-router-dom';

/**
 * StartHereBanner - A one-line banner for mobile-friendly display
 * promoting the FAQ page for new brand starters.
 * 
 * Text: "Starting strong begins here: FAQ – Start Your Brand"
 * Link: /faq-starting-a-gel-polish-brand
 * Link color: #A3005A (fuchsia brand)
 */
export default function StartHereBanner() {
  return (
    <section
      className="w-full py-3 sm:py-4 px-4 sm:px-6 text-center"
      role="note"
      aria-label="Start your brand banner"
    >
      <p className="text-sm sm:text-base text-gray-700 font-light">
        Starting strong begins here:{' '}
        <Link
          to="/faq-starting-a-gel-polish-brand"
          className="font-semibold text-brandFuchsia hover:underline focus:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brandFuchsia focus-visible:ring-offset-2 transition-all"
        >
          FAQ – Start Your Brand
        </Link>
      </p>
    </section>
  );
}
