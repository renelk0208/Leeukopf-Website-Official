import { useState, FormEvent, ChangeEvent } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import PageTemplate from '../components/PageTemplate';
import { supabase } from '../lib/supabase';

interface FormData {
  company: string;
  contact: string;
  role: string;
  email: string;
  phone: string;
  country: string;
  website: string;
  instagram: string;
  businessType: string;
  interests: string[];
  monthlyVolume: string;
  vatEori: string;
  billingAddress: string;
  shippingAddress: string;
  language: string;
  notes: string;
  gdprConsent: boolean;
  honeypot: string;
}

interface FormErrors {
  [key: string]: string;
}

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
  'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon',
  'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica',
  'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'North Korea', 'South Korea', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
  'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Saudi Arabia',
  'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const businessTypes = [
  'Distributor',
  'Salon Supply',
  'Brand Owner',
  'Private Label Starter',
  'Other'
];

const productInterests = [
  'Gel Polish',
  'Tops',
  'Bases',
  'Primers',
  'Builder Systems',
  'Acrylics',
  'Polygel',
  'Packaging'
];

const languages = [
  { code: 'EN', name: 'English' },
  { code: 'EL', name: 'Greek' },
  { code: 'BG', name: 'Bulgarian' },
  { code: 'Other', name: 'Other' }
];

export default function ClientRegistrationPage() {
  const [formData, setFormData] = useState<FormData>({
    company: '',
    contact: '',
    role: '',
    email: '',
    phone: '',
    country: '',
    website: '',
    instagram: '',
    businessType: '',
    interests: [],
    monthlyVolume: '',
    vatEori: '',
    billingAddress: '',
    shippingAddress: '',
    language: 'EN',
    notes: '',
    gdprConsent: false,
    honeypot: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name: string, value: string | boolean): string => {
    switch (name) {
      case 'company':
        return typeof value === 'string' && value.trim() === '' ? 'Company name is required' : '';
      case 'contact':
        return typeof value === 'string' && value.trim() === '' ? 'Contact name is required' : '';
      case 'email':
        if (typeof value === 'string' && value.trim() === '') return 'Email is required';
        return typeof value === 'string' && !validateEmail(value) ? 'Please enter a valid email address' : '';
      case 'country':
        return typeof value === 'string' && value === '' ? 'Country is required' : '';
      case 'businessType':
        return typeof value === 'string' && value === '' ? 'Business type is required' : '';
      case 'gdprConsent':
        return typeof value === 'boolean' && !value ? 'You must agree to the data processing terms' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    const error = validateField(name, type === 'checkbox' ? checked : value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, file: 'Only PDF, PNG, and JPG files are allowed' }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, file: 'File size must be less than 10MB' }));
        return;
      }

      setSelectedFile(file);
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    newErrors.company = validateField('company', formData.company);
    newErrors.contact = validateField('contact', formData.contact);
    newErrors.email = validateField('email', formData.email);
    newErrors.country = validateField('country', formData.country);
    newErrors.businessType = validateField('businessType', formData.businessType);
    newErrors.gdprConsent = validateField('gdprConsent', formData.gdprConsent);

    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([, v]) => v !== '')
    );

    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.honeypot) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setUploading(true);
    setSubmitError('');

    try {
      let attachments: Array<{ filename: string; url: string }> = [];

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `clients/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        attachments = [{
          filename: selectedFile.name,
          url: data.publicUrl
        }];
      }

      const registrationData = {
        company: formData.company,
        contact: formData.contact,
        role: formData.role || null,
        email: formData.email,
        phone: formData.phone || null,
        country: formData.country,
        website: formData.website || null,
        instagram: formData.instagram || null,
        business_type: formData.businessType,
        interests: formData.interests,
        monthly_volume: formData.monthlyVolume || null,
        vat_eori: formData.vatEori || null,
        billing_address: formData.billingAddress || null,
        shipping_address: formData.shippingAddress || null,
        language: formData.language || 'EN',
        notes: formData.notes || null,
        attachments: attachments
      };

      const { error: dbError } = await supabase
        .from('client_registrations')
        .insert(registrationData);

      if (dbError) throw dbError;

      // Send emails via Netlify Function
      const emailPayload = {
        ...formData,
        attachments,
        honeypot: formData.honeypot
      };

      const emailResponse = await fetch('/.netlify/functions/send-client-registration-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload)
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json().catch(() => ({}));
        console.error('Email sending failed:', {
          status: emailResponse.status,
          statusText: emailResponse.statusText,
          errorData
        });
        throw new Error(`Email sending failed: ${errorData.error || emailResponse.statusText}`);
      }

      setSubmitSuccess(true);
      setFormData({
        company: '',
        contact: '',
        role: '',
        email: '',
        phone: '',
        country: '',
        website: '',
        instagram: '',
        businessType: '',
        interests: [],
        monthlyVolume: '',
        vatEori: '',
        billingAddress: '',
        shippingAddress: '',
        language: 'EN',
        notes: '',
        gdprConsent: false,
        honeypot: ''
      });
      setSelectedFile(null);
      setErrors({});

      setTimeout(() => setSubmitSuccess(false), 10000);
    } catch (error) {
      console.error('Error submitting registration:', error);
      // Log additional details for debugging
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      setSubmitError('Something went wrong while sending your registration. Please try again in a few minutes.');
    } finally {
      setUploading(false);
    }
  };

  const isFormValid = formData.company && formData.contact && formData.email &&
                      validateEmail(formData.email) && formData.country &&
                      formData.businessType && formData.gdprConsent;

  return (
    <PageTemplate
      title="Client Registration Form"
      subtitle="Join our network of professional partners. Complete the form below to register your business with Leeukopf Laboratories."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Client Registration' }
      ]}
    >
      {submitSuccess && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg" role="alert">
          <div className="flex items-start space-x-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Registration Received!</h3>
              <p className="text-green-800 font-light">
                Thank you. Your registration has been submitted and a confirmation email has been sent to you.
              </p>
            </div>
          </div>
        </div>
      )}

      {submitError && (
        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-red-800">
            Something went wrong while sending your registration. Please try again in a few minutes.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleInputChange}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Company Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-2">
                Company / Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.company ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-required="true"
                aria-invalid={!!errors.company}
                aria-describedby={errors.company ? 'company-error' : undefined}
              />
              {errors.company && (
                <p id="company-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.company}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-900 mb-2">
                Contact Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.contact ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-required="true"
                aria-invalid={!!errors.contact}
                aria-describedby={errors.contact ? 'contact-error' : undefined}
              />
              {errors.contact && (
                <p id="contact-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.contact}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-900 mb-2">
                Role / Title
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-900 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-required="true"
                aria-invalid={!!errors.country}
                aria-describedby={errors.country ? 'country-error' : undefined}
              >
                <option value="">Select a country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {errors.country && (
                <p id="country-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.country}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-900 mb-2">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://www.example.com"
              />
            </div>

            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-900 mb-2">
                Instagram Handle
              </label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="@yourhandle"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Business Details</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-900 mb-2">
                Business Type <span className="text-red-500">*</span>
              </label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.businessType ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-required="true"
                aria-invalid={!!errors.businessType}
                aria-describedby={errors.businessType ? 'businessType-error' : undefined}
              >
                <option value="">Select business type</option>
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.businessType && (
                <p id="businessType-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.businessType}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Product Interests
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {productInterests.map(interest => (
                  <label
                    key={interest}
                    className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-900">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="monthlyVolume" className="block text-sm font-medium text-gray-900 mb-2">
                  Estimated Monthly Volume
                </label>
                <input
                  type="text"
                  id="monthlyVolume"
                  name="monthlyVolume"
                  value={formData.monthlyVolume}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 5000 units"
                />
              </div>

              <div>
                <label htmlFor="vatEori" className="block text-sm font-medium text-gray-900 mb-2">
                  VAT / EORI Number
                </label>
                <input
                  type="text"
                  id="vatEori"
                  name="vatEori"
                  value={formData.vatEori}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-900 mb-2">
                  Billing Address
                </label>
                <textarea
                  id="billingAddress"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-900 mb-2">
                  Shipping Address
                </label>
                <textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-900 mb-2">
                Preferred Language
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Additional Information</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-2">
                Notes / Requirements
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Tell us about your specific requirements, questions, or any additional information..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Upload Document (Optional)
              </label>
              <p className="text-sm text-gray-600 mb-3 font-light">
                Business document or logo (PDF, PNG, JPG; max 10MB)
              </p>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                >
                  <Upload size={20} className="text-gray-700" />
                  <span className="text-gray-700">{selectedFile ? selectedFile.name : 'Choose File'}</span>
                </label>
              </div>
              {errors.file && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {errors.file}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="gdprConsent"
                name="gdprConsent"
                checked={formData.gdprConsent}
                onChange={handleInputChange}
                className={`mt-1 w-5 h-5 text-primary border rounded focus:ring-primary ${
                  errors.gdprConsent ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-required="true"
                aria-invalid={!!errors.gdprConsent}
                aria-describedby={errors.gdprConsent ? 'gdpr-error' : undefined}
              />
              <label htmlFor="gdprConsent" className="text-sm text-gray-900">
                <span className="font-medium">I agree to the processing of my data</span> for the purpose of responding to this enquiry. <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.gdprConsent && (
              <p id="gdpr-error" className="text-sm text-red-600 ml-8" role="alert">
                {errors.gdprConsent}
              </p>
            )}

            <p className="text-sm text-gray-600 font-light ml-8">
              Your information is used only to respond to your enquiry. We respect your privacy and will never share your data with third parties.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={!isFormValid || uploading}
              className="px-12 py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </div>
      </form>
    </PageTemplate>
  );
}
