import { Link } from 'react-router-dom';
import PageTemplate from '../../components/PageTemplate';
import ApplicationCuring from '../../components/ApplicationCuring';
import ProductSEO from '../../components/ProductSEO';
import { isSubcategoryEnabled } from '../../config/productCategories';
import { categoryHero } from '../../config/imageMap';

export default function BuilderAndStructureGelsPage() {
  const subcategories = [
    {
      key: 'threePhase',
      title: '3-Phase Builder Gels',
      path: '/products/builder-and-structure-gels/3-phase',
      description: 'A classic three-step system for controlled strength and precision, made without HEMA or TPO.',
      image: categoryHero['three-phase-builder'],
    },
    {
      key: 'threeInOne',
      title: '3-in-1 Builder Gels',
      path: '/products/builder-and-structure-gels/3-in-1',
      description: 'One product to build, shape and finish — all safely HEMA-free and TPO-free.',
      image: categoryHero['three-in-one-builder'],
    },
    {
      key: 'premiumFiberGlass',
      title: 'Premium Fiber Glass Builder Gels',
      path: '/products/builder-and-structure-gels/premium-fiber-glass',
      description: 'Reinforced flexibility and superior strength in a premium formula that stays fully HEMA-free and TPO-free.',
      image: categoryHero['premium-builder-gels'],
    },
  ].filter(sub => isSubcategoryEnabled('builderGels', sub.key));

  return (
    <PageTemplate
      title="Builder & Structure Gels"
      subtitle="Strengthening systems made for shaping, extending and reinforcing natural nails, formulated without HEMA or TPO."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Builder & Structure Gels' }
      ]}
    >
      {/* Hero Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src={categoryHero['builder-gels']}
            alt="Builder & Structure Gels"
            width="1600"
            height="400"
            className="category-hero"
          />
        </div>

        {/* Hero Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Advanced strengthening gels engineered for shaping, extending and reinforcing the natural nail. 
            Created for technicians who want control, durability and a smooth, self-levelling finish.
          </p>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          Choose Your System
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Application & Curing */}
      <ApplicationCuring type="builder-gels" />

      {/* SEO Content */}
      <ProductSEO category="builder-gels" />
    </PageTemplate>
  );
}
