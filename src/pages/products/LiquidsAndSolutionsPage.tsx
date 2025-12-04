import PageTemplate from '../../components/PageTemplate';
import ApplicationCuring from '../../components/ApplicationCuring';
import ProductSEO from '../../components/ProductSEO';

export default function LiquidsAndSolutionsPage() {
  return (
    <PageTemplate
      title="Liquids & Solutions"
      subtitle="Professional prep, cleanse and removal solutions for complete gel nail systems."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Liquids & Solutions' }
      ]}
    >
      {/* Hero Description */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Essential liquids and solutions that support every stage of gel nail services — from nail plate 
            preparation to final cleanse and safe removal. Formulated for efficiency and safety in professional salon environments.
          </p>
        </div>
      </div>

      {/* Product Categories */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Essential Solutions
        </h2>
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Nail Prep Solutions</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Pre-service solutions that prepare the natural nail plate for optimal adhesion. Includes dehydrators, 
              pH balancers and sanitizing solutions.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Removes surface oils and moisture</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Balances nail plate pH</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Enhances product adhesion</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cleansers</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Post-cure cleansing solutions for removing the tacky dispersion layer from wipe-off gel products. 
              Ensures brilliant shine and clean finish.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Removes sticky layer efficiently</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Leaves no residue or streaks</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Reveals high-gloss finish</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Gel Removers</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Professional-strength removal solutions for safe, efficient soak-off of gel polish and soft gel systems. 
              Designed to minimize damage to the natural nail.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Fast, effective gel removal</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Minimizes natural nail damage</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Professional salon strength</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Acrylic Liquids (Monomers)</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Professional acrylic liquids designed to work with our acrylic powder systems. Available in 
              standard and fast-set formulations for different working preferences.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Optimal powder-to-liquid ratio</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Controlled setting times</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Superior strength and clarity</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Polygel Slip Solutions</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">
              Specialty solutions that allow smooth manipulation and shaping of polygel and acrygel products 
              without sticking to brushes or tools.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Prevents product sticking</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Enables smooth sculpting</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Essential for polygel application</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <ApplicationCuring type="liquids" />

      {/* Safety Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 sm:p-6 md:p-8 mb-10 sm:mb-12 md:mb-16">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Safety & Handling
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 font-light">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Use all liquids and solutions in well-ventilated areas</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Keep containers tightly closed when not in use</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Store away from heat sources and direct sunlight</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Follow all manufacturer safety guidelines and local regulations</span>
          </li>
        </ul>
      </div>

      {/* SEO Content */}
      <ProductSEO category="liquids-solutions" />
    </PageTemplate>
  );
}
