import { useState } from 'react';
import { FileText } from 'lucide-react';
import PageTemplate from '../../components/PageTemplate';
import BrochureRequestModal from '../../components/BrochureRequestModal';

export default function BuilderSystemsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const systems = [
    {
      title: '3-in-1 Builder Gels',
      description: 'Base, builder, and strengthener in one formula'
    },
    {
      title: 'Fibreglass',
      description: 'Standard and premium reinforcement systems'
    },
    {
      title: 'Acrylics',
      description: 'Standard and fast-setting professional systems'
    },
    {
      title: 'Polygel (Acrygel)',
      description: 'Innovative hybrid gel and acrylic system'
    }
  ];

  return (
    <>
      <PageTemplate
        title="Builder Systems"
        subtitle="Professional nail extension and strengthening systems. From traditional acrylics to innovative polygels, find the perfect solution."
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Our Products', path: '/products' },
          { label: 'Builder Systems' }
        ]}
      >
        <div className="mb-16">
          <div className="mb-12 rounded-xl overflow-hidden">
            <img
              src="/img/products/builder_gels_category_2.jpg"
              alt="Professional Builder Systems Collection"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-8 md:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <FileText size={32} className="text-blue-800" aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Builder Systems Catalogue</h2>
              <p className="text-lg text-gray-600 mb-8 font-light leading-relaxed">
                Discover our professional range of builder systems. Request our comprehensive brochure for detailed technical specifications, application guides, and product comparisons.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {systems.map((system) => (
                  <div key={system.title} className="bg-white rounded-lg border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">{system.title}</h3>
                    <p className="text-xs text-gray-600 font-light">{system.description}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-md font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FileText size={20} className="mr-2" aria-hidden="true" />
                Request Complete Brochure
              </button>

              <p className="text-sm text-gray-500 mt-6">
                Our brochure includes technical specifications, application techniques, and system comparisons
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">System Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">System</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Best For</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Application</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Cure Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-900">3-in-1 Builder</td>
                  <td className="py-3 px-4 text-gray-600">Natural overlays</td>
                  <td className="py-3 px-4 text-gray-600">Brush-on</td>
                  <td className="py-3 px-4 text-gray-600">60-120s LED</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-900">Fibreglass</td>
                  <td className="py-3 px-4 text-gray-600">Nail repairs</td>
                  <td className="py-3 px-4 text-gray-600">Wrap technique</td>
                  <td className="py-3 px-4 text-gray-600">60s LED</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-900">Acrylics</td>
                  <td className="py-3 px-4 text-gray-600">Full extensions</td>
                  <td className="py-3 px-4 text-gray-600">Powder & liquid</td>
                  <td className="py-3 px-4 text-gray-600">Air dry 2-3min</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-900">Polygel</td>
                  <td className="py-3 px-4 text-gray-600">Extensions & overlays</td>
                  <td className="py-3 px-4 text-gray-600">Dual-form/brush</td>
                  <td className="py-3 px-4 text-gray-600">60-120s LED</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Professional Features</h2>
            <ul className="space-y-3 text-gray-600 font-light">
              <li className="flex items-start">
                <span className="text-blue-800 mr-2">•</span>
                <span>Superior adhesion to natural nail plate for extended wear</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-800 mr-2">•</span>
                <span>Self-leveling formulas for smooth, professional finish</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-800 mr-2">•</span>
                <span>Flexible yet strong formulations that move with natural nail</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-800 mr-2">•</span>
                <span>Non-yellowing formulas maintain clarity over time</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-800 mr-2">•</span>
                <span>Compatible with all gel polish and nail art products</span>
              </li>
            </ul>
          </div>
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <div className="text-center p-6">
                <p className="text-gray-600 text-sm">Builder gel application demonstration</p>
              </div>
            </div>
          </div>
        </div>
      </PageTemplate>

      <BrochureRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryName="Builder Systems"
        categorySlug="builder-systems"
      />
    </>
  );
}
