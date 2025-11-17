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
}

export default function PageTemplate({
  title,
  subtitle,
  breadcrumbs,
  children,
  showCTA = false,
  ctaText = 'Get in Touch',
  ctaLink,
  ctaAction
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

  return (
    <>
      <ScrollToTop />
      <Navigation />
      <div className="min-h-screen pt-16">
      <div className="bg-white/80 backdrop-blur-sm py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <BackButton />
          </div>
          <nav className="flex items-center space-x-2 text-sm mb-6">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <ChevronRight size={16} className="mx-2 text-gray-400" />}
                {item.path ? (
                  <Link
                    to={item.path}
                    className="text-gray-600 hover:text-blue-800 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{item.label}</span>
                )}
              </div>
            ))}
          </nav>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl font-light">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}

        {showCTA && (
          <div className="mt-16 text-center">
            <div className="inline-block p-8 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
              <p className="text-gray-700 mb-6 text-lg">
                Interested in learning more?
              </p>
              <button
                onClick={handleCTA}
                className="btn-primary px-8 py-3"
              >
                {ctaText}
              </button>
            </div>
          </div>
        )}
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-blue-800 hover:bg-blue-900 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
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
        <ImageIcon size={48} className="mx-auto text-gray-300 group-hover:text-[#1E90FF] transition-colors" />
        <p className="text-sm text-gray-400 mt-2">{alt}</p>
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
