import { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';

interface Distributor {
  country: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Countries list - can be expanded with actual distributor information later
const distributorCountries: Distributor[] = [
  { country: 'Belgium' },
  { country: 'Bulgaria' },
  { country: 'Cyprus' },
  { country: 'France' },
  { country: 'Germany' },
  { country: 'Greece' },
  { country: 'Italy' },
  { country: 'Netherlands' },
  { country: 'Portugal' },
  { country: 'Qatar' },
  { country: 'Romania' },
  { country: 'Saudi Arabia' },
  { country: 'Spain' },
  { country: 'United Arab Emirates' },
  { country: 'United Kingdom' },
  { country: 'United States' }
];

export default function DistributorMap() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left group"
      >
        <div className="flex items-center space-x-3">
          <MapPin className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">
            Our Distributor Network
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            We're proud to work with distributors across multiple countries. 
            Contact us to learn more about partnering opportunities in your region.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {distributorCountries.map((distributor) => (
              <div
                key={distributor.country}
                className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary transition-colors"
              >
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">
                    {distributor.country}
                  </h4>
                  {distributor.contactName && (
                    <p className="text-xs text-gray-600 mt-1">
                      {distributor.contactName}
                    </p>
                  )}
                  {distributor.email && (
                    <p className="text-xs text-gray-600 truncate">
                      {distributor.email}
                    </p>
                  )}
                  {distributor.phone && (
                    <p className="text-xs text-gray-600">
                      {distributor.phone}
                    </p>
                  )}
                  {distributor.address && (
                    <p className="text-xs text-gray-500 mt-1">
                      {distributor.address}
                    </p>
                  )}
                  {!distributor.contactName && (
                    <p className="text-xs text-gray-500 italic mt-1">
                      Contact details coming soon
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Looking to become a distributor?</span> Contact us to discuss 
              partnership opportunities in your region.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
