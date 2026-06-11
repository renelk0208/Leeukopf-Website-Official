import { Link } from 'react-router-dom';
import PageTemplate from '../../components/PageTemplate';
import ApplicationCuring from '../../components/ApplicationCuring';
import ProductSEO from '../../components/ProductSEO';
import { isSubcategoryEnabled } from '../../config/productCategories';
import { categoryHero } from '../../config/imageMap';

export default function BuilderAndStructureGelsPage() {
  const subcategories = [
    {
      key: 'threeInOne',
      title: '3-in-1 Builder Gels',
      path: '/products/builder-and-structure-gels/3-in-1',
      description: 'One product to build, shape and finish — all safely HEMA-free and TPO-free.',
      image: categoryHero['three-in-one-builder'],
    },
    {
      key: 'threePhase',
      title: '3-Phase Builder Gels',
      path: '/products/builder-and-structure-gels/3-phase',
      description: 'A classic three-step system for controlled strength and precision, made without HEMA or TPO.',
      image: categoryHero['three-phase-builder'],
    },
    {
      key: 'biabBuilderInABottle',
      title: 'BIAB (Builder in a Bottle)',
      path: '/products/builder-and-structure-gels/biab-builder-in-a-bottle',
      description: 'Convenient brush-on building system for quick overlays and natural nail reinforcement — HEMA-free and TPO-free.',
      image: categoryHero['brush-on-builder'],
    },
    {
      key: 'premiumFiberGlass',
      title: 'Fibreglass Builder Gels',
      path: '/products/builder-and-structure-gels/premium-fiber-glass',
      description: 'Reinforced flexibility and superior strength in a premium formula that stays fully HEMA-free and TPO-free.',
      image: categoryHero['premium-builder-gels'],
    },
    {
      key: 'liquidPolygel',
      title: 'Liquid Polygel',
      path: '/products/liquid-polygel',
      description: 'Revolutionary liquid formula for effortless application and superior control — HEMA-free and TPO-free.',
      image: categoryHero['liquid-polygel'],
    },
    {
      key: 'noHeatSpikeBuilderGel',
      title: 'No Heat Spike Builder Gel',
      path: '/products/builder-and-structure-gels/no-heat-spike-builder-gel',
      description: 'Advanced formula that minimizes heat generation during curing — HEMA-free and TPO-free.',
      image: categoryHero['no-heat-spike-builder-gel'],
    },
    {
      key: 'polygelAcrygel',
      title: 'Polygel / AcryGel',
      path: '/products/polygel-acrygel',
      description: 'Lightweight, flexible hybrid gels — fully HEMA-free and TPO-free.',
      image: categoryHero['polygel-acrygel'],
    },
    {
      key: 'thixotropicGel',
      title: 'Thixotropic Gel',
      path: '/products/builder-and-structure-gels/thixotropic-gel',
      description: 'Advanced thixotropic formula for maximum control and effortless application — HEMA-free and TPO-free.',
      image: categoryHero['thixotropic-gel'],
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
