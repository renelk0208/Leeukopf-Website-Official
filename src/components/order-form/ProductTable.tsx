import { useState } from 'react';
import { Plus, Minus, Image as ImageIcon } from 'lucide-react';
import type { Product, OrderLine } from '../../types/order';

interface ProductTableProps {
  products: Product[];
  orderItems: Map<string, OrderLine>;
  onAddItem: (product: Product, quantity: number, notes?: string) => void;
  onRemoveItem: (code: string) => void;
  onUpdateQuantity: (code: string, quantity: number) => void;
  onUpdateNotes: (code: string, notes: string) => void;
  onImageClick?: (imageUrl: string) => void;
}

export default function ProductTable({
  products,
  orderItems,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity,
  onUpdateNotes,
  onImageClick,
}: ProductTableProps) {
  const [quantities, setQuantities] = useState<Map<string, number>>(new Map());
  const [notes, setNotes] = useState<Map<string, string>>(new Map());

  const handleQuantityChange = (code: string, value: string) => {
    const qty = Math.max(0, parseInt(value) || 0);
    const newQuantities = new Map(quantities);
    newQuantities.set(code, qty);
    setQuantities(newQuantities);

    if (orderItems.has(code)) {
      onUpdateQuantity(code, qty);
    }
  };

  const handleNotesChange = (code: string, value: string) => {
    const newNotes = new Map(notes);
    newNotes.set(code, value);
    setNotes(newNotes);

    if (orderItems.has(code)) {
      onUpdateNotes(code, value);
    }
  };

  const handleAddItem = (product: Product) => {
    const qty = quantities.get(product.code) || parseInt(product.moq) || 1;
    const itemNotes = notes.get(product.code) || '';
    onAddItem(product, qty, itemNotes);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Size
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                MOQ
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isInOrder = orderItems.has(product.code);
                const currentQty = isInOrder
                  ? orderItems.get(product.code)!.quantity
                  : quantities.get(product.code) || 0;

                return (
                  <tr key={product.code} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {product.image_url && onImageClick && (
                          <button
                            onClick={() => onImageClick(product.image_url)}
                            className="text-brand-fuchsia hover:text-brand-bright-pink"
                            title="View image"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>
                        )}
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {product.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.product_name}
                        </div>
                        {product.subcategory && (
                          <div className="text-xs text-gray-500">
                            {product.subcategory}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {product.size} {product.unit}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {product.moq}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        value={currentQty}
                        onChange={(e) =>
                          handleQuantityChange(product.code, e.target.value)
                        }
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-brand-fuchsia focus:border-transparent"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={
                          isInOrder
                            ? orderItems.get(product.code)!.notes || ''
                            : notes.get(product.code) || ''
                        }
                        onChange={(e) =>
                          handleNotesChange(product.code, e.target.value)
                        }
                        placeholder="Optional notes"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-brand-fuchsia focus:border-transparent"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {isInOrder ? (
                        <button
                          onClick={() => onRemoveItem(product.code)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddItem(product)}
                          disabled={currentQty === 0}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-brand-fuchsia hover:text-brand-bright-pink hover:bg-pink-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
