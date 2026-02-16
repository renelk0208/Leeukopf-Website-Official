import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import PageTemplate from '../components/PageTemplate';
import { Package, User, MapPin, Phone, Mail, FileText } from 'lucide-react';

interface CustomerDetails {
  companyName: string;
  vatNumber: string;
  invoiceAddress: string;
  shippingAddress: string;
  postalCode: string;
  country: string;
  region: string;
  contactPerson: string;
  contactEmail: string;
  contactNumber: string;
  notes: string;
  signature: string;
}

export default function CheckoutPage() {
  const { items, clearCart, totalItems } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    companyName: '',
    vatNumber: '',
    invoiceAddress: '',
    shippingAddress: '',
    postalCode: '',
    country: '',
    region: '',
    contactPerson: '',
    contactEmail: '',
    contactNumber: '',
    notes: '',
    signature: '',
  });

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        customer: customerDetails,
        items: items,
        totalItems: totalItems,
        orderDate: new Date().toISOString(),
      };

      // Log order data for now (will be replaced with API call)
      console.log('Order submitted:', orderData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      alert('Order submitted successfully! Our team will contact you shortly.');

      // Clear cart and redirect
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <PageTemplate
        title="Checkout"
        subtitle="Complete your order"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Checkout' }
        ]}
      >
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add products to your cart before proceeding to checkout.</p>
          <button
            onClick={() => navigate('/products/builder-and-structure-gels')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title="Checkout"
      subtitle="Complete your B2B order"
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Checkout' }
      ]}
    >
      <div className="max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  required
                  value={customerDetails.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  VAT Number *
                </label>
                <input
                  type="text"
                  id="vatNumber"
                  required
                  value={customerDetails.vatNumber}
                  onChange={(e) => handleInputChange('vatNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Address Information</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label htmlFor="invoiceAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Address *
                </label>
                <textarea
                  id="invoiceAddress"
                  required
                  rows={3}
                  value={customerDetails.invoiceAddress}
                  onChange={(e) => handleInputChange('invoiceAddress', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Address *
                </label>
                <textarea
                  id="shippingAddress"
                  required
                  rows={3}
                  value={customerDetails.shippingAddress}
                  onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    required
                    value={customerDetails.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    required
                    value={customerDetails.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                    Region / State *
                  </label>
                  <input
                    type="text"
                    id="region"
                    required
                    value={customerDetails.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Phone className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  required
                  value={customerDetails.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  required
                  value={customerDetails.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  required
                  value={customerDetails.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Order Notes
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={customerDetails.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any special instructions or requirements for this order..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-2">
                  Signature (Type your full name) *
                </label>
                <input
                  type="text"
                  id="signature"
                  required
                  value={customerDetails.signature}
                  onChange={(e) => handleInputChange('signature', e.target.value)}
                  placeholder="Type your full name as signature"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Order Date: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Shade</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Size</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={`${item.groupCode}-${item.shadeCode}-${item.size}-${index}`} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-900">{item.productName || item.groupCode}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{item.shadeCode}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{item.size}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">{item.qty}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td colSpan={3} className="py-3 px-4 text-sm font-semibold text-gray-900">Total Items</td>
                    <td className="py-3 px-4 text-sm font-bold text-gray-900 text-right">{totalItems}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                submitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Order'}
            </button>
          </div>
        </form>
      </div>
    </PageTemplate>
  );
}
