import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { supabase, ProductCategory } from '../lib/supabase';

interface NavigationProps {
  onNavigate?: (section: string, categoryId?: string) => void;
}

export default function Navigation({ onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [categoryTree, setCategoryTree] = useState<Map<string, ProductCategory[]>>(new Map());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('display_order');

      if (error) throw error;

      if (data) {
        const mainCategories = data.filter(cat => !cat.parent_category_id);
        setCategories(mainCategories);

        const tree = new Map<string, ProductCategory[]>();
        data.forEach(cat => {
          if (cat.parent_category_id) {
            const children = tree.get(cat.parent_category_id) || [];
            children.push(cat);
            tree.set(cat.parent_category_id, children);
          }
        });
        setCategoryTree(tree);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
      setActiveDropdown(null);
    }
  };

  const handleProductClick = (categoryId: string) => {
    if (onNavigate) {
      onNavigate('products', categoryId);
    }
    scrollToSection('products');
  };

  const hasChildren = (categoryId: string) => {
    return categoryTree.has(categoryId) && categoryTree.get(categoryId)!.length > 0;
  };

  const renderSubMenu = (parentId: string, level: number = 1) => {
    const children = categoryTree.get(parentId) || [];
    if (children.length === 0) return null;

    return (
      <div className={`${level === 1 ? 'absolute top-full left-0 mt-1' : 'relative'} min-w-[240px] bg-white border border-gray-200 shadow-lg ${level === 1 ? 'rounded-lg' : ''}`}>
        {children.map((child) => {
          const hasSubChildren = hasChildren(child.id);

          return (
            <div key={child.id} className="relative group/sub">
              <button
                onClick={() => handleProductClick(child.id)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between text-gray-700 hover:text-primary-600"
              >
                <span className="text-sm font-medium">{child.name}</span>
                {hasSubChildren && (
                  <ChevronDown size={16} className="transform -rotate-90 text-gray-400" />
                )}
              </button>
              {hasSubChildren && (
                <div className="hidden group-hover/sub:block absolute left-full top-0">
                  {renderSubMenu(child.id, level + 1)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection('home')}
              className="text-2xl font-bold tracking-tight text-gray-900 hover:text-primary-600 transition-colors"
            >
              LEEUKOPF
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
            <button
              onClick={() => scrollToSection('home')}
              className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium text-sm"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium text-sm"
            >
              About
            </button>

            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'products' ? null : 'products')}
                onMouseEnter={() => setActiveDropdown('products')}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium text-sm"
              >
                Our Products
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform duration-200 ${
                    activeDropdown === 'products' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'products' && (
                <div
                  className="absolute top-full left-0 mt-1 min-w-[240px] bg-white border border-gray-200 rounded-lg shadow-lg"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {categories.map((category) => {
                    const hasSubCategories = hasChildren(category.id);

                    return (
                      <div key={category.id} className="relative group">
                        <button
                          onClick={() => !hasSubCategories && handleProductClick(category.id)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between text-gray-700 hover:text-primary-600 border-b border-gray-100 last:border-b-0"
                        >
                          <span className="text-sm font-medium">{category.name}</span>
                          {hasSubCategories && (
                            <ChevronDown size={16} className="transform -rotate-90 text-gray-400" />
                          )}
                        </button>
                        {hasSubCategories && (
                          <div className="hidden group-hover:block absolute left-full top-0">
                            {renderSubMenu(category.id)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium text-sm"
            >
              Contact
            </button>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-2 space-y-1">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors font-medium text-sm"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors font-medium text-sm"
            >
              About
            </button>

            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Our Products
              </div>
              {categories.map((category) => {
                const children = categoryTree.get(category.id) || [];
                const hasSubCategories = children.length > 0;

                return (
                  <div key={category.id} className="space-y-1">
                    <button
                      onClick={() => {
                        if (!hasSubCategories) {
                          handleProductClick(category.id);
                        }
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors text-sm font-medium"
                    >
                      {category.name}
                    </button>
                    {hasSubCategories && (
                      <div className="pl-4 space-y-1">
                        {children.map((subCategory) => {
                          const subChildren = categoryTree.get(subCategory.id) || [];
                          const hasSubSubCategories = subChildren.length > 0;

                          return (
                            <div key={subCategory.id} className="space-y-1">
                              <button
                                onClick={() => {
                                  if (!hasSubSubCategories) {
                                    handleProductClick(subCategory.id);
                                  }
                                }}
                                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors text-sm"
                              >
                                {subCategory.name}
                              </button>
                              {hasSubSubCategories && (
                                <div className="pl-4 space-y-1">
                                  {subChildren.map((subSubCategory) => (
                                    <button
                                      key={subSubCategory.id}
                                      onClick={() => handleProductClick(subSubCategory.id)}
                                      className="block w-full text-left px-3 py-2 text-gray-500 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors text-xs"
                                    >
                                      {subSubCategory.name}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-3 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors font-medium text-sm"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
