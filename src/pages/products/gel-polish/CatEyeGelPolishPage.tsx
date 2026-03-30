import PageTemplate from '../../../components/PageTemplate';
import ProductSEO from '../../../components/ProductSEO';

const CAT_EYE_IMAGES = [
  { src: '/img/products/gel_polishes/Cat Eye Collection/leeukop-cat-eye-collection (3).jpg', alt: 'Cat eye gel polish collection – magnetic effect shades' },
  { src: '/img/products/gel_polishes/Cat Eye Collection/leeukop-cat-eye-collection (6).jpg', alt: 'Cat eye gel polish – vibrant magnetic colour range' },
  { src: '/img/products/gel_polishes/Cat Eye Collection/leeukop-cat-eye-collection (7).jpg', alt: 'Cat eye gel polish – linear and scattered light effects' },
  { src: '/img/products/gel_polishes/Cat Eye Collection/leeukop-cat-eye-collection (8).jpg', alt: 'Private label cat eye gel polish – deep tones' },
  { src: '/img/products/gel_polishes/Cat Eye Collection/leeukop-cat-eye-collection (10).jpg', alt: 'Cat eye gel polish colour swatches on nail tips' },
  { src: '/img/products/gel_polishes/Cat Eye Collection/leeukop-cat-eye-collection (11).jpg', alt: 'Cat eye gel polish – pearl and shimmer magnetic finish' },
  { src: '/img/products/gel_polishes/Cat Eye Collection/leeukop-cat-eye-collection (12).jpg', alt: 'Cat eye gel polish application on natural nails' },
  { src: '/img/products/gel_polishes/Cat Eye Collection/leeukop-cat-eye-collection (13).jpg', alt: 'Cat eye gel polish – rich pigmentation and cat eye stripe' },
  { src: '/img/products/gel_polishes/Cat Eye Collection/leeukop-cat-eye-collection (14).jpg', alt: 'Cat eye gel polish collection overview' },
];

export default function CatEyeGelPolishPage() {
  return (
    <PageTemplate
      title="Cat Eye Gel Polish"
      subtitle="Magnetic cat eye gel polish creating stunning linear and scattered light effects. HEMA-free and TPO-free formulas for private label."
      seoTitle="Private Label Cat Eye Gel Polish Manufacturer – Magnetic Effect | Leeukopf"
      seoDescription="Manufacture your own cat eye gel polish. Magnetic effect formulas in 40+ shades, HEMA-free and TPO-free. GMP-certified EU factory, full CPNP documentation, low MOQ."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Gel Polish', path: '/products/gel-polish' },
        { label: 'Cat Eye Gel Polish' }
      ]}
    >
      {/* Hero Image */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src="/img/products/gel_polishes/Cat Eye Collection/cat-eye_categoty_card-image.png"
            alt="Cat Eye Gel Polish Collection – magnetic stripe effect nail polish by Leeukopf"
            width="1600"
            height="400"
            className="category-hero"
          />
        </div>

        {/* Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
            Magnetic Cat Eye Gel Polish
          </h2>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Our cat eye gel polish collection uses magnetic pigments to create the signature linear or scattered
            cat eye stripe effect. When a magnet is held over the freshly applied gel before curing, the pigment
            particles align to produce a striking, three-dimensional light effect that shifts with viewing angle.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Available in over 40 shades spanning deep jewel tones, pastels, and duochrome finishes. All formulas
            are HEMA-free and TPO-free, supporting brands who want to meet modern market expectations without
            compromising on performance or pigmentation.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Produced under GMP-certified conditions in our EU facility, with complete batch documentation and
            CPNP regulatory support for European market placement. Available for private label with flexible
            MOQs, custom shade development, and full labelling assistance.
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            { title: 'Magnetic Effect', description: 'Distinctive cat eye stripe effect activated with a standard magnet. Linear and scattered patterns available.' },
            { title: 'HEMA-Free & TPO-Free', description: 'All formulas produced without HEMA or TPO for a cleaner, modern formulation.' },
            { title: '40+ Shades', description: 'Deep jewel tones, pastels, and duochrome options to support seasonal collections and year-round ranges.' },
            { title: 'GMP-Certified Production', description: 'Manufactured under GMP conditions in our EU facility with full batch traceability and quality control.' },
            { title: 'CPNP Documentation', description: 'Full regulatory support for CPNP notification and European market placement.' },
            { title: 'Flexible MOQ', description: 'Low minimum order quantities to support new and growing brands at every stage.' },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 font-light text-sm sm:text-base leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Gallery */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          Cat Eye Collection Gallery
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {CAT_EYE_IMAGES.map((image, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="aspect-square">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading={index < 3 ? 'eager' : 'lazy'}
                  width="400"
                  height="400"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO content block */}
      <ProductSEO category="gel-polish" />
    </PageTemplate>
  );
}
