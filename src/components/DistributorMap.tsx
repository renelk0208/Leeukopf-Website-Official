import { MapPin } from 'lucide-react';

// Temporary placeholder map URL - will be replaced with final distributor map
const MAP_IFRAME_SRC = "https://www.google.com/maps?q=Greece&output=embed";

interface DistributorLocation {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
}

interface Distributor {
  country: string;
  locations?: DistributorLocation[];
}

// Countries with distributor information (in alphabetical order)
const distributorCountries: Distributor[] = [
  { country: 'Belgium' },
  { country: 'Bulgaria' },
  { country: 'Cyprus' },
  { country: 'France' },
  { 
    country: 'Greece',
    locations: [
      {
        name: 'GEL.IT.UP Corinth',
        address: 'Sikyōnos 1, Kiato, 20200',
        phone: '+30 2742 402617',
        email: 'info@nailtalesacademy.gr',
        website: 'https://nailtalesacademy.gr/'
      },
      {
        name: 'GEL.IT.UP Greece',
        address: '4 Kalamon, Peristeri, 12131',
        phone: '+30 210 291 4373',
        email: 'orders@gelitup.gr',
        website: 'https://gelitup.gr'
      }
    ]
  },
  { country: 'Kingdom of Saudi Arabia' },
  { country: 'Qatar' },
  { country: 'United States' }
];

export default function DistributorMap() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
      <div className="flex items-center space-x-3 mb-4 sm:mb-6">
        <MapPin className="w-6 h-6 text-primary" />
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Our Global Distributor Network
        </h3>
      </div>
      <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
        We're proud to partner with professional distributors across multiple countries, bringing premium GEL.IT.UP products to markets worldwide.
      </p>
      
      {/* Map iframe embed */}
      <div className="mb-6">
        <div className="relative w-full overflow-hidden" style={{ borderRadius: '16px' }}>
          <iframe
            src={MAP_IFRAME_SRC}
            width="100%"
            height="520"
            style={{ border: 0, borderRadius: '16px' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Distributor Locations Map"
          />
        </div>
      </div>

      {/* Country list */}
      <div className="mb-6">
        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Current Distributor Locations</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {distributorCountries.map((distributor) => (
            <div
              key={distributor.country}
              className="flex items-center space-x-2 p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors"
            >
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-gray-900">{distributor.country}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Greece distributor details */}
      {distributorCountries.find(d => d.country === 'Greece')?.locations && (
        <div className="mb-6 p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Greece Distributors</h4>
          <div className="space-y-4">
            {distributorCountries.find(d => d.country === 'Greece')?.locations?.map((location, index) => (
              <div key={index} className="pb-4 last:pb-0 border-b border-gray-200 last:border-0">
                <p className="font-semibold text-gray-900 mb-2">{location.name}</p>
                <p className="text-sm text-gray-600 mb-1">{location.address}</p>
                {location.phone && (
                  <p className="text-sm text-gray-600">Tel: {location.phone}</p>
                )}
                {location.email && (
                  <p className="text-sm text-gray-600">
                    Email: <a href={`mailto:${location.email}`} className="text-primary hover:underline">{location.email}</a>
                  </p>
                )}
                {location.website && (
                  <p className="text-sm text-gray-600">
                    Website: <a 
                      href={location.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {location.website.replace('https://', '')}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg">
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          <span className="font-semibold text-gray-900">Interested in becoming a distributor?</span> 
          <br className="sm:hidden" />
          <span className="inline sm:ml-1">Contact us to discuss partnership opportunities in your region and join our growing global network.</span>
        </p>
      </div>
    </div>
  );
}
