import { useState, useEffect } from 'react';
import { Palette, Package, Droplet, Boxes, Sparkles, ChevronDown } from 'lucide-react';
import { supabase, ProductCategory, Product } from '../lib/supabase';

const categoryIcons: Record<string, JSX.Element> = {
  'bottles': <Package className="text-cyan-400" size={32} />,
  'jars': <Boxes className="text-cyan-400" size={32} />,
  'bulk-products': <Droplet className="text-cyan-400" size={32} />,
  'gel-polish-colors': <Palette className="text-cyan-400" size={32} />,
  'builder-gel-systems': <Sparkles className="text-cyan-400" size={32} />,
  'tops-bases-primers': <Sparkles className="text-cyan-400" size={32} />,
  'tops': <Sparkles className="text-cyan-400" size={32} />,
  'bases': <Sparkles className="text-cyan-400" size={32} />,
  'primers': <Sparkles className="text-cyan-400" size={32} />,
};

export default function ProductGallery() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [subcategories, setSubcategories] = useState<Record<string, ProductCategory[]>>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('display_order');

      if (error) throw error;

      if (data) {
        const parentCategories = data.filter(cat => !cat.parent_category_id);
        setCategories(parentCategories);

        const subCatMap: Record<string, ProductCategory[]> = {};
        data.forEach(cat => {
          if (cat.parent_category_id) {
            if (!subCatMap[cat.parent_category_id]) {
              subCatMap[cat.parent_category_id] = [];
            }
            subCatMap[cat.parent_category_id].push(cat);
          }
        });
        setSubcategories(subCatMap);
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

  const toggleCategory = async (categoryId: string) => {
    const hasSubcategories = subcategories[categoryId]?.length > 0;

    if (hasSubcategories) {
      if (expandedDropdown === categoryId) {
        setExpandedDropdown(null);
      } else {
        setExpandedDropdown(categoryId);
      }
    } else {
      if (expandedCategory === categoryId) {
        setExpandedCategory(null);
      } else {
        setExpandedCategory(categoryId);
        setExpandedDropdown(null);
        await loadProducts(categoryId);
      }
    }
  };

  const selectSubcategory = async (categoryId: string) => {
    setExpandedCategory(categoryId);
    await loadProducts(categoryId);
  };

  if (loading) {
    return (
      <section id="products" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-cyan-400">Loading products...</div>
        </div>
      </section>
    );
  }

  const currentCategory = categories.find(c => c.id === expandedCategory);
  const currentProducts = expandedCategory ? (productsByCategory[expandedCategory] || []) : [];

  return (
    <section id="products" className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDEyYzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSJyZ2JhKDYsIDE4MiwgMjEyLCAwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Our <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Products</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore our comprehensive range of premium gel polish products and packaging solutions
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const hasSubcategories = subcategories[category.id]?.length > 0;
            const isDropdownOpen = expandedDropdown === category.id;
            const isActive = expandedCategory === category.id || subcategories[category.id]?.some(sub => sub.id === expandedCategory);

            return (
              <div key={category.id} className="relative">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-slate-800/50 text-gray-300 border border-cyan-500/20 hover:border-cyan-500/40'
                  }`}
                >
                  <span className="hidden sm:inline">
                    {categoryIcons[category.slug]}
                  </span>
                  <span>{category.name}</span>
                  {hasSubcategories && (
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {hasSubcategories && isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full min-w-[240px] bg-slate-800/95 backdrop-blur-sm border border-cyan-500/20 rounded-lg shadow-xl z-50 overflow-hidden">
                    {subcategories[category.id].map((subcategory) => (
                      <button
                        key={subcategory.id}
                        onClick={() => selectSubcategory(subcategory.id)}
                        className={`block w-full text-left px-4 py-3 transition-colors ${
                          expandedCategory === subcategory.id
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'text-gray-300 hover:bg-slate-700/50 hover:text-cyan-400'
                        }`}
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {expandedCategory && currentCategory && (
          <>
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center space-x-3 p-4 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-cyan-500/20">
                {categoryIcons[currentCategory.slug]}
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-white">{currentCategory.name}</h3>
                  <p className="text-gray-400">{currentCategory.description}</p>
                </div>
              </div>
            </div>

            {currentProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-cyan-500/20">
                  <p className="text-gray-400 text-lg mb-2">
                    Products coming soon for this category
                  </p>
                  <p className="text-gray-500">
                    Contact us to learn more about our {currentCategory.name.toLowerCase()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-slate-800/30 backdrop-blur-sm rounded-xl border border-cyan-500/20 overflow-hidden hover:border-cyan-400/40 transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20"
                  >
                    {product.image_url ? (
                      <div className="aspect-square bg-slate-800/50 overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        {categoryIcons[currentCategory.slug || 'bottles']}
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {product.name}
                      </h4>
                      {product.description && (
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Interested in our products or need custom solutions?
          </p>
          <button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30"
          >
            Get in Touch
          </button>
        </div>
      </div>
    </section>
  );
}
