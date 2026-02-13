import { Link } from 'react-router-dom';
import PageTemplate from '../../../components/PageTemplate';
import ApplicationCuring from '../../../components/ApplicationCuring';
import TopCoatComparisonChart from '../../../components/TopCoatComparisonChart';
import { isSubcategoryEnabled } from '../../../config/productCategories';
import { categoryHero } from '../../../config/imageMap';

export default function TopCoatsPage() {
  const subcategories = [
    {
      key: 'effects',
      title: 'Effects',
      path: '/products/top-and-bases/top-coats/effects',
      description: 'Finishes with texture, shimmer or visual accents, formulated without HEMA and TPO.',
      image: categoryHero['effects-top-coats'],
    },
    {
      key: 'standard',
      title: 'Standard',
      path: '/products/top-and-bases/top-coats/standard',
      description: 'Classic high-shine finishes that seal and protect — fully HEMA-free and TPO-free.',
      image: categoryHero['standard-top-coats'],
    },
  ].filter(sub => isSubcategoryEnabled('topCoats', sub.key));

  return (
    <PageTemplate
      title="Top Coats"
      subtitle="Smooth, durable finishes that protect colour — all HEMA-free and TPO-free."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Top & Bases', path: '/products/top-and-bases' },
        { label: 'Top Coats' }
      ]}
    >
      {/* Hero Description */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
          <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed">
            Professional top coats designed to seal, protect and enhance gel polish services. From high-gloss 
            standard finishes to specialty effect coats, all formulated without HEMA or TPO for safer salon use.
          </p>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="mb-10 sm:mb-12 md:mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
          Choose Your Finish
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

      {/* STANDARD TOP COATS TECHNICAL SPECIFICATIONS */}
      <div className="mb-10 sm:mb-12 md:mb-16 bg-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 border-b border-gray-200 pb-4">
          Standard Top Coats - Technical Specifications
        </h2>
        
        <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-6">
          High-performance glossy top coats engineered for maximum shine, durability, and protection. Available in multiple formulations to suit different service requirements and salon workflows.
        </p>

        {/* TC001 - Standard Top Coat */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">TC001 - Premium Gloss Top Coat</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Appearance</div>
              <div className="text-gray-600 text-sm">
                <div>Before Curing: Transparent</div>
                <div>After Curing: Glossy-Transparent</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Brightness</div>
              <div className="text-yellow-500 text-xl">★★★★☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Consistency</div>
              <div className="text-yellow-500 text-xl">★★★☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Abrasion Resistance</div>
              <div className="text-yellow-500 text-xl">★★★☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Oil Resistance</div>
              <div className="text-yellow-500 text-xl">★★★☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Duration</div>
              <div className="text-gray-600">25-30 days</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Hardness</div>
              <div className="text-yellow-500 text-xl">★★☆☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Burn While Curing</div>
              <div className="text-gray-600">No</div>
            </div>
          </div>
        </div>

        {/* TC002 */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">TC002 - High Shine Top Coat</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Appearance</div>
              <div className="text-gray-600 text-sm">
                <div>Before Curing: Transparent</div>
                <div>After Curing: Glossy-Transparent</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Brightness</div>
              <div className="text-yellow-500 text-xl">★★★☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Consistency</div>
              <div className="text-yellow-500 text-xl">★★★☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Abrasion Resistance</div>
              <div className="text-yellow-500 text-xl">★★★☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Oil Resistance</div>
              <div className="text-yellow-500 text-xl">★★★☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Duration</div>
              <div className="text-gray-600">25-30 days</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Hardness</div>
              <div className="text-yellow-500 text-xl">★★★☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Burn While Curing</div>
              <div className="text-gray-600">No</div>
            </div>
          </div>
        </div>

        {/* TC003 */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">TC003 - Ultra Durable Top Coat</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Appearance</div>
              <div className="text-gray-600 text-sm">
                <div>Before Curing: Transparent</div>
                <div>After Curing: Glossy-Transparent</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Brightness</div>
              <div className="text-yellow-500 text-xl">★★★☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Consistency</div>
              <div className="text-yellow-500 text-xl">★★★★☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Abrasion Resistance</div>
              <div className="text-yellow-500 text-xl">★★★★☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Oil Resistance</div>
              <div className="text-yellow-500 text-xl">★★★★☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Duration</div>
              <div className="text-gray-600">25-30 days</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Hardness</div>
              <div className="text-yellow-500 text-xl">★★★★☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Burn While Curing</div>
              <div className="text-gray-600">No</div>
            </div>
          </div>
        </div>

        {/* TC004 */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">TC004 - Blue Light Indicator Top Coat</h3>
          
          <p className="text-base text-gray-600 font-light leading-relaxed mb-4">
            Innovative top coat with blue light indicator technology that shows when curing begins, ensuring perfect application every time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Appearance</div>
              <div className="text-gray-600 text-sm">
                <div>Before Curing: Transparent</div>
                <div>While Curing: Blue light indicator</div>
                <div>After Curing: Glossy-Transparent</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Brightness</div>
              <div className="text-yellow-500 text-xl">★★★★☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Consistency</div>
              <div className="text-yellow-500 text-xl">★★★★☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Abrasion Resistance</div>
              <div className="text-yellow-500 text-xl">★★★★☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Oil Resistance</div>
              <div className="text-yellow-500 text-xl">★★★★☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Duration</div>
              <div className="text-gray-600">25-30 days</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Hardness</div>
              <div className="text-yellow-500 text-xl">★☆☆☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Burn While Curing</div>
              <div className="text-gray-600">No</div>
            </div>
          </div>
        </div>
      </div>

      {/* VELVET/MATTE TOP COATS TECHNICAL SPECIFICATIONS */}
      <div className="mb-10 sm:mb-12 md:mb-16 bg-white rounded-lg sm:rounded-xl border border-gray-200 p-6 sm:p-8 md:p-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 border-b border-gray-200 pb-4">
          Velvet Matte Top Coats - Technical Specifications
        </h2>
        
        <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed mb-6">
          Sophisticated matte finish top coats that create a velvety, non-reflective surface. Perfect for modern, fashion-forward nail art and editorial looks.
        </p>

        {/* VTC001/VTC002 */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">VTC001/VTC002 - Velvet Matte Finish</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Appearance</div>
              <div className="text-gray-600 text-sm">
                <div>Before Curing: Slight yellow</div>
                <div>After Curing: Matte - Slight Yellow</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Finish</div>
              <div className="text-gray-600">Matte Velvet</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Consistency</div>
              <div className="text-yellow-500 text-xl">★★★☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Abrasion Resistance</div>
              <div className="text-yellow-500 text-xl">★★★☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Oil Resistance</div>
              <div className="text-yellow-500 text-xl">★☆☆☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Duration</div>
              <div className="text-gray-600">25-30 days</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Hardness</div>
              <div className="text-yellow-500 text-xl">★☆☆☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Burn While Curing</div>
              <div className="text-yellow-500 text-xl">★★★☆☆</div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              <span className="font-medium text-gray-900">Note:</span> Slight yellowing may occur. Not recommended for applications requiring high oil resistance.
            </p>
          </div>
        </div>

        {/* VTC003 */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">VTC003 - Premium Velvet Purple Matte</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Appearance</div>
              <div className="text-gray-600 text-sm">
                <div>Before Curing: Pale purple</div>
                <div>After Curing: Matte - Transparent</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Finish</div>
              <div className="text-gray-600">Matte Velvet</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Consistency</div>
              <div className="text-yellow-500 text-xl">★★☆☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Abrasion Resistance</div>
              <div className="text-yellow-500 text-xl">★★★★☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Oil Resistance</div>
              <div className="text-yellow-500 text-xl">★★☆☆☆</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Duration</div>
              <div className="text-gray-600">25-30 days</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Hardness</div>
              <div className="text-gray-600">Not applicable for PVC testing</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-medium text-gray-900 mb-2">Burn While Curing</div>
              <div className="text-yellow-500 text-xl">★★★☆☆</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-600 font-light leading-relaxed">
              <span className="font-medium text-gray-900">Note:</span> Superior abrasion resistance with longest lasting wear time rating among velvet finishes.
            </p>
          </div>
        </div>
      </div>

      {/* Top Coat Comparison Chart */}
      <TopCoatComparisonChart />

      {/* Application & Curing */}
      <ApplicationCuring type="top-coats" />
    </PageTemplate>
  );
}
