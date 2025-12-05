import PageTemplate from '../../components/PageTemplate';
import ProductSEO from '../../components/ProductSEO';
import NailArtGallery from '../../components/NailArtGallery';

export default function NailArtPage() {
  return (
    <PageTemplate
      title="Nail Art"
      subtitle="Speciality products for creative nail art and advanced services."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Nail Art' }
      ]}
    >
      {/* Hero Section */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src="/img/products/nail-art/nail-art-category.jpg"
            alt="Nail Art Products"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        {/* Hero Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Creative products designed for nail artists who want to push boundaries and offer unique services. 
            From specialty gels to effect products, all formulated for professional application and long-lasting results.
          </p>
        </div>
      </div>

      {/* Product Gallery */}
      <NailArtGallery />

      {/* Product Categories */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Creative Product Range
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Glitter Gels</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              High-density glitter gels in multiple sizes and colors. From fine shimmer to chunky holographic 
              effects, all HEMA-free and TPO-free.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Fine, medium and chunky glitter options</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Holographic and iridescent effects</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Easy application and removal</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cat Eye Magnetic Gels</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Magnetic gel polishes that create stunning 3D cat eye effects. Multiple color options with 
              varying magnetic particle densities for different effects.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>3D depth and dimension</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Works with standard nail magnets</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Multiple color families</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Chrome & Mirror Powders</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Ultra-fine pigment powders that create mirror-like finishes over gel color. Available in 
              chrome, holographic and color-shift varieties.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>True mirror finish</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Easy application with applicator</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Multiple color options</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Art Gels & Painting Gels</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Highly pigmented gels designed for detailed nail art work. Perfect consistency for fine lines, 
              patterns and intricate designs.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>High pigment concentration</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Perfect viscosity for fine detail</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Opaque coverage in one stroke</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Stamping Gels & Polishes</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Specialty formulas optimized for stamping nail art. Highly pigmented with perfect consistency 
              for crisp pattern transfer.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Optimized for stamping techniques</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Crisp, clear pattern transfer</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Multiple color options</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Foils & Transfer Products</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Foil adhesive gels and transfer products for applying decorative foils and metallic effects 
              to gel nails.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Strong adhesion for foils</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Compatible with standard nail foils</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Clear or tinted options</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Application Tips */}
      <div className="bg-gray-50 rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Application Guidelines
        </h2>
        <ul className="space-y-3 text-gray-600 font-light text-sm sm:text-base">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>All gel-based art products cure under LED or UV lamps (follow standard cure times)</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Chrome and mirror powders apply over cured non-wipe top coat</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Seal all nail art with compatible top coat for optimal longevity</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Use proper nail art brushes and tools for best results</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>All gel art products are HEMA-free and TPO-free</span>
          </li>
        </ul>
      </div>

      {/* SEO Content */}
      <ProductSEO category="nail-art" />
    </PageTemplate>
  );
}
