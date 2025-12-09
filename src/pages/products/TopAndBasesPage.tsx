import PageTemplate from '../../components/PageTemplate';
import ProductSEO from '../../components/ProductSEO';
import TopsAndBasesGallery from '../../components/TopsAndBasesGallery';
import { categoryHero } from '../../config/imageMap';

export default function TopAndBasesPage() {

  return (
    <PageTemplate
      title="Top & Bases"
      subtitle="Essential prep and finishing formulas that enhance durability and wear, all safely HEMA-free and TPO-free."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Top & Bases' }
      ]}
    >
      {/* Hero Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src={categoryHero['tops-and-bases']}
            alt="Top & Bases"
            width="1600"
            height="400"
            className="category-hero"
          />
        </div>

        {/* Hero Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Essential foundation and finishing systems that secure adhesion, enhance shine and boost the longevity 
            of any gel service. From reliable base coats to protective top coats, each formula is designed to work 
            seamlessly with our gel polish and builder systems.
          </p>
        </div>
      </div>

      {/* Product Gallery */}
      <TopsAndBasesGallery />

      {/* SEO Content */}
      <ProductSEO category="top-bases" />
    </PageTemplate>
  );
}
