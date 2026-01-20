import { useNavigate } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';
import SmartImage from './SmartImage';
import { RESPONSIVE_SIZES } from '../lib/responsive-sizes';

export default function Hero() {
  const navigate = useNavigate();

  // Common styling for category links
  const categoryLinkClass = "group block w-full max-w-xs mx-auto bg-white/90 backdrop-blur-sm rounded-lg px-6 py-6 shadow-md hover:shadow-xl hover:bg-white transition-all duration-300 border-2 border-transparent hover:border-primary";

  return (
    <section id="home" className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Hero background image - optimized for LCP */}
      <SmartImage
        src="/img/hero/home-page-hero.jpg"
        alt="Leeukopf Laboratories Premium Gel Polish"
        width={2000}
        height={848}
        fetchPriority="high"
        lazy={false}
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />
      {/* Responsive padding: more compact on mobile, spacious on desktop */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-8 md:pb-12">
        <div className="space-y-6 md:space-y-8">
          {/* Logo with responsive sizing - marked as high priority for LCP */}
          <div className="flex justify-center mb-6 md:mb-8">
            <OptimizedImage
              src="/leeukopf_black.png"
              alt="Leeukopf Laboratories Logo"
              width={800}
              height={200}
              sizes={RESPONSIVE_SIZES.hero}
              lazy={false}
              fetchPriority="high"
              className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl h-auto object-contain px-4 sm:px-8"
            />
          </div>

          {/* H1 - Main keyword-rich heading for SEO */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight px-2 bg-white/90 rounded-lg py-4 inline-block">
            Launch Your Gel Polish Brand<br />in 6-8 Weeks
          </h1>

          {/* Responsive typography with clamp-like approach */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto leading-relaxed font-medium px-2 bg-white/90 rounded-lg py-3 inline-block">
            2000+ Colors • HEMA-Free • EU Certified • GMP Manufacturing
          </p>

          {/* Responsive button group with full-width on mobile */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-6 px-4 sm:px-0">
            <button
              onClick={() => navigate('/client-registration')}
              className="btn-primary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 min-h-[44px]"
            >
              Book Free Consultation
            </button>
            <button
              onClick={() => navigate('/products/gel-polish')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] bg-white/80 rounded-md font-semibold transition-all duration-300 border-2 text-gray-700 border-gray-300 hover:border-primary hover:text-primary"
            >
              View Our Colors
            </button>
          </div>

          {/* Product Category Links - Text Only */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto pt-8 sm:pt-12 md:pt-16 px-2 sm:px-0">
            <a
              href="/products/gel-polish"
              className={categoryLinkClass}
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                2000+ Colors to choose from
              </h3>
              <p className="text-base sm:text-lg font-semibold text-primary">
                Gel Polish
              </p>
            </a>
            <a
              href="/products/builder-and-structure-gels"
              className={categoryLinkClass}
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                Professional Strength & Durability
              </h3>
              <p className="text-base sm:text-lg font-semibold text-primary">
                Builder Gel Systems
              </p>
            </a>
            <a
              href="/products/nail-art"
              className={categoryLinkClass}
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                Complete Product Range
              </h3>
              <p className="text-base sm:text-lg font-semibold text-primary">
                Nail Art
              </p>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
