import { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';

interface Distributor {
  country: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  coordinates: { lat: number; lng: number }; // Google Maps coordinates
}

// Countries with geocoded coordinates (in alphabetical order)
const distributorCountries: Distributor[] = [
  { country: 'Belgium', coordinates: { lat: 50.8503, lng: 4.3517 } },
  { country: 'Bulgaria', coordinates: { lat: 42.6977, lng: 23.3219 } },
  { country: 'Cyprus', coordinates: { lat: 35.1264, lng: 33.4299 } },
  { country: 'France', coordinates: { lat: 48.8566, lng: 2.3522 } },
  { country: 'Greece', coordinates: { lat: 37.9838, lng: 23.7275 } },
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

  // If no API key, show a fallback message
  if (!apiKey) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <MapPin className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">
            Our Distributor Network
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          We're proud to work with distributors across multiple countries.
        </p>
        
        {/* Country list */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Distributor Countries</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {distributorCountries.map((distributor) => (
              <div
                key={distributor.country}
                className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
              >
                <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                <span className="text-xs text-gray-900">{distributor.country}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Looking to become a distributor?</span> Contact us to discuss 
            partnership opportunities in your region.
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
                    <div className="p-2">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        {selectedCountry.country}
                      </h4>
                      {selectedCountry.contactName ? (
                        <div className="space-y-1 text-xs">
                          <p className="text-gray-600">{selectedCountry.contactName}</p>
                          {selectedCountry.email && (
                            <p className="text-gray-600">{selectedCountry.email}</p>
                          )}
                          {selectedCountry.phone && (
                            <p className="text-gray-600">{selectedCountry.phone}</p>
                          )}
                          {selectedCountry.address && (
                            <p className="text-gray-500 mt-2">{selectedCountry.address}</p>
                          )}
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
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Distributor Countries</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {distributorCountries.map((distributor) => (
                <button
                  key={distributor.country}
                  onClick={() => setSelectedCountry(distributor)}
                  className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors text-left"
                >
                  <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="text-xs text-gray-900">{distributor.country}</span>
                </button>
              ))}
            </div>
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
