import PageTemplate from '../../../components/PageTemplate';
import ApplicationCuring from '../../../components/ApplicationCuring';

export default function ShimmerGlitterBuilderGelPage() {
  return (
    <PageTemplate
      title="Shimmer Glitter Builder Gel"
      subtitle="Builder gel with multi-dimensional shimmer and glitter particles — structure and sparkle in one formula."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Builder & Structure Gels', path: '/products/builder-and-structure-gels' },
        { label: 'Shimmer Glitter Builder Gel' }
      ]}
    >
      {/* Hero Image */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src="/img/products/builder-systems/3-in-1 Builder gel/Glitter 3-in-1 Builder Gels/shimmer-builder-gels.jpg"
            alt="Shimmer Glitter Builder Gel colour range"
            width="1600"
            height="400"
            className="category-hero"
          />
        </div>

        {/* Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Our Shimmer Glitter Builder Gel combines the strength and versatility of a professional builder system
            with iridescent shimmer and glitter particles built directly into the formula. Available in 36 shades,
            it delivers a one-step finish that requires no additional nail art — perfect for clients who want
            effortless sparkle with long-lasting wear.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            HEMA-free and EU certified. Ideal for overlays, extensions, and encapsulation designs.
            Minimum order: 25 pieces per colour.
          </p>
        </div>
      </div>

      {/* Colour Range */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
          36 Shimmer & Glitter Shades
        </h2>
        <div className="rounded-lg sm:rounded-xl overflow-hidden border border-gray-200">
          <img
            src="/img/products/builder-systems/3-in-1 Builder gel/Glitter 3-in-1 Builder Gels/shimmer-builder-gels.jpg"
            alt="Full range of 36 Shimmer Glitter Builder Gel shades"
            className="w-full object-contain"
          />
        </div>
      </div>

      {/* Application & Curing */}
      <ApplicationCuring type="builder-gels" />

      {/* Product Details */}
      <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Product Details
        </h2>
        <ul className="space-y-3 text-gray-600 font-light text-sm sm:text-base">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>36 shimmer and glitter shades — code range MI-GLB1-01 to MI-GLB1-36</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>HEMA-free formulation — safer for technicians and clients</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>EU Cosmetics Regulation compliant (EC 1223/2009)</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Minimum order: 25 pieces per colour</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Available in 10ml bottles — bottle colour, brush type and branding configured at checkout</span>
          </li>
        </ul>
      </div>
    </PageTemplate>
  );
}
