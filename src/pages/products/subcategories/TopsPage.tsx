import PageTemplate, { ImagePlaceholder } from '../../../components/PageTemplate';

export default function TopsPage() {
  const products = [
    {
      title: 'Wipe Off Top Coat',
      description: 'Classic gel top coat with tacky layer for easy removal. High-gloss finish with excellent durability.'
    },
    {
      title: 'Non-Wipe Top Coat',
      description: 'No-residue finish for instant shine. Perfect for clients who want immediate results without cleansing.'
    },
    {
      title: 'Matt Top Coat',
      description: 'Sophisticated matte finish that transforms any gel color. Durable and scratch-resistant formula.'
    },
    {
      title: 'Top Coat Effects',
      description: 'Specialty finishes including velvet, holographic, and textured effects for creative nail art.'
    }
  ];

  return (
    <PageTemplate
      title="Top Coats"
      subtitle="Professional finishing systems for ultimate shine, protection, and special effects."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Tops, Bases & Primers', path: '/products/tops-bases-primers' },
        { label: 'Tops' }
      ]}
      showCTA={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {products.map((product) => (
          <div key={product.title} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <ImagePlaceholder alt={product.title} />
            <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">{product.title}</h3>
            <p className="text-gray-600 font-light leading-relaxed">{product.description}</p>
          </div>
        ))}
      </div>

      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Choosing the Right Top Coat</h2>
        <p className="text-gray-600 font-light leading-relaxed mb-6">
          Each top coat in our range is formulated for specific applications and client preferences. Wipe-off formulas provide traditional high-gloss results, while non-wipe options offer immediate shine without cleanup. Matt finishes create sophisticated, modern looks, and our effects line opens endless creative possibilities.
        </p>
        <p className="text-gray-600 font-light leading-relaxed">
          All our top coats cure quickly under LED and UV lamps, provide excellent chip resistance, and protect color gel underneath for extended wear. They're compatible with all gel polish brands and can be layered for custom effects.
        </p>
      </div>
    </PageTemplate>
  );
}
