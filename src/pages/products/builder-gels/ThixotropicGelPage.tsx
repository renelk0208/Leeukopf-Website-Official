import PageTemplate from '../../../components/PageTemplate';
import ApplicationCuring from '../../../components/ApplicationCuring';
import ProductGrid from '../../../components/ProductGrid';
import { loadBuilderGelImages } from '../../../lib/imageLoaders';

/**
 * Use Vite's import.meta.glob to dynamically load thixotropic gel images
 * These are in the "thixotropic-gel" folder
 */
const imageModules = import.meta.glob<{ default: string }>(
  '/public/img/products/builder-systems/thixotropic-gel/**/*.{jpg,png}',
  { eager: true }
);

const PRODUCT_IMAGES = loadBuilderGelImages(imageModules, {
  globPattern: '/public/img/products/builder-systems/thixotropic-gel/**/*.{jpg,png}',
  filterPattern: 'thixotropic',
  altPrefix: 'Thixotropic Gel',
});

export default function ThixotropicGelPage() {
  return (
    <PageTemplate
      title="Thixotropic Gel"
      subtitle="Advanced thixotropic formula for maximum control and effortless application — HEMA-free and TPO-free."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Builder & Structure Gels', path: '/products/builder-and-structure-gels' },
        { label: 'Thixotropic Gel' }
      ]}
    >
      {/* Hero Image */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src="/img/products/builder-systems/thixotropic-gel/thixotropic-gel-category-image.png"
            alt="Thixotropic Gel"
            width="1600"
            height="400"
            className="category-hero"
          />
        </div>

        {/* Description */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Thixotropic builder gel is designed to deliver total control and effortless application. Its advanced 
            formula stays stable and solid at rest, yet becomes smooth, light, and workable the moment you apply 
            it with a brush.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            The gel adapts to your movements: as you sculpt, it softens for precise shaping, then gently 
            self-levels and returns to a firm state, staying exactly where you place it. This prevents running, 
            flooding, or collapsing—allowing you to work calmly and accurately, even on multiple nails at once.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-4">
            Thixotropic gel makes creating the perfect structure and apex simple and stress-free. There's no need 
            to rush—just focus on achieving the ideal shape before curing.
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            The Clear version offers high transparency and a clean, glass-like finish, making it ideal for natural 
            and nude looks, encapsulation, baby boomer and French designs, and as a base structure under colour or 
            nail art.
          </p>
        </div>
      </div>

      {/* Product Gallery */}
      {PRODUCT_IMAGES.length > 0 && (
        <ProductGrid
          title="Available Shades & Products"
          description="Browse our complete range of thixotropic gel shades"
          images={PRODUCT_IMAGES}
        />
      )}

      {/* Application & Curing */}
      <ApplicationCuring type="builder-gels" />

      {/* System Benefits */}
      <div className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200 mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Why You'll Love It
        </h2>
        <ul className="space-y-3 text-gray-600 font-light text-sm sm:text-base">
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Thixotropic texture for maximum control</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Non-runny, self-adjusting consistency</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Smooth self-levelling without overflow</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Excellent stability during application</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Easy shaping and clean architecture</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>Perfect finish every time</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary mr-2">•</span>
            <span>HEMA-free and TPO-free formulation</span>
          </li>
        </ul>
      </div>

      {/* Professional Results Section */}
      <div className="bg-gradient-to-br from-primary-50 to-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Professional Results Made Easy
        </h2>
        <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
          Thixotropic gel is designed to support your technique, not slow you down—making professional 
          results easier, faster, and more reliable with every application. Whether you're creating natural 
          overlays, extensions, or intricate nail art, this gel gives you the control and confidence to 
          achieve perfect results every time.
        </p>
      </div>
    </PageTemplate>
  );
}
