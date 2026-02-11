import { useState, useEffect } from 'react';
import { Search, Send, CheckCircle, XCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CategorySelector from '../components/order-form/CategorySelector';
import ProductTable from '../components/order-form/ProductTable';
import OrderSummary from '../components/order-form/OrderSummary';
import CustomerForm from '../components/order-form/CustomerForm';
import ImageLightbox from '../components/order-form/ImageLightbox';
import { loadProducts, getCategories, filterByCategory, searchProducts } from '../lib/loadProducts';
import type { Product, OrderLine, CustomerDetails, OrderSubmission } from '../types/order';

export default function OrderFormPage() {
  // Products state
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Order state
  const [orderItems, setOrderItems] = useState<Map<string, OrderLine>>(new Map());

  // Customer state
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    country: '',
    vat_number: '',
    shipping_address: '',
    additional_comments: '',
  });
  const [customerErrors, setCustomerErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Image lightbox state
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Load products on mount
  useEffect(() => {
    loadProducts()
      .then((products) => {
        setAllProducts(products);
        setFilteredProducts(products);
        setCategories(getCategories(products));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load products:', error);
        setLoadError('Failed to load products. Please refresh the page.');
        setLoading(false);
      });
  }, []);

  // Filter products when category or search changes
  useEffect(() => {
    let result = allProducts;

    // Apply category filter
    result = filterByCategory(result, selectedCategory);

    // Apply search filter
    if (searchQuery.trim()) {
      result = searchProducts(result, searchQuery);
    }

    setFilteredProducts(result);
  }, [allProducts, selectedCategory, searchQuery]);

  // Order management functions
  const handleAddItem = (product: Product, quantity: number, notes?: string) => {
    const newItems = new Map(orderItems);
    newItems.set(product.code, {
      code: product.code,
      product_name: product.product_name,
      size: product.size,
      unit: product.unit,
      quantity,
      moq: product.moq,
      notes,
    });
    setOrderItems(newItems);
  };

  const handleRemoveItem = (code: string) => {
    const newItems = new Map(orderItems);
    newItems.delete(code);
    setOrderItems(newItems);
  };

  const handleUpdateQuantity = (code: string, quantity: number) => {
    const newItems = new Map(orderItems);
    const item = newItems.get(code);
    if (item) {
      item.quantity = quantity;
      newItems.set(code, item);
      setOrderItems(newItems);
    }
  };

  const handleUpdateNotes = (code: string, notes: string) => {
    const newItems = new Map(orderItems);
    const item = newItems.get(code);
    if (item) {
      item.notes = notes;
      newItems.set(code, item);
      setOrderItems(newItems);
    }
  };

  const handleClearOrder = () => {
    if (confirm('Are you sure you want to clear your entire order?')) {
      setOrderItems(new Map());
    }
  };

  const handleExportCSV = () => {
    const items = Array.from(orderItems.values());
    if (items.length === 0) {
      alert('No items in order to export');
      return;
    }

    // Create CSV content
    const headers = ['Code', 'Product Name', 'Size', 'Unit', 'Quantity', 'MOQ', 'Notes'];
    const rows = items.map((item) => [
      item.code,
      item.product_name,
      item.size,
      item.unit,
      item.quantity.toString(),
      item.moq,
      item.notes || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => (cell.includes(',') ? `"${cell}"` : cell)).join(',')
      ),
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leeukopf-order-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Customer form management
  const handleCustomerChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (customerErrors[field]) {
      setCustomerErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Validation
  const validateOrder = (): boolean => {
    const errors: Partial<Record<keyof CustomerDetails, string>> = {};

    // Check items
    if (orderItems.size === 0) {
      alert('Please add at least one item to your order');
      return false;
    }

    // Validate customer details
    if (!customerDetails.company_name.trim()) {
      errors.company_name = 'Company name is required';
    }

    if (!customerDetails.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setCustomerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit order
  const handleSubmit = async () => {
    if (!validateOrder()) {
      return;
    }

    setSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      const orderData: OrderSubmission = {
        customer: customerDetails,
        items: Array.from(orderItems.values()),
        order_date: new Date().toISOString(),
      };

      const response = await fetch('/.netlify/functions/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit order');
      }

      setSubmitSuccess(true);
      setOrderId(result.order_id);

      // Clear order after successful submission
      setTimeout(() => {
        setOrderItems(new Map());
        setCustomerDetails({
          company_name: '',
          contact_name: '',
          email: '',
          phone: '',
          country: '',
          vat_number: '',
          shipping_address: '',
          additional_comments: '',
        });
      }, 2000);
    } catch (error) {
      console.error('Order submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Leeukopf Laboratories — Order Form
            </h1>
            <p className="text-lg text-gray-600">
              Browse our professional gel polish products and submit your order
            </p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-fuchsia"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          )}

          {/* Error state */}
          {loadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{loadError}</p>
            </div>
          )}

          {/* Main content */}
          {!loading && !loadError && (
            <>
              {/* Search bar */}
              <div className="mb-6">
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by product name or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-fuchsia focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category selector */}
              <div className="mb-6">
                <CategorySelector
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product table */}
                <div className="lg:col-span-2">
                  <ProductTable
                    products={filteredProducts}
                    orderItems={orderItems}
                    onAddItem={handleAddItem}
                    onRemoveItem={handleRemoveItem}
                    onUpdateQuantity={handleUpdateQuantity}
                    onUpdateNotes={handleUpdateNotes}
                    onImageClick={setLightboxImage}
                  />
                </div>

                {/* Order summary */}
                <div className="lg:col-span-1">
                  <div className="sticky top-4">
                    <OrderSummary
                      items={Array.from(orderItems.values())}
                      onRemoveItem={handleRemoveItem}
                      onClearOrder={handleClearOrder}
                      onExportCSV={handleExportCSV}
                    />
                  </div>
                </div>
              </div>

              {/* Customer details form */}
              <div className="mt-8">
                <CustomerForm
                  details={customerDetails}
                  errors={customerErrors}
                  onChange={handleCustomerChange}
                />
              </div>

              {/* Submit button */}
              <div className="mt-8 max-w-2xl mx-auto">
                {submitSuccess && (
                  <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-800 font-medium">Order submitted successfully!</p>
                      {orderId && (
                        <p className="text-green-700 text-sm mt-1">
                          Order ID: {orderId}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {submitError && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-medium">Failed to submit order</p>
                      <p className="text-red-700 text-sm mt-1">{submitError}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting || orderItems.size === 0}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand-bright-pink text-white rounded-lg hover:bg-opacity-90 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Order
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* Image lightbox */}
      {lightboxImage && (
        <ImageLightbox
          imageUrl={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}
