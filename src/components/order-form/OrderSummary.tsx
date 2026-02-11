import { ShoppingCart, Download, Trash2 } from 'lucide-react';
import type { OrderLine } from '../../types/order';

interface OrderSummaryProps {
  items: OrderLine[];
  onRemoveItem: (code: string) => void;
  onClearOrder: () => void;
  onExportCSV: () => void;
}

export default function OrderSummary({
  items,
  onRemoveItem,
  onClearOrder,
  onExportCSV,
}: OrderSummaryProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-brand-fuchsia" />
          Order Summary
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {items.length} item{items.length !== 1 ? 's' : ''} ({totalItems} total units)
        </p>
      </div>

      <div className="p-6">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No items in order</p>
            <p className="text-sm mt-1">Add products to get started</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.code}
                  className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm font-medium text-brand-fuchsia">
                      {item.code}
                    </div>
                    <div className="text-sm text-gray-900 truncate">
                      {item.product_name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {item.size} {item.unit} × {item.quantity}
                      {item.notes && (
                        <span className="text-gray-500"> • {item.notes}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.code)}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <button
                onClick={onExportCSV}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-fuchsia text-white rounded-lg hover:bg-brand-bright-pink transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                Export as CSV
              </button>
              <button
                onClick={onClearOrder}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Clear Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
