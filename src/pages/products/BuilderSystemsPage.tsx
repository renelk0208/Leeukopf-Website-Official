import PageTemplate, { ImagePlaceholder } from '../../components/PageTemplate';

export default function BuilderSystemsPage() {
  const products = [
    {
      title: '3-in-1 Builder Gels',
      description: 'Versatile builder gel that acts as base, builder, and strengthener in one formula. Perfect for natural nail overlays and extensions.'
    },
    {
      title: 'Fibreglass',
      description: 'Standard fibreglass reinforcement system for natural nail strengthening and repair. Easy to apply and shape.'
    },
    {
      title: 'Premium Fibreglass',
      description: 'Advanced fibreglass formula with enhanced flexibility and strength. Ideal for professional nail extensions and repairs.'
    },
    {
      title: 'Acrylics (Standard)',
      description: 'Professional acrylic powder and liquid system. Traditional formula with excellent workability and durability.'
    },
    {
      title: 'Acrylics (Fast)',
      description: 'Quick-setting acrylic system for efficient salon work. Reduced cure time without compromising strength.'
    },
    {
      title: 'Polygel (Acrygel)',
      description: 'Innovative hybrid system combining the best of gel and acrylic. Easy application with superior strength and flexibility.'
    }
  ];

  return (
    <PageTemplate
      title="Builder Systems"
      subtitle="Professional nail extension and strengthening systems. From traditional acrylics to innovative polygels, find the perfect solution."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Builder Systems' }
      ]}
      showCTA={true}
      ctaText="Request Technical Specs"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {products.map((product) => (
          <div
            key={product.title}
            className="group p-6 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <ImagePlaceholder alt={product.title} />
            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2 group-hover:text-primary-600 transition-colors">{product.title}</h3>
            <p className="text-gray-600 font-light text-sm leading-relaxed">{product.description}</p>
          </div>
        ))}
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
              <span className="text-primary-600 mr-2">•</span>
              <span>Superior adhesion to natural nail plate for extended wear</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Self-leveling formulas for smooth, professional finish</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Flexible yet strong formulations that move with natural nail</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Non-yellowing formulas maintain clarity over time</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">•</span>
              <span>Compatible with all gel polish and nail art products</span>
            </li>
          </ul>
        </div>
        <div>
          <ImagePlaceholder alt="Builder gel application demonstration" />
        </div>
      </div>
    </PageTemplate>
  );
}
