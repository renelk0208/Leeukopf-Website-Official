import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

interface CatalogEntry {
  groupCode: string;
  productName: string;
  allowedPackSizes: string[];
  moq: number;
  shades: string[];
}

interface OrderTableProps {
  groupCode: string;
}

export default function OrderTable({ groupCode }: OrderTableProps) {
  const [catalogEntry, setCatalogEntry] = useState<CatalogEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  // State for each shade's order details
  const [orderDetails, setOrderDetails] = useState<{
    [shadeCode: string]: {
      size: string;
      qty: number;
    };
  }>({});

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/catalog.builder-gel.json');
        if (!response.ok) {
          throw new Error('Failed to load catalog');
        }
        const catalog: CatalogEntry[] = await response.json();
        const entry = catalog.find(item => item.groupCode === groupCode);
        
        if (!entry) {
          throw new Error(`Product group ${groupCode} not found in catalog`);
        }

        setCatalogEntry(entry);
        
        // Initialize order details for each shade
        const initialDetails: { [key: string]: { size: string; qty: number } } = {};
        entry.shades.forEach(shade => {
          initialDetails[shade] = {
            size: entry.allowedPackSizes[0],
            qty: entry.moq
          };
        });
        setOrderDetails(initialDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load catalog');
        console.error('Error loading catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, [groupCode]);

  const handleSizeChange = (shadeCode: string, size: string) => {
    setOrderDetails(prev => ({
      ...prev,
      [shadeCode]: {
        ...prev[shadeCode],
        size
      }
    }));
  };

  const handleQtyChange = (shadeCode: string, qty: number) => {
    setOrderDetails(prev => ({
      ...prev,
      [shadeCode]: {
        ...prev[shadeCode],
        qty
      }
    }));
  };

  const handleAddToCart = (shadeCode: string) => {
    if (!catalogEntry) return;

    const details = orderDetails[shadeCode];
    if (details.qty < catalogEntry.moq) {
      alert(`Minimum order quantity is ${catalogEntry.moq} per colour`);
      return;
    }

    addItem({
      groupCode: catalogEntry.groupCode,
      shadeCode,
      size: details.size,
      qty: details.qty,
      productName: catalogEntry.productName
    });

    // Show success feedback
    alert(`Added ${details.qty} x ${catalogEntry.productName} (${shadeCode}, ${details.size}) to cart`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-600">Loading product information...</p>
      </div>
    );
  }

  if (error || !catalogEntry) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-red-600">{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">
          {catalogEntry.productName}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          MOQ: <span className="font-medium">{catalogEntry.moq} units per colour</span>
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Shade Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {catalogEntry.shades.map((shade) => {
              const details = orderDetails[shade];
              const isValidQty = details && details.qty >= catalogEntry.moq;

              return (
                <tr key={shade} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {shade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={details?.size || catalogEntry.allowedPackSizes[0]}
                      onChange={(e) => handleSizeChange(shade, e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                      {catalogEntry.allowedPackSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <input
                        type="number"
                        min={catalogEntry.moq}
                        step="1"
                        value={details?.qty || catalogEntry.moq}
                        onChange={(e) => handleQtyChange(shade, parseInt(e.target.value) || catalogEntry.moq)}
                        className={`block w-24 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                          !isValidQty ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {!isValidQty && (
                        <span className="text-xs text-red-600 mt-1">
                          MOQ {catalogEntry.moq}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleAddToCart(shade)}
                      disabled={!isValidQty}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isValidQty
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          💡 <span className="font-medium">Note:</span> Quantities can be adjusted in increments of 1. 
          Minimum order quantity of {catalogEntry.moq} units per colour applies.
        </p>
      </div>
    </div>
  );
}
