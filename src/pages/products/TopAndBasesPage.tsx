import { Link } from 'react-router-dom';
import PageTemplate from '../../components/PageTemplate';
import ProductSEO from '../../components/ProductSEO';
import { categoryHero } from '../../config/imageMap';
import { isSubcategoryEnabled } from '../../config/productCategories';

export default function TopAndBasesPage() {
  const subcategories = [
    {
      key: 'topCoats',
      title: 'Top Coats',
      path: '/products/top-and-bases/top-coats',
      description: 'Smooth, durable finishes that protect colour — all HEMA-free and TPO-free.',
      image: '/img/products/tops-and-bases/tops_&_bases_category_effects.jpg'
    },
    {
      key: 'baseCoats',
      title: 'Base Coats',
      path: '/products/top-and-bases/base-coats',
      description: 'Essential foundation systems for optimal adhesion and wear.',
      image: '/img/products/tops-and-bases/rubber-bases/rubber-base-category-image.jpg'
    },
  ];

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

      {/* Subcategories Grid */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          Choose Your Category
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

      {/* SEO Content */}
      <ProductSEO category="top-bases" />
    </PageTemplate>
  );
}
