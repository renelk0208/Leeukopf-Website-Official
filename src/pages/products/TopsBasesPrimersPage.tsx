import { Link } from 'react-router-dom';
import PageTemplate from '../../components/PageTemplate';

export default function TopsBasesPrimersPage() {
  const categories = [
    {
      title: 'Tops',
      description: 'Professional top coats including wipe-off, non-wipe, matt finish, and special effects formulations.',
      path: '/products/tops-bases-primers/tops'
    },
    {
      title: 'Bases',
      description: 'Foundation systems including classic base, 5-in-1 superior base, builder in a bottle, and flexible base options.',
      path: '/products/tops-bases-primers/bases'
    },
    {
      title: 'Primers',
      description: 'Professional nail preparation products for optimal adhesion and extended wear.',
      path: '/products/tops-bases-primers/primers'
    }
  ];

  return (
    <PageTemplate
      title="Tops, Bases & Primers"
      subtitle="Complete foundation and finishing systems for perfect gel polish application and extended wear."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Tops, Bases & Primers' }
      ]}
      showCTA={true}
    >
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Complete System Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 border border-gray-200"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-600 font-light">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why Use a Complete System</h2>
        <p className="text-gray-600 font-light leading-relaxed mb-6">
          Our tops, bases, and primers work synergistically to provide optimal adhesion, protection, and longevity. Each product is formulated to complement the others, creating a complete nail care ecosystem that delivers professional results every time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Enhanced Adhesion</h3>
            <p className="text-gray-600 font-light text-sm">Primers and bases create the perfect foundation for color application and extended wear.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Extended Durability</h3>
            <p className="text-gray-600 font-light text-sm">Top coats seal and protect, preventing chips and maintaining glossy shine for weeks.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Nail Health</h3>
            <p className="text-gray-600 font-light text-sm">Flexible formulas move with the natural nail, reducing stress and preventing breakage.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Professional Results</h3>
            <p className="text-gray-600 font-light text-sm">Consistent performance across the entire system for salon-quality manicures.</p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
