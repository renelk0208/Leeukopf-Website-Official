import { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';

interface DistributorLocation {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
}

interface Distributor {
  country: string;
  coordinates: { lat: number; lng: number }; // Google Maps coordinates
  locations?: DistributorLocation[]; // Multiple distributor locations per country
}

// Countries with geocoded coordinates (in alphabetical order)
const distributorCountries: Distributor[] = [
  { country: 'Belgium', coordinates: { lat: 50.8503, lng: 4.3517 } },
  { country: 'Bulgaria', coordinates: { lat: 42.6977, lng: 23.3219 } },
  { country: 'Cyprus', coordinates: { lat: 35.1264, lng: 33.4299 } },
  { country: 'France', coordinates: { lat: 48.8566, lng: 2.3522 } },
  { 
    country: 'Greece', 
    coordinates: { lat: 37.9838, lng: 23.7275 },
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
        phone: '+302102914373',
        email: 'orders@gelitup.gr',
        website: 'https://gelitup.gr'
      }
    ]
  },
  { country: 'Kingdom of Saudi Arabia', coordinates: { lat: 24.7136, lng: 46.6753 } },
  { country: 'Qatar', coordinates: { lat: 25.2854, lng: 51.5310 } },
  { country: 'United States', coordinates: { lat: 40.7128, lng: -74.0060 } }
];

// Custom pin component with brand color
function CustomPin() {
  return (
    <div className="relative">
      {/* Pin body */}
      <svg
        width="32"
        height="40"
        viewBox="0 0 32 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <path
          d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 40 16 40C16 40 32 24.837 32 16C32 7.163 24.837 0 16 0Z"
          fill="#A3005A"
        />
        <circle cx="16" cy="16" r="6" fill="white" />
      </svg>
    </div>
  );
}

export default function DistributorMap() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<Distributor | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // If no API key or invalid key, show a fallback message
  if (!apiKey || apiKey === 'test_key_placeholder') {
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
            Click on the map pins to see more information.
          </p>
          
          {/* Google Maps */}
          <div className="relative rounded-lg overflow-hidden border border-gray-200" style={{ height: '500px' }}>
            <APIProvider apiKey={apiKey}>
              <Map
                defaultCenter={{ lat: 45, lng: 15 }}
                defaultZoom={3}
                mapId="distributor-map" // Note: This Map ID must be created in Google Cloud Console
                disableDefaultUI={false}
                gestureHandling="greedy"
                style={{ width: '100%', height: '100%' }}
              >
                {distributorCountries.map((distributor) => (
                  <AdvancedMarker
                    key={distributor.country}
                    position={distributor.coordinates}
                    onClick={() => setSelectedCountry(distributor)}
                  >
                    <CustomPin />
                  </AdvancedMarker>
                ))}
                
                {/* Info Window for selected country */}
                {selectedCountry && (
                  <InfoWindow
                    position={selectedCountry.coordinates}
                    onCloseClick={() => setSelectedCountry(null)}
                  >
                    <div className="p-2 max-w-xs">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        {selectedCountry.country}
                      </h4>
                      {selectedCountry.locations && selectedCountry.locations.length > 0 ? (
                        <div className="space-y-3">
                          {selectedCountry.locations.map((location, index) => (
                            <div key={index} className="text-xs border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                              <p className="font-semibold text-gray-900 mb-1">{location.name}</p>
                              <p className="text-gray-600 mb-1">{location.address}</p>
                              {location.phone && (
                                <p className="text-gray-600">Tel: {location.phone}</p>
                              )}
                              {location.email && (
                                <p className="text-gray-600">
                                  <a href={`mailto:${location.email}`} className="hover:text-primary">
                                    {location.email}
                                  </a>
                                </p>
                              )}
                              {location.website && (
                                <p className="text-gray-600">
                                  <a 
                                    href={location.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-primary underline"
                                  >
                                    Website
                                  </a>
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 italic">
                          Contact details coming soon
                        </p>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          </div>

          {/* Country list below the map */}
          <div className="mt-6">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Distributor Locations</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {distributorCountries.map((distributor) => (
                <button
                  key={distributor.country}
                  onClick={() => setSelectedCountry(distributor)}
                  className="flex items-center space-x-2 p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 hover:border-primary hover:bg-primary/10 transition-colors text-left"
                >
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900">{distributor.country}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-900">Interested in becoming a distributor?</span> 
              <br className="sm:hidden" />
              <span className="inline sm:ml-1">Contact us to discuss partnership opportunities in your region and join our growing global network.</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
