import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Image as ImageIcon } from 'lucide-react';

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
  ctaAction?: () => void;
}

export default function PageTemplate({
  title,
  subtitle,
  breadcrumbs,
  children,
  showCTA = false,
  ctaText = 'Get in Touch',
  ctaAction
}: PageTemplateProps) {
  const handleCTA = () => {
    if (ctaAction) {
      ctaAction();
    } else {
      window.location.href = '/contact';
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="bg-gradient-to-br from-white via-gray-50 to-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm mb-6">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <ChevronRight size={16} className="mx-2 text-gray-400" />}
                {item.path ? (
                  <Link
                    to={item.path}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
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
          <p className="text-xl text-gray-600 max-w-3xl font-light">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}

        {showCTA && (
          <div className="mt-16 text-center">
            <div className="inline-block p-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700 mb-6 text-lg">
                Interested in learning more?
              </p>
              <button
                onClick={handleCTA}
                className="px-8 py-3 bg-gray-900 text-white rounded-md font-semibold hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {ctaText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ImagePlaceholder({ alt = 'Product image' }: { alt?: string }) {
  return (
    <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center group hover:border-primary-300 transition-colors">
      <div className="text-center">
        <ImageIcon size={48} className="mx-auto text-gray-300 group-hover:text-primary-400 transition-colors" />
        <p className="text-sm text-gray-400 mt-2">{alt}</p>
      </div>
    </div>
  );
}

export function ContentCard({ title, description, to }: { title: string; description: string; to: string }) {
  return (
    <Link
      to={to}
      className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
        {title}
      </h3>
      <p className="text-gray-600 font-light">
        {description}
      </p>
    </Link>
  );
}
