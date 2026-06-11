import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Search, X } from 'lucide-react';
import PageTemplate from '../components/PageTemplate';
import StartHereBanner from '../components/StartHereBanner';
import ColorCatalogPreview from '../components/ColorCatalogPreview';
import { enabledCategories, isCategoryEnabled } from '../config/productCategories';
import ProductCategoryCard3D from '../components/products/ProductCategoryCard3D';
import { getOurProductsVideoSrc } from '../config/seasonal';

export default function ProductsPage() {
  const videoSrc = getOurProductsVideoSrc();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') ?? '';
  const normalizedQuery = searchQuery.trim().toLowerCase();

  type EnabledCategoryKey = keyof typeof enabledCategories;
  
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

  const productCategoryCards: Array<{
    title: string;
    subtitle: string;
    imageSrc: string;
    href: string;
    alt: string;
    enabledKey: EnabledCategoryKey;
    searchTerms?: string[];
  }> = [
    {
      title: 'Gel Polish',
      subtitle: 'High-pigment, self-levelling UV/LED gel polishes with HEMA-free and TPO-free options',
      imageSrc: '/img/products/gel_polishes/gel_polish_category_category-card-image-1.jpeg',
      href: '/products/gel-polish',
      alt: 'Gel Polish',
      enabledKey: 'gelPolish',
      searchTerms: ['uv', 'led', 'colour', 'color', 'gel polish'],
    },
    {
      title: 'Builder & Structure Gels',
      subtitle: 'Strengthening systems for shaping, extending and reinforcing — HEMA-free and TPO-free',
      imageSrc: '/img/products/builder-systems/Builder Gels/builder_gels_category_2.jpg',
      href: '/products/builder-and-structure-gels',
      alt: 'Builder & Structure Gels',
      enabledKey: 'builderAndStructureGels',
      searchTerms: ['builder gel', 'structure gel', 'biab', 'extension'],
    },
    {
      title: 'Top & Bases',
      subtitle: 'Essential prep and finishing formulas — all safely HEMA-free and TPO-free',
      imageSrc: '/img/products/tops-and-bases/tops/tops-bases_category_1.jpg',
      href: '/products/top-and-bases',
      alt: 'Top & Bases',
      enabledKey: 'topAndBases',
      searchTerms: ['top coat', 'base coat', 'primer'],
    },
    {
      title: 'Polygel / AcryGel',
      subtitle: 'Lightweight, flexible hybrid gels — fully HEMA-free and TPO-free',
      imageSrc: '/img/products/builder-systems/Acrygel-Polygel/webp/acrygel-polygel-category-card-image.webp',
      href: '/products/polygel-acrygel',
      alt: 'Polygel / AcryGel',
      enabledKey: 'polygelAcrygel',
      searchTerms: ['polygel', 'acrygel', 'hybrid gel'],
    },
    {
      title: 'Liquids & Solutions',
      subtitle: 'Professional prep and cleanse solutions',
      imageSrc: '/img/products/liquids-&-solutions/webp/liquids-&-solutions-category-card-image.webp',
      href: '/products/liquids-and-solutions',
      alt: 'Liquids & Solutions',
      enabledKey: 'liquidsAndSolutions',
      searchTerms: ['cleanser', 'prep', 'solution'],
    },
    {
      title: 'Nail Art',
      subtitle: 'Speciality products for nail art and advanced creative services',
      imageSrc: '/img/products/nail-art/Nail Art/nail-art-category-card-imge.png',
      href: '/products/nail-art',
      alt: 'Nail Art',
      enabledKey: 'nailArt',
      searchTerms: ['art', 'effect', 'creative'],
    },
    {
      title: 'UV & LED Lamps',
      subtitle: 'Professional curing lamps for efficient gel polymerization',
      imageSrc: '/img/products/Lamps/lamps_category_card-1.jpg',
      href: '/products/lamps',
      alt: 'UV & LED Lamps',
      enabledKey: 'lamps',
      searchTerms: ['lamp', 'uv', 'led', 'curing'],
    },
  ];

  const enabledCards = productCategoryCards.filter((card) => isCategoryEnabled(card.enabledKey));
  const filteredCategoryCards = !normalizedQuery
    ? enabledCards
    : enabledCards.filter((card) => {
        const searchable = [card.title, card.subtitle, ...(card.searchTerms ?? [])].join(' ').toLowerCase();
        return searchable.includes(normalizedQuery);
      });

  const filteredProductRanges = !normalizedQuery
    ? productRanges
    : productRanges.filter((range) => {
        const searchable = [range.title, range.text, ...range.bullets].join(' ').toLowerCase();
        return searchable.includes(normalizedQuery);
      });

  const updateSearchQuery = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      setSearchParams({ search: trimmedValue }, { replace: true });
      return;
    }

    setSearchParams({}, { replace: true });
  };

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
          <Link
            to="/portal/login"
            className="btn-primary px-6 py-3 rounded-lg font-semibold text-center"
          >
            ORDER NOW ON PORTAL
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

        <ColorCatalogPreview />

        {/* Seasonal Hero Video - BEFORE "Explore our products" section */}
        {videoSrc && (
          <section className="w-full mb-10 sm:mb-12 md:mb-16">
            <div className="relative w-full overflow-hidden rounded-2xl bg-black/5 aspect-[16/9] sm:aspect-[21/9]">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                controls={false}
                disablePictureInPicture
              />
            </div>
          </section>
        )}

        {/* Product Categories Section */}
        <div className="mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
            Explore our product categories
          </h2>

          <div className="mb-6 sm:mb-8 max-w-2xl mx-auto">
            <label htmlFor="products-search" className="sr-only">Search products</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
              <input
                id="products-search"
                type="text"
                value={searchQuery}
                onChange={(event) => updateSearchQuery(event.target.value)}
                placeholder="Search product categories and ranges..."
                className="w-full rounded-lg border border-gray-300 bg-white pl-11 pr-11 py-3 text-sm sm:text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => updateSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCategoryCards.map((card) => (
            <ProductCategoryCard3D
              key={card.href}
              title={card.title}
              subtitle={card.subtitle}
              imageSrc={card.imageSrc}
              href={card.href}
              alt={card.alt}
            />
          ))}

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

        {normalizedQuery && filteredCategoryCards.length === 0 && (
          <p className="text-center text-sm sm:text-base text-gray-500 mt-6">
            No category matches for "{searchQuery.trim()}".
          </p>
        )}
      </div>

      {/* Product Ranges Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          Our product ranges
        </h2>
        <div className="space-y-8">
          {filteredProductRanges.map((range) => (
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

          {normalizedQuery && filteredProductRanges.length === 0 && (
            <p className="text-center text-sm sm:text-base text-gray-500">
              No product range matches for "{searchQuery.trim()}".
            </p>
          )}
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
            to="/client-registration"
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
