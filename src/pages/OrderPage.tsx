import { useEffect, useMemo, useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { categories } from '../config/categories';
import { filterByCategory, loadProducts } from '../lib/loadProducts';
import type { Product } from '../types/order';
import InternalSolidColourGrid from './InternalSolidColourGrid';

type OrderCategoryKey = keyof typeof categories;

interface OrderPageProps {
  categoryKey: string;
}

export default function OrderPage({ categoryKey }: OrderPageProps) {
  const categoryConfig = categories[categoryKey as OrderCategoryKey];
  const categoryLabel = categoryConfig?.label ?? categoryKey;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryKey === 'solidColour') {
      setLoading(false);
      return;
    }

    if (!categoryConfig) {
      setLoading(false);
      return;
    }

    loadProducts()
      .then((allProducts) => {
        setProducts(filterByCategory(allProducts, categoryConfig.label));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load products for order page:', error);
        setLoadError('Failed to load products. Please refresh the page.');
        setLoading(false);
      });
  }, [categoryConfig, categoryKey]);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.product_name.localeCompare(b.product_name)),
    [products]
  );

  if (categoryKey === 'solidColour' && categoryConfig) {
    return <InternalSolidColourGrid />;
  }

  if (!categoryConfig) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-20">
          <h1 className="text-2xl font-bold">Unknown category: {categoryKey}</h1>
        </main>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-20">
          <h1 className="text-2xl font-bold">{categoryLabel}</h1>
          <p className="mt-3 text-gray-600">Loading products...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (loadError) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-20">
          <h1 className="text-2xl font-bold">{categoryLabel}</h1>
          <p className="mt-3 text-red-600">{loadError}</p>
        </main>
        <Footer />
      </>
    );
  }

  if (sortedProducts.length === 0) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-20">
          <h1 className="text-2xl font-bold">No products found for {categoryLabel}</h1>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold">{categoryLabel}</h1>
        <p className="mt-2 text-gray-600">B2B order products</p>

        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Size</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">MOQ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedProducts.map((product) => (
                <tr key={product.code} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{product.code}</td>
                  <td className="px-4 py-3 text-sm">{product.product_name}</td>
                  <td className="px-4 py-3 text-sm">{product.size} {product.unit}</td>
                  <td className="px-4 py-3 text-sm">{product.moq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </>
  );
}
