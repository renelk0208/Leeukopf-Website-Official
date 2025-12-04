import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import PageTemplate from '../components/PageTemplate';
import StartHereBanner from '../components/StartHereBanner';
import { isCategoryEnabled } from '../config/productCategories';

export default function ProductsPage() {
  // Product range sections with their English content
  const productRanges = [
    {
      key: 'gelPolish',
      title: 'Gel Polish Systems',
      text: 'High-pigment, self-levelling UV/LED gel polishes with a smooth application and consistent coverage. Available in hundreds of shades, from classic nudes to bold fashion colours, as well as glitters and speciality effects.',
      bullets: [
        'HEMA- and TPO-free options available',
        'Salon-tested wear and easy soak-off',
        'Compatible base and top systems for optimal adhesion and shine'
      ]
    },
    {
      key: 'builderGels',
      title: 'Builder & Structure Gels',
      text: 'Builder, cover and strengthening gels designed for overlays, extensions and structured manicures. Formulated for control, durability and a comfortable wear for the client.',
      bullets: [
        'Various viscosities for different techniques',
        'Cover tones, clear and milky shades',
        'Suitable for natural nail strengthening and extensions'
      ]
    },
    {
      key: 'basesTops',
      title: 'Bases, Tops & Primers',
      text: 'Adhesion-optimised bases, flexible rubber bases, gloss and matte top coats, and supportive primers designed to work seamlessly with our gel systems.',
      bullets: [
        'Rubber, strengthening and specialised bases',
        'Glossy, matte and special-effect tops',
        'Acid-free primers to support adhesion'
      ]
    },
    {
      key: 'specialty',
      title: 'Speciality Gels & Effects',
      text: 'A selection of speciality products for nail art and advanced services, designed for brands that want to offer something more than a standard colour chart.',
      bullets: [
        'Glitter, shimmer and cat-eye gels',
        'Pastel and neon collections',
        'Special effect top coats and art gels'
      ]
    },
    {
      key: 'care',
      title: 'Supporting Products & Nail Care',
      text: 'Complementary liquids and treatments to complete your system and help professionals work efficiently and safely.',
      bullets: [
        'Cleanser and remover liquids',
        'Cuticle oils and nail care support products',
        'Accessories available on request'
      ]
    },
  ];

  return (
    <PageTemplate
      title="Professional UV/LED gel systems for modern nail brands"
      subtitle="From high-performance gel polishes to advanced builder systems, we manufacture complete product lines you can rely on."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products' }
      ]}
      showCTA={true}
      ctaText="Explore product ranges"
      heroImage="/img/hero/our-products-hero (2).jpg"
    >
      {/* Start Your Brand Banner */}
      <StartHereBanner />

      {/* Hero CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 sm:mb-12 md:mb-16">
        <Link
          to="/products/gel-polish"
          className="btn-primary px-6 py-3 rounded-lg font-semibold text-center"
        >
          Explore product ranges
        </Link>
        <Link
          to="/private-label"
          className="btn-secondary px-6 py-3 rounded-lg font-semibold text-center"
        >
          Private label options
        </Link>
      </div>

      {/* Intro Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 relative inline-block">
          Complete systems, not just single products
          <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-primary" aria-hidden="true"></span>
        </h2>
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base max-w-3xl">
          We don't simply fill bottles. We design full, compatible systems – gel polishes, bases, tops, builders and accessories – that work together for long-lasting, salon-proof results.
        </p>
      </div>

      {/* Product Categories Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          Explore our product categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Gel Polish */}
          {isCategoryEnabled('gelPolish') && (
            <Link
              to="/products/gel-polish"
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                <img
                  src="/img/products/gel_polish_category_1.jpg"
                  alt="Gel Polish"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gel Polish
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  High-pigment, self-levelling UV/LED gel polishes with HEMA-free and TPO-free options
                </p>
              </div>
            </Link>
          )}

          {/* Builder & Structure Gels */}
          {isCategoryEnabled('builderAndStructureGels') && (
            <Link
              to="/products/builder-and-structure-gels"
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                <img
                  src="/img/products/builder_gels_category_2.jpg"
                  alt="Builder & Structure Gels"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Builder & Structure Gels
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Strengthening systems for shaping, extending and reinforcing — HEMA-free and TPO-free
                </p>
              </div>
            </Link>
          )}

          {/* Top & Bases */}
          {isCategoryEnabled('topAndBases') && (
            <Link
              to="/products/top-and-bases"
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                <img
                  src="/img/products/tops-bases_category_1.jpg"
                  alt="Top & Bases"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Top & Bases
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Essential prep and finishing formulas — all safely HEMA-free and TPO-free
                </p>
              </div>
            </Link>
          )}

          {/* Polygel / AcryGel */}
          {isCategoryEnabled('polygelAcrygel') && (
            <Link
              to="/products/polygel-acrygel"
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                <img
                  src="/img/products/acrygel_category_1.jpg"
                  alt="Polygel / AcryGel"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Polygel / AcryGel
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Lightweight, flexible hybrid gels — fully HEMA-free and TPO-free
                </p>
              </div>
            </Link>
          )}

          {/* Acrylic Systems */}
          {isCategoryEnabled('acrylicSystems') && (
            <Link
              to="/products/acrylic-systems"
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
                  <div className="text-center p-4">
                    <p className="text-lg font-semibold text-gray-700">Acrylic Systems</p>
                    <p className="text-sm text-gray-500 mt-2">High-performance powders & liquids</p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Acrylic Systems
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  High-performance powders and liquids — always free from HEMA and TPO
                </p>
              </div>
            </Link>
          )}

          {/* Liquids & Solutions */}
          {isCategoryEnabled('liquidsAndSolutions') && (
            <Link
              to="/products/liquids-and-solutions"
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                  <div className="text-center p-4">
                    <p className="text-lg font-semibold text-gray-700">Liquids & Solutions</p>
                    <p className="text-sm text-gray-500 mt-2">Cleanser and prep solutions</p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Liquids & Solutions
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Professional prep, cleanse and removal solutions
                </p>
              </div>
            </Link>
          )}

          {/* Nail Art */}
          {isCategoryEnabled('nailArt') && (
            <Link
              to="/products/nail-art"
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                <img
                  src="/img/products/nail-art-category.jpg"
                  alt="Nail Art"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nail Art
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Speciality products for nail art and advanced creative services
                </p>
              </div>
            </Link>
          )}

          {/* Accessories */}
          {isCategoryEnabled('accessories') && (
            <Link
              to="/products/accessories"
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100">
                  <div className="text-center p-4">
                    <p className="text-lg font-semibold text-gray-700">Accessories</p>
                    <p className="text-sm text-gray-500 mt-2">Professional tools & supplies</p>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Accessories
                </h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Essential accessories to complete your professional setup
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Product Ranges Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          Our product ranges
        </h2>
        <div className="space-y-8">
          {productRanges.map((range) => (
            <div
              key={range.key}
              className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                {range.title}
              </h3>
              <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
                {range.text}
              </p>
              <ul className="space-y-2">
                {range.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Manufacturing Section */}
      <div className="bg-gray-50 rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Manufacturing with consistency in mind
        </h2>
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
          Every batch is produced under controlled conditions in our European facility, with documented processes and traceability. Our goal is simple: the shade you love today should look and behave the same tomorrow, and next year.
        </p>
        <ul className="space-y-2">
          {['Batch-to-batch consistency checks', 'Colour control procedures', 'Full documentation available for private label partners'].map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Compliance Section */}
      <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Compliance, safety and documentation
        </h2>
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-4">
          All products are developed and manufactured in line with EU Cosmetic Regulation (EC) 1223/2009. For private label clients, we support the documentation required for placing products on the European market.
        </p>
        <ul className="space-y-2">
          {['PIF and CPNP support for private label projects', 'GMP-compliant production environment', 'Formulas designed with long-term regulatory trends in mind'].map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50 rounded-lg p-5 sm:p-6 md:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
          Looking for a custom range?
        </h2>
        <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base mb-6 max-w-2xl mx-auto">
          Whether you need a compact core range or an extended colour library, we can adapt our systems to your brand and target market.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contact"
            className="btn-primary px-6 py-3 rounded-lg font-semibold"
          >
            Discuss product selection
          </Link>
          <Link
            to="/private-label"
            className="btn-secondary px-6 py-3 rounded-lg font-semibold"
          >
            Learn about private label
          </Link>
        </div>
      </div>
    </PageTemplate>
  );
}
