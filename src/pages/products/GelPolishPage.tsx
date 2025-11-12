import { useState } from 'react';
import { FileText } from 'lucide-react';
import PageTemplate from '../../components/PageTemplate';
import BrochureRequestModal from '../../components/BrochureRequestModal';

export default function GelPolishPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const collections = [
    {
      title: 'French Collection',
      description: 'Classic French manicure shades in perfect nude, pink, and white tones'
    },
    {
      title: 'Solid Colours',
      description: 'Vibrant, highly pigmented colors across the spectrum'
    },
    {
      title: 'Glitters',
      description: 'Dazzling glitter formulations for stunning nail art'
    }
  ];

  return (
    <>
      <PageTemplate
        title="Gel Polish Collection"
        subtitle="Professional gel polish systems with exceptional shine, durability, and color payoff. Perfect for salon and home use."
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Our Products', path: '/products' },
          { label: 'Gel Polish' }
        ]}
      >
        <div className="mb-16">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-8 md:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <FileText size={32} className="text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Gel Polish Catalog</h2>
              <p className="text-lg text-gray-600 mb-8 font-light leading-relaxed">
                Explore our comprehensive range of gel polish products. Request our detailed brochure to discover our full collection of colors, finishes, and formulations.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {collections.map((collection) => (
                  <div key={collection.title} className="bg-white rounded-lg border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900 mb-2">{collection.title}</h3>
                    <p className="text-sm text-gray-600 font-light">{collection.description}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-md font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FileText size={20} className="mr-2" />
                Request Complete Brochure
              </button>

              <p className="text-sm text-gray-500 mt-6">
                Our brochure includes detailed color charts, product specifications, and application guidelines
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Product Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Long-Lasting Wear</h3>
              <p className="text-gray-600 font-light text-sm">Up to 3 weeks of chip-resistant wear with proper application and base/top coat system.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">High Pigmentation</h3>
              <p className="text-gray-600 font-light text-sm">Rich color payoff with excellent coverage. Many shades achieve full opacity in 1-2 coats.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Application</h3>
              <p className="text-gray-600 font-light text-sm">Self-leveling formula with perfect consistency. Professional results without streaking or patchiness.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">LED/UV Compatible</h3>
              <p className="text-gray-600 font-light text-sm">Cures perfectly under LED and UV lamps. Quick cure times for efficient salon services.</p>
            </div>
          </div>
        </div>
      </PageTemplate>

      <BrochureRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryName="Gel Polish Collection"
        categorySlug="gel-polish"
      />
    </>
  );
}
