import { useState, useEffect } from "react";
import { getBuilderGelCatalog } from "../lib/catalog";
import type { CatalogEntry } from "../types/catalog";

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
      setError(err instanceof Error ? err.message : "Failed to load catalog");
    } finally {
      setLoading(false);
    }
  }

  loadCatalog();
}, []);


  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">Error: {error}</div>;

  const firstEntry = catalog[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Catalog Test</h1>
      <p>Number of entries: {catalog.length}</p>
      {firstEntry && (
        <div>
          <p>Group: {firstEntry.groupCode}</p>
          <p>Name: {firstEntry.productName}</p>
        </div>
      )}
    </div>
  );
}
