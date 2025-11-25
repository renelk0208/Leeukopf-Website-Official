import { Link } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';

export default function ProductsPage() {
  const categories = [
    {
      title: 'Gel Polish',
      description: 'Professional gel polish systems including French Collection, Solid Colours, Glitters, and complete Tops, Bases & Primers range.',
      path: '/products/gel-polish',
      image: '/img/products/gel_polish_category_1.jpg'
    },
    {
      title: 'Builder Systems',
      description: 'Advanced builder gels including 3-in-1 systems, fibreglass reinforcement, acrylics, and innovative polygel formulations.',
      path: '/products/builder-systems',
      image: '/img/products/builder_gels_category_2.jpg'
    },
    {
      title: 'Tops, Bases & Primers',
      description: 'Complete foundation and finishing systems including wipe-off and non-wipe tops, superior bases, and professional primers.',
      path: '/products/tops-bases-primers',
      image: '/img/products/tops & bases_category_1.jpg'
    }
  ];

  return (
    <PageTemplate
      title="Our Products"
      subtitle="Professional nail care systems designed for perfection. From gel polish to builder systems, explore our complete range."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products' }
      ]}
      showCTA={true}
      ctaText="Request Product Catalogue"
    >
      {/* Responsive product category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16">
        {categories.map((category) => (
          <Link
            key={category.path}
            to={category.path}
            className="group block p-4 sm:p-6 md:p-8 bg-white rounded-lg border border-gray-200 hover:border-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 sm:mb-6 border border-gray-200 group-hover:border-blue-500 transition-colors overflow-hidden flex items-center justify-center">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : null}
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-800 transition-colors">
              {category.title}
            </h3>
            <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">
              {category.description}
            </p>
            <div className="mt-3 sm:mt-4 text-blue-800 font-semibold group-hover:text-blue-900 text-sm sm:text-base">
              Explore Collection →
            </div>
          </Link>
        ))}
      </div>

      {/* Responsive features section */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">Why Our Products Stand Out</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💎</div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Premium Quality</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-light">Formulated with the finest ingredients for exceptional performance and durability.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎨</div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Extensive Range</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-light">From classic shades to trendy colors, we offer complete product ecosystems.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Professional Grade</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-light">Trusted by nail technicians worldwide for salon-quality results.</p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
