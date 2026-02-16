import { useState, useEffect } from 'react';
import { getBuilderGelCatalog } from '../lib/catalog';
import type { CatalogEntry } from '../types/catalog';

export default function CatalogTest() {
  const [catalog, setCatalog] = useState<CatalogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        const data = await getBuilderGelCatalog();
        setCatalog(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load catalog');
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Catalog Test</h1>
        <p>Loading catalog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Catalog Test</h1>
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  const firstEntry = catalog.length > 0 ? catalog[0] : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Catalog Test</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <p className="font-semibold">Number of entries in catalog:</p>
          <p className="text-2xl">{catalog.length}</p>
        </div>

        {firstEntry && (
          <div className="bg-gray-100 p-4 rounded">
            <p className="font-semibold mb-2">First entry:</p>
            <div className="space-y-1">
              <p><span className="font-medium">Group Code:</span> {firstEntry.groupCode}</p>
              <p><span className="font-medium">Product Name:</span> {firstEntry.productName}</p>
            </div>
          </div>
        )}

        {catalog.length === 0 && (
          <div className="bg-yellow-100 p-4 rounded">
            <p>Catalog is empty</p>
          </div>
        )}
      </div>
    </div>
  );
}
