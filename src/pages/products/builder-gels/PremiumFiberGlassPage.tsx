import PageTemplate from '../../../components/PageTemplate';
import ProductGrid from '../../../components/ProductGrid';
import { loadBuilderGelImages } from '../../../lib/imageLoaders';

/**
 * Use Vite's import.meta.glob to dynamically load premium fiber glass builder gel images
 */
const imageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/builder-systems/Premium Builder Gels/**/*.jpg',
  { eager: true }
);

const PRODUCT_IMAGES = loadBuilderGelImages(imageModules, {
  globPattern: '/public/img/products/builder-systems/Premium Builder Gels/**/*.jpg',
  altPrefix: 'Fibreglass Builder Gel',
});

export default function PremiumFiberGlassPage() {
  return (
    <PageTemplate
      title="Premium Fibreglass Gel"
      subtitle="Professional Technical Specifications"
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Builder & Structure Gels', path: '/products/builder-and-structure-gels' },
        { label: 'Premium Fibreglass Gel' }
      ]}
    >
      {/* Hero Image */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src="/img/products/builder-systems/Premium Builder Gels/premium-builder-gels-category.jpg"
            alt="Premium Fibreglass Gel"
            width="1600"
            height="400"
            className="category-hero"
          />
        </div>

        {/* Overview */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12 mb-8">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Our fibreglass builder gel system incorporates fine glass fibres for enhanced strength 
            and flexibility. Designed for technicians who work with clients needing extra reinforcement or who 
            want to create thin, natural-looking extensions with superior durability.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            The fibre-reinforced formula provides exceptional resistance to lifting, cracking and breakage, while 
            remaining lightweight and flexible enough to move naturally with the nail. Formulated without HEMA 
            or TPO for a cleaner, safer professional application.
          </p>
        </div>
      </div>

      {/* Product Gallery */}
      {PRODUCT_IMAGES.length > 0 && (
        <div className="mb-10 sm:mb-12 md:mb-16">
          <ProductGrid
            title="Available Products"
            description="Browse our fibreglass builder gel range"
            images={PRODUCT_IMAGES}
            showProductNumbers={true}
          />
        </div>
      )}

      {/* Technical Specifications Download */}
      <div className="mb-10 sm:mb-12 md:mb-16 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg sm:rounded-xl border border-primary/20 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Complete Technical Specifications
            </h3>
            <p className="text-sm sm:text-base text-gray-600 font-light">
              View our comprehensive technical data sheet with detailed performance metrics, structural properties, and application instructions for all Premium Fibreglass Builder Gel ranges.
            </p>
          </div>
          <a
            href="/docs/technical-specs/Premium-Fibreglass-Builder-Gel-Specifications.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View PDF
          </a>
        </div>
      </div>

      {/* TRANSPARENT SERIES */}
      <div className="mb-10 sm:mb-12 md:mb-16 bg-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 border-b border-gray-200 pb-4">
          Premium Fibreglass Gel - Transparent Series
        </h2>
        
        <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-6">
          A precision-engineered, semi-transparent fibreglass builder gel designed to reinforce weak nails, 
          support recovery, and deliver controlled sculpting with a smooth self-levelling finish.
        </p>

        {/* Performance Profile */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Performance Profile</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Curing Time</div>
              <div className="text-gray-600">60 seconds under 48W LED Lamp</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Transparency</div>
              <div className="text-yellow-500 text-xl">★★★★☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Hardness</div>
              <div className="text-yellow-500 text-xl">★★★★★</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Viscosity</div>
              <div className="text-yellow-500 text-xl">★★★☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Flexibility</div>
              <div className="text-yellow-500 text-xl">★☆☆☆☆</div>
            </div>
          </div>
        </div>

        {/* Structural Properties */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Structural Properties</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-1">Thixotropy</div>
              <div className="text-gray-600">Medium</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-1">Exothermic Reaction</div>
              <div className="text-gray-600">Medium</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-1">Adhesion</div>
              <div className="text-gray-600">Medium</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-1">Pinchability</div>
              <div className="text-gray-600">Yes</div>
            </div>
          </div>
        </div>

        {/* Characteristics */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Characteristics</h3>
          <ul className="space-y-2 text-gray-600 font-light text-sm sm:text-base">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Superior long-lasting wear</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Resistant to lifting and breakage</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Ideal for weak, fragile, or recovering nails</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Self-levelling formula for reduced filing</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Medium viscosity for precision control</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Perfect for pinching techniques</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Smooth, effortless application</span>
            </li>
          </ul>
        </div>

        {/* Application */}
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Application</h3>
          <ol className="space-y-3 text-gray-600 font-light text-sm sm:text-base">
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">1.</span>
              <span>Sanitise hands and gently push back cuticles.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">2.</span>
              <span>Remove natural shine with a 180/240 grit file and eliminate dust.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">3.</span>
              <span>Dehydrate the nail plate with Acid Free Bonder and allow to air dry.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">4.</span>
              <span>Apply nail form.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">5.</span>
              <span>Apply a thin layer of base gel and cure for 60 seconds under a 48W LED lamp.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">6.</span>
              <span>Sculpt with Premium Fibreglass Gel and cure.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">7.</span>
              <span>Finish with topcoat and cure for a high-gloss result.</span>
            </li>
          </ol>
        </div>
      </div>

      {/* SEMI-TRANSPARENT RANGE */}
      <div className="mb-10 sm:mb-12 md:mb-16 bg-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 border-b border-gray-200 pb-4">
          Premium Fibreglass Gel - Semi-Transparent Range
        </h2>
        
        <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-6">
          A precision-engineered, semi-transparent fibreglass builder gel designed to reinforce weak nails, 
          support recovery, and deliver controlled sculpting with a smooth self-levelling finish.
        </p>

        {/* Technical Snapshot */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Technical Snapshot</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Cure Time</div>
              <div className="text-gray-600">60 seconds — 48W LED lamp</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Transparency</div>
              <div className="text-yellow-500 text-xl">★★★★☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Hardness</div>
              <div className="text-yellow-500 text-xl">★★★★★</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Viscosity</div>
              <div className="text-yellow-500 text-xl">★★★☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Flexibility</div>
              <div className="text-yellow-500 text-xl">★☆☆☆☆</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-1">Thixotropy</div>
              <div className="text-gray-600">Medium</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-1">Exothermic Reaction</div>
              <div className="text-gray-600">Medium</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-1">Adhesion</div>
              <div className="text-gray-600">Medium</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-1">Pinchability</div>
              <div className="text-gray-600">Yes</div>
            </div>
          </div>
        </div>

        {/* Characteristics */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Characteristics</h3>
          <ul className="space-y-2 text-gray-600 font-light text-sm sm:text-base">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Superior long-lasting wear</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Resistant to lifting and breakage</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Ideal for weak, fragile, or recovering nails</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Self-levelling formula for minimal filing</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Medium texture for controlled application</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Excellent for pinching techniques</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Smooth, effortless application</span>
            </li>
          </ul>
        </div>

        {/* Application */}
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Application</h3>
          <ol className="space-y-3 text-gray-600 font-light text-sm sm:text-base">
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">1.</span>
              <span>Sanitise hands and gently push back cuticles.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">2.</span>
              <span>Remove natural shine with a 180/240 grit file, then remove dust.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">3.</span>
              <span>Apply Acid Free Bonder to the natural nail and allow to air dry completely.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">4.</span>
              <span>Apply nail form.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">5.</span>
              <span>Apply a thin layer of base gel and cure 60 seconds under a 48W LED lamp.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">6.</span>
              <span>Apply Premium Fibreglass Gel, sculpt to the preferred shape, and cure 60 seconds under a 48W LED lamp.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">7.</span>
              <span>Finish with topcoat for long-lasting shine and cure under the lamp.</span>
            </li>
          </ol>
        </div>
      </div>

      {/* WHITE RANGE */}
      <div className="mb-10 sm:mb-12 md:mb-16 bg-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 border-b border-gray-200 pb-4">
          Premium Fibreglass Gel - White Range
        </h2>
        
        <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-6">
          A high-performance white fibreglass builder gel engineered for structure, brightness, and precision 
          control — ideal for sculpting, reinforcement, and advanced salon techniques.
        </p>

        {/* Technical Snapshot */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Technical Snapshot</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Cure Time</div>
              <div className="text-gray-600">90 seconds — 48W LED lamp</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Transparency</div>
              <div className="space-y-1">
                <div className="text-sm text-gray-600">White, Extra White, Extreme White:</div>
                <div className="text-yellow-500 text-xl">★☆☆☆☆</div>
                <div className="text-sm text-gray-600 mt-2">Milky:</div>
                <div className="text-yellow-500 text-xl">★★★☆☆</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Hardness</div>
              <div className="text-yellow-500 text-xl">★★★★★</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Viscosity</div>
              <div className="text-yellow-500 text-xl">★★★☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Flexibility</div>
              <div className="text-yellow-500 text-xl">★☆☆☆☆</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-1">Thixotropy</div>
              <div className="text-gray-600">Medium</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-1">Exothermic Reaction</div>
              <div className="text-gray-600">Medium</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-1">Adhesion</div>
              <div className="text-gray-600">Medium</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-1">Pinchability</div>
              <div className="text-gray-600">Yes</div>
            </div>
          </div>
        </div>

        {/* Characteristics */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Characteristics</h3>
          <ul className="space-y-2 text-gray-600 font-light text-sm sm:text-base">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Exceptional long-lasting wear</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Resistant to lifting and structural breakage</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Ideal for weak, fragile, or recovering nails</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Self-levelling formula for reduced filing</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Medium-texture consistency for controlled sculpting</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Optimized for precise pinching techniques</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Smooth, effortless professional application</span>
            </li>
          </ul>
        </div>

        {/* Step-by-Step Application */}
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Step-by-Step Application</h3>
          <ol className="space-y-3 text-gray-600 font-light text-sm sm:text-base">
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">1.</span>
              <span>Sanitise hands and gently push back cuticles.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">2.</span>
              <span>Remove natural shine with a 180/240 grit file and eliminate dust.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">3.</span>
              <span>Apply Acid Free Bonder to the natural nail and allow to air dry completely.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">4.</span>
              <span>Apply nail form and secure correctly.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">5.</span>
              <span>Apply a thin layer of base gel and cure 60 seconds under a 48W LED lamp.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">6.</span>
              <span>Apply Premium Fibreglass Gel, sculpt to the preferred shape, and cure 60 seconds under a 48W LED lamp.</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium text-gray-900 mr-2">7.</span>
              <span>Finish with topcoat for long-lasting shine and cure under the lamp.</span>
            </li>
          </ol>
        </div>
      </div>
    </PageTemplate>
  );
}
