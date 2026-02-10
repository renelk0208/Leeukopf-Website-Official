import { Link } from 'react-router-dom';
import PageTemplate from '../../../components/PageTemplate';
import ApplicationCuring from '../../../components/ApplicationCuring';
import TopCoatComparisonChart from '../../../components/TopCoatComparisonChart';
import { isSubcategoryEnabled } from '../../../config/productCategories';
import { categoryHero } from '../../../config/imageMap';

export default function TopCoatsPage() {
  const subcategories = [
    {
      key: 'effects',
      title: 'Effects',
      path: '/products/top-and-bases/top-coats/effects',
      description: 'Finishes with texture, shimmer or visual accents, formulated without HEMA and TPO.',
      image: categoryHero['effects-top-coats'],
    },
    {
      key: 'standard',
      title: 'Standard',
      path: '/products/top-and-bases/top-coats/standard',
      description: 'Classic high-shine finishes that seal and protect — fully HEMA-free and TPO-free.',
      image: categoryHero['standard-top-coats'],
    },
  ].filter(sub => isSubcategoryEnabled('topCoats', sub.key));

  return (
    <PageTemplate
      title="Top Coats"
      subtitle="Smooth, durable finishes that protect colour — all HEMA-free and TPO-free."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Top & Bases', path: '/products/top-and-bases' },
        { label: 'Top Coats' }
      ]}
    >
      {/* Hero Description */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Professional top coats designed to seal, protect and enhance gel polish services. From high-gloss 
            standard finishes to specialty effect coats, all formulated without HEMA or TPO for safer salon use.
          </p>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          Choose Your Finish
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.path}
              to={subcategory.path}
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                <img
                  src={subcategory.image}
                  alt={subcategory.title}
                  width="1600"
                  height="1200"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {subcategory.title}
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  {subcategory.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Coat Comparison Chart */}
      <TopCoatComparisonChart />

      {/* Application & Curing */}
      <ApplicationCuring type="top-coats" />
    </PageTemplate>
  );
}
