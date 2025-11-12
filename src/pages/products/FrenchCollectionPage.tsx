import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import PageTemplate from '../../components/PageTemplate';
import { supabase, Product } from '../../lib/supabase';

export default function FrenchCollectionPage() {
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
        .eq('category_id', '11111111-1111-1111-1111-111111111112')
        .order('display_order');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading French Collection products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTemplate
      title="French Collection"
      subtitle="Classic French manicure shades in perfect nude, pink, and white tones. Professional formulas for elegant, long-lasting results."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Products', path: '/products' },
        { label: 'Gel Polish', path: '/products/gel-polish' },
        { label: 'French Collection' }
      ]}
      showCTA={true}
      ctaText="Request Color Chart"
    >
      <div className="space-y-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-primary-600">Loading products...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-primary-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {product.image_url ? (
                    <div className="aspect-square bg-gray-50 overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                      <Package size={48} className="text-gray-300" />
                    </div>
                  )}
                  <div className="p-5">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h4>
                    {product.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Perfect for French Manicures</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">Natural Bases</h3>
                  <p className="text-sm text-gray-600 font-light">Sheer pinks and nudes for the perfect natural nail bed appearance.</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">White Tips</h3>
                  <p className="text-sm text-gray-600 font-light">Classic bright whites for crisp, clean French tips that last.</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">Extended Wear</h3>
                  <p className="text-sm text-gray-600 font-light">Long-lasting formula maintains elegance for up to 3 weeks.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </PageTemplate>
  );
}
