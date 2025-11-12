import { useState } from 'react';
import { FileText } from 'lucide-react';
import PageTemplate from '../../components/PageTemplate';
import BrochureRequestModal from '../../components/BrochureRequestModal';

export default function TopsBasesPrimersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productCategories = [
    {
      title: 'Top Coats',
      items: ['Wipe-off', 'Non-wipe', 'Matt finish', 'Special effects']
    },
    {
      title: 'Base Coats',
      items: ['Classic base', '5-in-1 superior', 'Builder in a bottle', 'Flexible base']
    },
    {
      title: 'Primers',
      items: ['Acid-free primers', 'Dehydrators', 'Bond enhancers', 'pH balancers']
    }
  ];

  return (
    <>
      <PageTemplate
        title="Tops, Bases & Primers"
        subtitle="Complete foundation and finishing systems for perfect gel polish application and extended wear."
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Our Products', path: '/products' },
          { label: 'Tops, Bases & Primers' }
        ]}
      >
        <div className="mb-16">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-8 md:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <FileText size={32} className="text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Foundation & Finishing Systems</h2>
              <p className="text-lg text-gray-600 mb-8 font-light leading-relaxed">
                Discover our professional range of tops, bases, and primers. Request our comprehensive brochure for detailed product information and application techniques.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {productCategories.map((category) => (
                  <div key={category.title} className="bg-white rounded-lg border border-gray-200 p-5 text-left">
                    <h3 className="font-semibold text-gray-900 mb-3">{category.title}</h3>
                    <ul className="space-y-1">
                      {category.items.map((item) => (
                        <li key={item} className="text-sm text-gray-600 font-light flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
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
                Our brochure includes product specifications, usage guidelines, and compatibility information
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why Use a Complete System</h2>
          <p className="text-gray-600 font-light leading-relaxed mb-6">
            Our tops, bases, and primers work synergistically to provide optimal adhesion, protection, and longevity. Each product is formulated to complement the others, creating a complete nail care ecosystem that delivers professional results every time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Enhanced Adhesion</h3>
              <p className="text-gray-600 font-light text-sm">Primers and bases create the perfect foundation for color application and extended wear.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Extended Durability</h3>
              <p className="text-gray-600 font-light text-sm">Top coats seal and protect, preventing chips and maintaining glossy shine for weeks.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Nail Health</h3>
              <p className="text-gray-600 font-light text-sm">Flexible formulas move with the natural nail, reducing stress and preventing breakage.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Professional Results</h3>
              <p className="text-gray-600 font-light text-sm">Consistent performance across the entire system for salon-quality manicures.</p>
            </div>
          </div>
        </div>
      </PageTemplate>

      <BrochureRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryName="Tops, Bases & Primers"
        categorySlug="tops-bases-primers"
      />
    </>
  );
}
