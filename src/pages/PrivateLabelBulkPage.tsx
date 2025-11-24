import { useState } from 'react';
import { Package } from 'lucide-react';
import PageTemplate from '../components/PageTemplate';

interface BulkProduct {
  id: string;
  name: string;
  description: string;
  src: string;
  alt: string;
}

const BULK_PRODUCTS: BulkProduct[] = [
  {
    id: 'bulk-5kg-bucket',
    name: '5 kg Bucket',
    description: 'Ideal for builder gels, bases and high-viscosity systems where easy scooping and lab use is required.',
    src: '/img/private-label/bulk/bulk-5kg-bucket.jpg',
    alt: '5 kg black bucket for bulk UV/LED gel products'
  },
  {
    id: 'bulk-5kg-jerrycan',
    name: '5 kg Jerry Can',
    description: 'Perfect for lower-viscosity gels and liquids, compatible with automatic and semi-automatic filling lines.',
    src: '/img/private-label/bulk/bulk-5kg-jerrycan.jpg',
    alt: '5 kg jerry can for bulk liquid products'
  },
  {
    id: 'bulk-1kg-flask',
    name: '1 kg Flask',
    description: 'A versatile size for lab, refill stations or phased production of premium gel formulations.',
    src: '/img/private-label/bulk/bulk-1kg-flask.jpg',
    alt: '1 kg black flask for bulk gel products'
  },
  {
    id: 'bulk-500g-flask',
    name: '500 g Flask',
    description: 'Ideal for pilot launches, training centres or smaller production runs with professional volumes.',
    src: '/img/private-label/bulk/bulk-500g-flask.jpg',
    alt: '500 g black flask for bulk nail products'
  },
  {
    id: 'bulk-1kg-bucket',
    name: '1 kg Bucket',
    description: 'Compact, easy-to-store option for premium gels supplied to salons, academies and labs.',
    src: '/img/private-label/bulk/bulk-1kg-bucket.jpg',
    alt: '1 kg black bucket for bulk nail products'
  }
];

export default function PrivateLabelBulkPage() {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (productId: string) => {
    setImageErrors(prev => new Set(prev).add(productId));
  };

  return (
    <PageTemplate
      title="Bulk Packaging Options"
      subtitle="For high-volume partners, we supply our gel, builder systems and nail treatments in bulk formats ready for your own filling and logistics. Choose the container that fits your production flow – we take care of compliant, high-performance formulas."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Private Label', path: '/private-label' },
        { label: 'Bulk Packaging' }
      ]}
    >
      <div className="space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BULK_PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="group cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-video bg-gray-50 relative overflow-hidden">
                {imageErrors.has(product.id) ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    <Package size={48} className="text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500 text-center">Image not available</p>
                  </div>
                ) : (
                  <img
                    src={product.src}
                    alt={product.alt}
                    loading="lazy"
                    onError={() => handleImageError(product.id)}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="p-5 space-y-2">
                <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
                <p className="text-sm text-gray-600 font-light">
                  {product.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 space-y-4">
          <div className="text-xs md:text-sm text-gray-600 font-light space-y-2">
            <p>
              All bulk formats are filled under EU cosmetics GMP with complete documentation (PIF, SDS, batch traceability)
              and can be aligned to your internal coding and labelling needs.
            </p>
            <p>
              For MOQ, lead times and compatibility with your filling equipment, please contact us via the Private Label
              enquiry form.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center pt-4">
            <button className="px-8 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors">
              Request Bulk Specifications
            </button>
            <button className="px-8 py-3 bg-white border-2 border-blue-800 text-blue-800 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
              Get Pricing
            </button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
