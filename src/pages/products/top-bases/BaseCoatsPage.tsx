import { Link } from 'react-router-dom';
import PageTemplate from '../../../components/PageTemplate';
import ApplicationCuring from '../../../components/ApplicationCuring';
import { isSubcategoryEnabled } from '../../../config/productCategories';

export default function BaseCoatsPage() {
  const subcategories = [
    {
      key: 'classic',
      title: 'Classic',
      path: '/products/top-and-bases/base-coats/classic',
      description: 'A smooth, dependable base for any system — always HEMA-free and TPO-free.',
    },
    {
      key: 'rubberBase',
      title: 'Rubber Base',
      path: '/products/top-and-bases/base-coats/rubber-base',
      description: 'Flexible, self-levelling bases ideal for natural nail reinforcement, free from HEMA and TPO.',
    },
    {
      key: 'superiorBase',
      title: 'Superior Base (5-in-1)',
      path: '/products/top-and-bases/base-coats/superior-base-5-in-1',
      description: 'A multifunction base that primes, levels, strengthens and perfects — HEMA-free and TPO-free.',
    },
  ].filter(sub => isSubcategoryEnabled('baseCoats', sub.key));

  return (
    <PageTemplate
      title="Base Coats"
      subtitle="Reliable adhesion and a smooth foundation, all HEMA-free and TPO-free."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Top & Bases', path: '/products/top-and-bases' },
        { label: 'Base Coats' }
      ]}
    >
      {/* Hero Description */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Professional base coats engineered for optimal adhesion, smooth application and enhanced wear time. 
            From classic foundations to flexible rubber bases and multi-function systems, all formulated without 
            HEMA or TPO for safer salon use.
          </p>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          Choose Your Base System
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.path}
              to={subcategory.path}
              className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                {subcategory.title}
              </h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                {subcategory.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Application & Curing */}
      <ApplicationCuring type="base-coats" />
    </PageTemplate>
  );
}
