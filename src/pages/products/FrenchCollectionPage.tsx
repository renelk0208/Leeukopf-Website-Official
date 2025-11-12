import { useState } from 'react';
import { FileText } from 'lucide-react';
import PageTemplate from '../../components/PageTemplate';
import BrochureRequestModal from '../../components/BrochureRequestModal';

export default function FrenchCollectionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      title: 'Natural Bases',
      description: 'Sheer pinks and nudes for the perfect natural nail bed appearance'
    },
    {
      title: 'White Tips',
      description: 'Classic bright whites for crisp, clean French tips that last'
    },
    {
      title: 'Extended Wear',
      description: 'Long-lasting formula maintains elegance for up to 3 weeks'
    }
  ];

  return (
    <>
      <PageTemplate
        title="French Collection"
        subtitle="Classic French manicure shades in perfect nude, pink, and white tones. Professional formulas for elegant, long-lasting results."
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Our Products', path: '/products' },
          { label: 'Gel Polish', path: '/products/gel-polish' },
          { label: 'French Collection' }
        ]}
      >
        <div className="space-y-12">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-8 md:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <FileText size={32} className="text-blue-800" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">French Manicure Color Collection</h2>
              <p className="text-lg text-gray-600 mb-8 font-light leading-relaxed">
                Explore our complete range of French manicure shades. Request our detailed color chart to discover all available nude bases, pink tones, and white tips.
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-md font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FileText size={20} className="mr-2" />
                Request Color Chart & Brochure
              </button>

              <p className="text-sm text-gray-500 mt-6">
                Our brochure includes detailed color swatches, shade names, and application tips
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Perfect for French Manicures</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 font-light">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTemplate>

      <BrochureRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryName="French Collection"
        categorySlug="french-collection"
      />
    </>
  );
}
