import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import PageTemplate from '../components/PageTemplate';
import { supabase, Product } from '../lib/supabase';

export default function PrivateLabelJarsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', '44444444-4444-4444-4444-444444444446')
        .order('display_order');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading jars:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTemplate
      title="Private Label Jars"
      subtitle="Premium acrylic and glass jars for gel polish, builder gel, and other nail products. Perfect for custom branding."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Private Label', path: '/private-label' },
        { label: 'Jars' }
      ]}
    >
      <div className="space-y-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-blue-800">Loading jars...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((jar) => (
              <div
                key={jar.id}
                className="group cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  {jar.image_url ? (
                    <img
                      src={jar.image_url}
                      alt={jar.name}
                      loading="lazy"
                      className="w-full h-full object-cover p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={48} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{jar.name}</h3>
                  {jar.description && (
                    <p className="text-sm text-gray-600 font-light">{jar.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
            <button className="px-8 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors">
              Request Jar Specifications
            </button>
            <button className="px-8 py-3 bg-white border-2 border-blue-800 text-blue-800 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
              Get Pricing
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 font-light">
            Available in multiple sizes • Custom colors available • Glossy and matte finishes
          </p>
        </div>
      </div>
    </PageTemplate>
  );
}
