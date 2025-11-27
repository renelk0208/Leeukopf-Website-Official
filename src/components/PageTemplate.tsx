import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Image as ImageIcon, ArrowUp } from 'lucide-react';
import Navigation from './Navigation';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import BackButton from './BackButton';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageTemplateProps {
  title: string;
  subtitle: string;
  breadcrumbs: BreadcrumbItem[];
  children?: ReactNode;
  showCTA?: boolean;
  ctaText?: string;
  ctaLink?: string;
  ctaAction?: () => void;
  heroImage?: string;
}

export default function PageTemplate({
  title,
  subtitle,
  breadcrumbs,
  children,
  showCTA = false,
  ctaText = 'Get in Touch',
  ctaLink,
  ctaAction,
  heroImage
}: PageTemplateProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTA = () => {
    if (ctaAction) {
      ctaAction();
    } else if (ctaLink) {
      window.location.href = ctaLink;
    } else {
      window.location.href = '/contact';
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validate heroImage URL to prevent XSS - only allow safe image path characters
  const isValidImagePath = (url: string): boolean => {
    // Only allow relative paths with safe characters (alphanumeric, slashes, dots, dashes, underscores, spaces)
    return /^\/[a-zA-Z0-9/_\-. ]+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const safeHeroImage = heroImage && isValidImagePath(heroImage) ? heroImage : undefined;

  return (
    <>
      <ScrollToTop />
      <Navigation />
      <div className="min-h-screen pt-16">
      {/* Responsive header section - with optional hero background image */}
      <div 
        className={`py-8 sm:py-10 md:py-12 border-b border-gray-200 ${
          safeHeroImage 
            ? 'relative bg-cover bg-center bg-no-repeat' 
            : 'bg-white/80 backdrop-blur-sm'
        }`}
        style={safeHeroImage ? { backgroundImage: `url(${safeHeroImage})` } : undefined}
      >
        {safeHeroImage && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
        )}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${safeHeroImage ? 'relative z-10' : ''}`}>
          <div className="mb-4 sm:mb-6">
            <BackButton />
          </div>
          {/* Responsive breadcrumbs - wrap on small screens */}
          <nav className="flex flex-wrap items-center gap-1 text-xs sm:text-sm mb-4 sm:mb-6" aria-label="Breadcrumb">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <ChevronRight size={14} className="mx-1 sm:mx-2 text-gray-400 flex-shrink-0" aria-hidden="true" />}
                {item.path ? (
                  <Link
                    to={item.path}
                    className="text-gray-600 hover:text-blue-800 transition-colors min-h-[44px] inline-flex items-center"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{item.label}</span>
                )}
              </div>
            ))}
          </nav>

          {/* Responsive title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl font-light">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Responsive content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        {children}

        {showCTA && (
          <div className="mt-10 sm:mt-12 md:mt-16 text-center">
            <div className="inline-block p-5 sm:p-6 md:p-8 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm max-w-md mx-auto">
              <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg">
                Interested in learning more?
              </p>
              <button
                onClick={handleCTA}
                className="btn-primary w-full sm:w-auto px-6 sm:px-8 py-3 min-h-[44px]"
              >
                {ctaText}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to top button - accessible size */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-40 w-11 h-11 sm:w-12 sm:h-12 bg-blue-800 hover:bg-blue-900 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 min-w-[44px] min-h-[44px]"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} aria-hidden="true" />
        </button>
      )}
    </div>
    <Footer />
    </>
  );
}

export function ImagePlaceholder({ alt = 'Product image' }: { alt?: string }) {
  return (
    <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center group hover:border-[#1E90FF] transition-colors">
      <div className="text-center">
        <ImageIcon size={48} className="mx-auto text-gray-400 group-hover:text-[#1E90FF] transition-colors" aria-hidden="true" />
        <p className="text-sm text-gray-600 mt-2">{alt}</p>
      </div>
    </div>
  );
}

export function ContentCard({ title, description, to }: { title: string; description: string; to: string }) {
  return (
    <Link
      to={to}
      className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-[#1E90FF] hover:shadow-lg transition-all duration-300"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#1E90FF]">
        {title}
      </h3>
      <p className="text-gray-600 font-light">
        {description}
      </p>
    </Link>
  );
}
