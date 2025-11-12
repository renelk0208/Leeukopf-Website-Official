import PageTemplate, { ImagePlaceholder } from '../../../components/PageTemplate';

export default function BasesPage() {
  const products = [
    {
      title: 'Classic Base Coat',
      description: 'Traditional gel base coat for reliable adhesion and protection. Perfect for standard gel polish application.'
    },
    {
      title: '5-in-1 Superior Base',
      description: 'Multi-functional base offering adhesion, strengthening, flexibility, smoothing, and protection in one formula.'
    },
    {
      title: 'Brush-On Builder (Builder in a Bottle)',
      description: 'Easy-to-apply builder gel in a polish bottle. Creates structure and length without traditional builder techniques.'
    },
    {
      title: 'Flexible Base Coat',
      description: 'Ultra-flexible formula that moves with the natural nail. Reduces lifting and prevents cracking on flexible nails.'
    }
  ];

  return (
    <PageTemplate
      title="Base Coats"
      subtitle="Foundation systems for optimal adhesion, nail health, and extended wear of your gel polish manicures."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Tops, Bases & Primers', path: '/products/tops-bases-primers' },
        { label: 'Bases' }
      ]}
      showCTA={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {products.map((product) => (
          <div key={product.title} className="group bg-white rounded-lg border border-gray-200 p-6 hover:border-primary-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <ImagePlaceholder alt={product.title} />
            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2 group-hover:text-primary-600 transition-colors">{product.title}</h3>
            <p className="text-gray-600 font-light leading-relaxed">{product.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Base Coat Guide</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">For Normal Nails</h3>
            <p className="text-gray-600 font-light">Classic Base Coat provides reliable adhesion and protection for healthy, normal nails. Quick-curing and easy to apply.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">For Weak or Peeling Nails</h3>
            <p className="text-gray-600 font-light">5-in-1 Superior Base strengthens while providing adhesion. Multi-functional formula addresses multiple nail concerns simultaneously.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">For Short or Broken Nails</h3>
            <p className="text-gray-600 font-light">Builder in a Bottle creates structure and adds length. Perfect for clients wanting to grow out damaged nails or add subtle extensions.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">For Flexible Nails</h3>
            <p className="text-gray-600 font-light">Flexible Base Coat moves with the nail plate, preventing stress cracks and lifting. Ideal for clients with naturally bendy nails.</p>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
