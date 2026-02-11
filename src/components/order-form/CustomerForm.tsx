import type { CustomerDetails } from '../../types/order';

interface CustomerFormProps {
  details: CustomerDetails;
  errors: Partial<Record<keyof CustomerDetails, string>>;
  onChange: (field: keyof CustomerDetails, value: string) => void;
}

export default function CustomerForm({
  details,
  errors,
  onChange,
}: CustomerFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Customer Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Name - Required */}
        <div className="md:col-span-2">
          <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company_name"
            value={details.company_name}
            onChange={(e) => onChange('company_name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-fuchsia focus:border-transparent ${
              errors.company_name ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.company_name && (
            <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
          )}
        </div>

        {/* Contact Name */}
        <div>
          <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Name
          </label>
          <input
            type="text"
            id="contact_name"
            value={details.contact_name}
            onChange={(e) => onChange('contact_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-fuchsia focus:border-transparent"
          />
        </div>

        {/* Email - Required */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={details.email}
            onChange={(e) => onChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-fuchsia focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            value={details.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-fuchsia focus:border-transparent"
          />
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            type="text"
            id="country"
            value={details.country}
            onChange={(e) => onChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-fuchsia focus:border-transparent"
          />
        </div>

        {/* VAT Number */}
        <div className="md:col-span-2">
          <label htmlFor="vat_number" className="block text-sm font-medium text-gray-700 mb-1">
            VAT Number (optional)
          </label>
          <input
            type="text"
            id="vat_number"
            value={details.vat_number || ''}
            onChange={(e) => onChange('vat_number', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-fuchsia focus:border-transparent"
          />
        </div>

        {/* Shipping Address */}
        <div className="md:col-span-2">
          <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-1">
            Shipping Address
          </label>
          <textarea
            id="shipping_address"
            value={details.shipping_address}
            onChange={(e) => onChange('shipping_address', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-fuchsia focus:border-transparent"
          />
        </div>

        {/* Additional Comments */}
        <div className="md:col-span-2">
          <label htmlFor="additional_comments" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Comments
          </label>
          <textarea
            id="additional_comments"
            value={details.additional_comments || ''}
            onChange={(e) => onChange('additional_comments', e.target.value)}
            rows={3}
            placeholder="Any special requests or instructions..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-fuchsia focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
