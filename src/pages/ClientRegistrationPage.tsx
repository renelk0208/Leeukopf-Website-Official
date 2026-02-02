import { useState, FormEvent, ChangeEvent } from 'react';
import { CheckCircle } from 'lucide-react';
import PageTemplate from '../components/PageTemplate';
import { trackLead } from '../lib/metaPixel';

interface FormData {
  company: string;
  contact: string;
  role: string;
  email: string;
  phone: string;
  country: string;
  countryOther: string;
  website: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  businessType: string;
  interests: string[];
  interestPrivateLabel: boolean;
  interestDistribution: boolean;
  interestInfluencer: boolean;
  bottleSizes: string[];
  jarSizes: string[];
  monthlyVolume: string;
  vatEori: string;
  billingAddress: string;
  shippingAddress: string;
  sameAsBilling: boolean;
  requestSampleBox: boolean;
  street: string;
  district: string;
  postalCode: string;
  language: string;
  notes: string;
  gdprConsent: boolean;
  privacyPolicyAccepted: boolean;
  marketingConsent: boolean;
  honeypot: string;
  client_type: string;
  // Distributors fields
  countries_covered: string;
  distribution_channels: string;
  estimated_monthly_volume: string;
  // Private Label fields
  brand_name: string;
  product_interest: string;
  target_moq: string;
  target_launch_date: string;
  // Influencers fields
  country_audience: string;
  avg_views: string;
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

const bottleSizeOptions = ['7ml', '10ml', '15ml'];
const jarSizeOptions = ['10g', '20g', '50g'];

const languages = [
  { code: 'EN', name: 'English' },
  { code: 'EL', name: 'Greek' },
  { code: 'BG', name: 'Bulgarian' },
  { code: 'Other', name: 'Other' }
];

// Country dial code mapping
const countryDialCodes: { [key: string]: string } = {
  'Greece': '+30',
  'Italy': '+39',
  'Bulgaria': '+359',
  'Spain': '+34',
  'France': '+33',
  'Germany': '+49',
  'United Kingdom': '+44',
  'United States': '+1',
  'United Arab Emirates': '+971',
  'Saudi Arabia': '+966',
  'Qatar': '+974'
};

export default function ClientRegistrationPage() {
  const [formData, setFormData] = useState<FormData>({
    company: '',
    contact: '',
    role: '',
    email: '',
    phone: '',
    country: '',
    countryOther: '',
    website: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    businessType: '',
    interests: [],
    interestPrivateLabel: false,
    interestDistribution: false,
    interestInfluencer: false,
    bottleSizes: [],
    jarSizes: [],
    monthlyVolume: '',
    vatEori: '',
    billingAddress: '',
    shippingAddress: '',
    sameAsBilling: false,
    requestSampleBox: false,
    street: '',
    district: '',
    postalCode: '',
    language: 'EN',
    notes: '',
    gdprConsent: false,
    privacyPolicyAccepted: false,
    marketingConsent: false,
    honeypot: '',
    client_type: 'Distributors',
    // Distributors fields
    countries_covered: '',
    distribution_channels: '',
    estimated_monthly_volume: '',
    // Private Label fields
    brand_name: '',
    product_interest: '',
    target_moq: '',
    target_launch_date: '',
    // Influencers fields
    country_audience: '',
    avg_views: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [activeTab, setActiveTab] = useState<'Distributors' | 'PrivateLabel' | 'Influencers'>('Distributors');

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
      case 'privacyPolicyAccepted':
        return typeof value === 'boolean' && !value ? 'You must accept the Privacy Policy to submit the form' : '';
      default:
        return '';
    }
  };

  // Helper function to determine if phone dial code should be auto-filled
  const shouldAutoFillDialCode = (currentPhone: string): boolean => {
    // Auto-prefill dial code if:
    // 1. Phone is empty, OR
    // 2. Phone currently equals just a dial code (e.g., "+30"), OR
    // 3. Phone currently starts with a different dial code but user hasn't typed beyond it
    return !currentPhone || 
           Object.values(countryDialCodes).includes(currentPhone) ||
           (currentPhone.startsWith('+') && currentPhone.length <= 5 && !currentPhone.match(/\d{3,}/));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // Handle country change to auto-fill phone dial code
    if (name === 'country') {
      const dialCode = countryDialCodes[value];
      const currentPhone = formData.phone;
      
      if (dialCode && shouldAutoFillDialCode(currentPhone) && value !== 'Other') {
        setFormData(prev => ({
          ...prev,
          country: value,
          phone: dialCode
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          country: value
        }));
      }
    } else if (name === 'sameAsBilling' && type === 'checkbox') {
      // Handle "Same as billing" checkbox
      setFormData(prev => ({
        ...prev,
        sameAsBilling: checked,
        shippingAddress: checked ? prev.billingAddress : prev.shippingAddress
      }));
    } else if (name === 'billingAddress') {
      // Update billing address and sync to shipping if checkbox is checked
      setFormData(prev => ({
        ...prev,
        billingAddress: value,
        shippingAddress: prev.sameAsBilling ? value : prev.shippingAddress
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

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

  const handleBottleSizeChange = (size: string) => {
    setFormData(prev => ({
      ...prev,
      bottleSizes: prev.bottleSizes.includes(size)
        ? prev.bottleSizes.filter(s => s !== size)
        : [...prev.bottleSizes, size]
    }));
  };

  const handleJarSizeChange = (size: string) => {
    setFormData(prev => ({
      ...prev,
      jarSizes: prev.jarSizes.includes(size)
        ? prev.jarSizes.filter(s => s !== size)
        : [...prev.jarSizes, size]
    }));
  };

  const handleSetActiveTab = (tabKey: 'Distributors' | 'PrivateLabel' | 'Influencers') => {
    setActiveTab(tabKey);
    
    // Update client_type in formData
    setFormData(prev => ({
      ...prev,
      client_type: tabKey
    }));
    
    // Clear fields from other tabs to prevent stale data
    if (tabKey !== 'Distributors') {
      setFormData(prev => ({
        ...prev,
        countries_covered: '',
        distribution_channels: '',
        estimated_monthly_volume: ''
      }));
    }
    if (tabKey !== 'PrivateLabel') {
      setFormData(prev => ({
        ...prev,
        brand_name: '',
        product_interest: '',
        target_moq: '',
        target_launch_date: ''
      }));
    }
    if (tabKey !== 'Influencers') {
      setFormData(prev => ({
        ...prev,
        country_audience: '',
        avg_views: ''
      }));
    }
  };



  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields for all submissions
    newErrors.company = validateField('company', formData.company);
    newErrors.contact = validateField('contact', formData.contact);
    newErrors.email = validateField('email', formData.email);
    newErrors.country = validateField('country', formData.country);
    newErrors.businessType = validateField('businessType', formData.businessType);
    newErrors.gdprConsent = validateField('gdprConsent', formData.gdprConsent);
    newErrors.privacyPolicyAccepted = validateField('privacyPolicyAccepted', formData.privacyPolicyAccepted);

    // Business Interest validation: at least one must be selected
    if (!formData.interestPrivateLabel && !formData.interestDistribution && !formData.interestInfluencer) {
      newErrors.businessInterest = 'Please select at least one business interest (Private Label, Distribution, or Influencer).';
    }

    // Conditional validation for Influencer: at least one social media handle is required
    if (activeTab === 'Influencers') {
      const hasInstagram = formData.instagram.trim().length > 0;
      const hasTiktok = formData.tiktok.trim().length > 0;

      if (!hasInstagram && !hasTiktok) {
        newErrors.socialMedia = 'At least one social media handle (Instagram or TikTok) is required for influencers.';
      }
    }

    // Product Interests validation: at least one must be selected
    if (formData.interests.length === 0) {
      newErrors.productInterests = 'Please select at least one product interest.';
    }

    // Country "Other" validation
    if (formData.country === 'Other' && !formData.countryOther.trim()) {
      newErrors.countryOther = 'Please specify country';
    }

    // Conditional validation for sample box fields
    if (formData.requestSampleBox) {
      if (!formData.street.trim()) {
        newErrors.street = 'Street address is required when requesting a sample box';
      }
      if (!formData.district.trim()) {
        newErrors.district = 'Suburb/District is required when requesting a sample box';
      }
      if (!formData.postalCode.trim()) {
        newErrors.postalCode = 'Postal code is required when requesting a sample box';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Contact number is required when requesting a sample box';
      }
    }

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

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Send registration data directly to Netlify Function
      const response = await fetch('/api/client-registration-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // Check response status before parsing JSON
      if (!response.ok) {
        const responseText = await response.text();
        console.error('Registration failed:', {
          status: response.status,
          statusText: response.statusText,
          body: responseText
        });
        throw new Error('Failed to submit registration');
      }

      const data = await response.json();

      if (!data.success) {
        console.error('Registration failed:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        throw new Error(data.error || 'Failed to submit registration');
      }

      setSubmitSuccess(true);
      
      // Track Lead event with Meta Pixel
      trackLead({
        content_name: 'Client Registration Form',
        content_category: 'registration',
        value: 1,
        currency: 'USD'
      });
      
      setFormData({
        company: '',
        contact: '',
        role: '',
        email: '',
        phone: '',
        country: '',
        countryOther: '',
        website: '',
        instagram: '',
        facebook: '',
        tiktok: '',
        businessType: '',
        interests: [],
        interestPrivateLabel: false,
        interestDistribution: false,
        interestInfluencer: false,
        bottleSizes: [],
        jarSizes: [],
        monthlyVolume: '',
        vatEori: '',
        billingAddress: '',
        shippingAddress: '',
        sameAsBilling: false,
        requestSampleBox: false,
        street: '',
        district: '',
        postalCode: '',
        language: 'EN',
        notes: '',
        gdprConsent: false,
        privacyPolicyAccepted: false,
        marketingConsent: false,
        honeypot: '',
        client_type: 'Distributors',
        // Distributors fields
        countries_covered: '',
        distribution_channels: '',
        estimated_monthly_volume: '',
        // Private Label fields
        brand_name: '',
        product_interest: '',
        target_moq: '',
        target_launch_date: '',
        // Influencers fields
        country_audience: '',
        avg_views: ''
      });
      setErrors({});

      setTimeout(() => setSubmitSuccess(false), 10000);
    } catch (error) {
      console.error('Error submitting registration:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      setSubmitError('Something went wrong while sending your registration. Please try again in a few minutes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.company && formData.contact && formData.email &&
                      validateEmail(formData.email) && formData.country &&
                      formData.businessType && formData.gdprConsent && formData.privacyPolicyAccepted &&
                      (formData.interestPrivateLabel || formData.interestDistribution) &&
                      formData.interests.length > 0 &&
                      (formData.country !== 'Other' || formData.countryOther.trim()) &&
                      (!formData.requestSampleBox || (
                        formData.street.trim() && formData.district.trim() && 
                        formData.postalCode.trim() && formData.phone.trim()
                      ));

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
                Phone Number{formData.requestSampleBox && <span className="text-red-500"> *</span>}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={formData.country === 'Other' ? '+___' : '+1 234 567 8900'}
                aria-required={formData.requestSampleBox}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.phone}
                </p>
              )}
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
                <option value="Other">Other</option>
              </select>
              {errors.country && (
                <p id="country-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.country}
                </p>
              )}
              {formData.country === 'Other' && (
                <div className="mt-3">
                  <label htmlFor="countryOther" className="block text-sm font-medium text-gray-900 mb-2">
                    Please specify country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="countryOther"
                    name="countryOther"
                    value={formData.countryOther}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.countryOther ? 'border-red-500' : 'border-gray-300'
                    }`}
                    aria-required="true"
                    aria-invalid={!!errors.countryOther}
                    aria-describedby={errors.countryOther ? 'countryOther-error' : undefined}
                  />
                  {errors.countryOther && (
                    <p id="countryOther-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.countryOther}
                    </p>
                  )}
                </div>
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
                Business Interest <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    id="interestPrivateLabel"
                    name="interestPrivateLabel"
                    checked={formData.interestPrivateLabel}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900">Private Label</span>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    id="interestDistribution"
                    name="interestDistribution"
                    checked={formData.interestDistribution}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900">Distribution</span>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    id="interestInfluencer"
                    name="interestInfluencer"
                    checked={formData.interestInfluencer}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900">Influencer</span>
                </label>
              </div>
              {errors.businessInterest && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {errors.businessInterest}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Product Interests <span className="text-red-500">*</span>
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
              {errors.productInterests && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {errors.productInterests}
                </p>
              )}
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
                  VAT Registration number
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
                  disabled={formData.sameAsBilling}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
                    formData.sameAsBilling ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  id="sameAsBilling"
                  name="sameAsBilling"
                  checked={formData.sameAsBilling}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-900">Shipping address is the same as billing address</span>
              </label>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="requestSampleBox"
                  name="requestSampleBox"
                  checked={formData.requestSampleBox}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-base font-semibold text-gray-900">Request a sample box</span>
              </label>
              <p className="mt-2 ml-8 text-sm text-gray-700">
                Sample boxes are subject to a minimum charge plus shipping costs.
              </p>
            </div>

            {formData.requestSampleBox && (
              <div className="space-y-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Shipping Details</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-900 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.street ? 'border-red-500' : 'border-gray-300'
                      }`}
                      aria-required="true"
                      aria-invalid={!!errors.street}
                      aria-describedby={errors.street ? 'street-error' : undefined}
                    />
                    {errors.street && (
                      <p id="street-error" className="mt-1 text-sm text-red-600" role="alert">
                        {errors.street}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-900 mb-2">
                      Suburb / District <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.district ? 'border-red-500' : 'border-gray-300'
                      }`}
                      aria-required="true"
                      aria-invalid={!!errors.district}
                      aria-describedby={errors.district ? 'district-error' : undefined}
                    />
                    {errors.district && (
                      <p id="district-error" className="mt-1 text-sm text-red-600" role="alert">
                        {errors.district}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-900 mb-2">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.postalCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      aria-required="true"
                      aria-invalid={!!errors.postalCode}
                      aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
                    />
                    {errors.postalCode && (
                      <p id="postalCode-error" className="mt-1 text-sm text-red-600" role="alert">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

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

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Your Client Type</h2>
          <div className="flex border-b border-gray-200" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'Distributors'}
              onClick={() => handleSetActiveTab('Distributors')}
              className={`flex-1 px-6 py-3 text-center font-medium transition-colors border-b-2 ${
                activeTab === 'Distributors'
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Distributors
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'PrivateLabel'}
              onClick={() => handleSetActiveTab('PrivateLabel')}
              className={`flex-1 px-6 py-3 text-center font-medium transition-colors border-b-2 ${
                activeTab === 'PrivateLabel'
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Private Label
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'Influencers'}
              onClick={() => handleSetActiveTab('Influencers')}
              className={`flex-1 px-6 py-3 text-center font-medium transition-colors border-b-2 ${
                activeTab === 'Influencers'
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Influencers
            </button>
          </div>

          {/* Hidden input for client_type */}
          <input type="hidden" name="client_type" value={formData.client_type} />

          {/* Distributors specific fields */}
          {activeTab === 'Distributors' && (
            <div className="mt-6 space-y-6" role="tabpanel">
              <h3 className="text-lg font-semibold text-gray-900">Distribution Information</h3>
              <div>
                <label htmlFor="countries_covered" className="block text-sm font-medium text-gray-900 mb-2">
                  Countries Covered
                </label>
                <input
                  type="text"
                  id="countries_covered"
                  name="countries_covered"
                  value={formData.countries_covered}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Greece, Cyprus, Bulgaria"
                />
              </div>
              <div>
                <label htmlFor="distribution_channels" className="block text-sm font-medium text-gray-900 mb-2">
                  Distribution Channels
                </label>
                <textarea
                  id="distribution_channels"
                  name="distribution_channels"
                  value={formData.distribution_channels}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="e.g., Retail stores, Online platforms, Salons"
                />
              </div>
              <div>
                <label htmlFor="estimated_monthly_volume" className="block text-sm font-medium text-gray-900 mb-2">
                  Estimated Monthly Volume
                </label>
                <input
                  type="text"
                  id="estimated_monthly_volume"
                  name="estimated_monthly_volume"
                  value={formData.estimated_monthly_volume}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 500-1000 units"
                />
              </div>
            </div>
          )}

          {/* Private Label specific fields */}
          {activeTab === 'PrivateLabel' && (
            <div className="mt-6 space-y-6" role="tabpanel">
              <h3 className="text-lg font-semibold text-gray-900">Private Label Information</h3>
              <div>
                <label htmlFor="brand_name" className="block text-sm font-medium text-gray-900 mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  id="brand_name"
                  name="brand_name"
                  value={formData.brand_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your brand name"
                />
              </div>
              <div>
                <label htmlFor="product_interest" className="block text-sm font-medium text-gray-900 mb-2">
                  Product Interest
                </label>
                <input
                  type="text"
                  id="product_interest"
                  name="product_interest"
                  value={formData.product_interest}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Gel polish, Base coat, Top coat"
                />
              </div>
              
              {/* Bottle and Jar Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Bottle Sizes (Optional)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {bottleSizeOptions.map(size => (
                    <label
                      key={size}
                      className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.bottleSizes.includes(size)}
                        onChange={() => handleBottleSizeChange(size)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-900">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Jar Sizes (Optional)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {jarSizeOptions.map(size => (
                    <label
                      key={size}
                      className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.jarSizes.includes(size)}
                        onChange={() => handleJarSizeChange(size)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-900">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="target_moq" className="block text-sm font-medium text-gray-900 mb-2">
                  Target MOQ (Minimum Order Quantity)
                </label>
                <input
                  type="text"
                  id="target_moq"
                  name="target_moq"
                  value={formData.target_moq}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 500 bottles"
                />
              </div>
              <div>
                <label htmlFor="target_launch_date" className="block text-sm font-medium text-gray-900 mb-2">
                  Target Launch Date
                </label>
                <input
                  type="text"
                  id="target_launch_date"
                  name="target_launch_date"
                  value={formData.target_launch_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Q2 2026, March 2026"
                />
              </div>
            </div>
          )}

          {/* Influencers specific fields */}
          {activeTab === 'Influencers' && (
            <div className="mt-6 space-y-6" role="tabpanel">
              <h3 className="text-lg font-semibold text-gray-900">Influencer Information</h3>
              
              {/* Social Media Handles */}
              <div className="space-y-4">
                <h4 className="text-base font-medium text-gray-900">Social Media Handles <span className="text-red-500">*</span></h4>
                <p className="text-sm text-gray-600">At least one social media handle is required for influencers</p>
                
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.socialMedia ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="@yourhandle"
                    aria-invalid={errors.socialMedia ? 'true' : 'false'}
                    aria-describedby={errors.socialMedia ? 'socialMedia-error' : undefined}
                  />
                </div>

                <div>
                  <label htmlFor="tiktok" className="block text-sm font-medium text-gray-900 mb-2">
                    TikTok Handle
                  </label>
                  <input
                    type="text"
                    id="tiktok"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.socialMedia ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="@yourhandle"
                    aria-invalid={errors.socialMedia ? 'true' : 'false'}
                    aria-describedby={errors.socialMedia ? 'socialMedia-error' : undefined}
                  />
                  {errors.socialMedia && (
                    <p id="socialMedia-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.socialMedia}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="country_audience" className="block text-sm font-medium text-gray-900 mb-2">
                  Country Audience
                </label>
                <input
                  type="text"
                  id="country_audience"
                  name="country_audience"
                  value={formData.country_audience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., United States, United Kingdom"
                />
              </div>
              <div>
                <label htmlFor="avg_views" className="block text-sm font-medium text-gray-900 mb-2">
                  Average Views/Engagement
                </label>
                <input
                  type="text"
                  id="avg_views"
                  name="avg_views"
                  value={formData.avg_views}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 50k views per post, 10k followers"
                />
              </div>
            </div>
          )}
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


          </div>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
          <div className="space-y-6">
            {/* Privacy Policy Acceptance - Required */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="privacyPolicyAccepted"
                name="privacyPolicyAccepted"
                checked={formData.privacyPolicyAccepted}
                onChange={handleInputChange}
                className={`mt-1 w-5 h-5 text-primary border rounded focus:ring-primary ${
                  errors.privacyPolicyAccepted ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-required="true"
                aria-invalid={!!errors.privacyPolicyAccepted}
                aria-describedby={errors.privacyPolicyAccepted ? 'privacy-policy-error' : undefined}
              />
              <div>
                <label htmlFor="privacyPolicyAccepted" className="text-sm text-gray-900">
                  I have read and accept the{' '}
                  <a 
                    href="/privacy-policy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover underline font-medium"
                  >
                    Privacy Policy
                  </a>
                  . <span className="text-red-500">*</span>
                </label>
                {errors.privacyPolicyAccepted && (
                  <p id="privacy-policy-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.privacyPolicyAccepted}
                  </p>
                )}
              </div>
            </div>

            {/* GDPR Data Processing Consent - Required */}
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
              <div>
                <label htmlFor="gdprConsent" className="text-sm text-gray-900">
                  I agree to the processing of my data for the purpose of responding to this enquiry. <span className="text-red-500">*</span>
                </label>
                {errors.gdprConsent && (
                  <p id="gdpr-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.gdprConsent}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-600 font-light">
                  Your information is used only to respond to your enquiry. We respect your privacy and will never share your data with third parties.
                </p>
              </div>
            </div>

            {/* Marketing Communications - Optional */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="marketingConsent"
                name="marketingConsent"
                checked={formData.marketingConsent}
                onChange={handleInputChange}
                className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="marketingConsent" className="text-sm text-gray-900">
                I agree to receive marketing communications from Leeukopf Laboratories. (Optional)
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="px-12 py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </div>
      </form>
    </PageTemplate>
  );
}
