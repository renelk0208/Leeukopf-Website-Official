import { Link } from 'react-router-dom';
import PageTemplate from '../../components/PageTemplate';

export default function GelPolishPage() {
  const subcategories = [
    {
      title: 'French Collection',
      description: 'Classic French manicure shades in perfect nude, pink, and white tones. Long-lasting formulas for elegant results.',
      path: '/products/gel-polish/french-collection',
      image: '/IMG_9114 copy.JPG'
    },
    {
      title: 'Solid Colours',
      description: 'Vibrant, highly pigmented colors across the spectrum. From bold reds to subtle pastels, find your perfect shade.',
      path: '/products/gel-polish/solid-colours'
    },
    {
      title: 'Glitters',
      description: 'Dazzling glitter formulations for stunning nail art. Fine to chunky glitters in coordinated color families.',
      path: '/products/gel-polish/glitters'
    },
    {
      title: 'Tops, Bases & Primers',
      description: 'Complete foundation and finishing system for perfect gel polish application and extended wear.',
      path: '/products/tops-bases-primers'
    }
  ];

  return (
    <PageTemplate
      title="Gel Polish Collection"
      subtitle="Professional gel polish systems with exceptional shine, durability, and color payoff. Perfect for salon and home use."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Gel Polish' }
      ]}
      showCTA={true}
      ctaText="Request Color Chart"
    >
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Explore Our Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subcategories.map((sub) => (
            <Link
              key={sub.path}
              to={sub.path}
              className="group block p-6 bg-white rounded-lg border border-gray-200 hover:border-primary-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {sub.image ? (
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 border border-gray-200 overflow-hidden">
                  <img src={sub.image} alt={sub.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 border border-gray-200"></div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{sub.title}</h3>
              <p className="text-gray-600 font-light">{sub.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Product Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Long-Lasting Wear</h3>
            <p className="text-gray-600 font-light text-sm">Up to 3 weeks of chip-resistant wear with proper application and base/top coat system.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">High Pigmentation</h3>
            <p className="text-gray-600 font-light text-sm">Rich color payoff with excellent coverage. Many shades achieve full opacity in 1-2 coats.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Application</h3>
            <p className="text-gray-600 font-light text-sm">Self-leveling formula with perfect consistency. Professional results without streaking or patchiness.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">LED/UV Compatible</h3>
            <p className="text-gray-600 font-light text-sm">Cures perfectly under LED and UV lamps. Quick cure times for efficient salon services.</p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
