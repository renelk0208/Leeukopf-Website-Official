import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { supabase, ProductCategory, Product } from '../lib/supabase';
import Breadcrumbs from './Breadcrumbs';

interface ProductGalleryProps {
  selectedCategoryId?: string;
  onCategoryChange?: (categoryId: string | null) => void;
}

export default function ProductGallery({ selectedCategoryId, onCategoryChange }: ProductGalleryProps) {
  const [allCategories, setAllCategories] = useState<Map<string, ProductCategory>>(new Map());
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      setExpandedCategory(selectedCategoryId);
      loadProducts(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('display_order');

      if (error) throw error;

      if (data) {
        const allCats = new Map<string, ProductCategory>();

        data.forEach(cat => {
          allCats.set(cat.id, cat);
        });

        setAllCategories(allCats);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (categoryId: string) => {
    if (productsByCategory[categoryId]) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .order('display_order');

      if (error) throw error;
      setProductsByCategory(prev => ({
        ...prev,
        [categoryId]: data || []
      }));
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const getBreadcrumbs = (categoryId: string) => {
    const breadcrumbs: { label: string; onClick?: () => void }[] = [
      { label: 'Products', onClick: () => handleCategoryChange(null) }
    ];

    const category = allCategories.get(categoryId);
    if (!category) return breadcrumbs;

    const path: ProductCategory[] = [];
    let current: ProductCategory | undefined = category;

    while (current) {
      path.unshift(current);
      current = current.parent_category_id ? allCategories.get(current.parent_category_id) : undefined;
    }

    path.forEach((cat, index) => {
      if (index === path.length - 1) {
        breadcrumbs.push({ label: cat.name });
      } else {
        breadcrumbs.push({ label: cat.name, onClick: () => handleCategoryChange(cat.id) });
      }
    });

    return breadcrumbs;
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setExpandedCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
    if (categoryId) {
      loadProducts(categoryId);
    }
  };

  if (loading) {
    return (
      <section id="products" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-blue-800">Loading products...</div>
        </div>
      </section>
    );
  }

  const currentCategory = expandedCategory ? allCategories.get(expandedCategory) : null;
  const currentProducts = expandedCategory ? (productsByCategory[expandedCategory] || []) : [];

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Our Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium gel polish products and packaging solutions for beauty professionals
          </p>
        </div>

        {currentCategory && (
          <div className="mb-12">
            <Breadcrumbs items={getBreadcrumbs(currentCategory.id)} />

            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                {currentCategory.name}
              </h3>
              {currentCategory.description && (
                <p className="text-lg text-gray-600">{currentCategory.description}</p>
              )}
            </div>

            {currentProducts.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
                <Package size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 text-lg mb-2">
                  Products coming soon for this category
                </p>
                <p className="text-gray-500">
                  Contact us to learn more about our {currentCategory.name.toLowerCase()}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    {product.image_url ? (
                      <div className="aspect-square bg-gray-50 overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                        <Package size={48} className="text-gray-300" />
                      </div>
                    )}
                    <div className="p-5">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-800 transition-colors">
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
            )}
          </div>
        )}

        <div className="text-center mt-16">
          <div className="inline-block p-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-700 mb-6 text-lg">
              Interested in our products or need custom solutions?
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3 bg-gray-900 text-white rounded-md font-semibold hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
