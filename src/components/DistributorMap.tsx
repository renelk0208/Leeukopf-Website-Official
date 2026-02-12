import { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp, X } from 'lucide-react';

interface Distributor {
  country: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  coordinates: { x: number; y: number }; // SVG coordinates (0-100 scale)
}

// Countries with approximate map coordinates (based on a 100x50 viewBox)
const distributorCountries: Distributor[] = [
  { country: 'Belgium', coordinates: { x: 50.5, y: 18 } },
  { country: 'Bulgaria', coordinates: { x: 56, y: 22 } },
  { country: 'Cyprus', coordinates: { x: 59, y: 27 } },
  { country: 'France', coordinates: { x: 49, y: 21 } },
  { country: 'Germany', coordinates: { x: 51.5, y: 18.5 } },
  { country: 'Greece', coordinates: { x: 55, y: 24 } },
  { country: 'Italy', coordinates: { x: 52, y: 22 } },
  { country: 'Netherlands', coordinates: { x: 50.3, y: 17.5 } },
  { country: 'Portugal', coordinates: { x: 46.5, y: 24 } },
  { country: 'Qatar', coordinates: { x: 64, y: 28 } },
  { country: 'Romania', coordinates: { x: 56.5, y: 20.5 } },
  { country: 'Saudi Arabia', coordinates: { x: 62, y: 28 } },
  { country: 'Spain', coordinates: { x: 48, y: 24 } },
  { country: 'United Arab Emirates', coordinates: { x: 65, y: 28.5 } },
  { country: 'United Kingdom', coordinates: { x: 49, y: 17 } },
  { country: 'United States', coordinates: { x: 20, y: 23 } }
];

export default function DistributorMap() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<Distributor | null>(null);

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
          
          {/* Interactive World Map */}
          <div className="relative bg-gray-50 rounded-lg p-4 border border-gray-200">
            <svg
              viewBox="0 0 100 50"
              className="w-full h-auto"
              style={{ maxHeight: '400px' }}
            >
              {/* Simplified world map background */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.1"/>
                </pattern>
              </defs>
              
              {/* Background */}
              <rect width="100" height="50" fill="#f9fafb" />
              <rect width="100" height="50" fill="url(#grid)" opacity="0.5" />
              
              {/* Simplified continents (decorative) */}
              <path
                d="M 10,15 Q 15,12 20,15 L 25,18 L 30,17 L 35,20 L 38,25 L 35,30 L 30,32 L 25,30 L 20,28 L 15,25 Z"
                fill="#d1d5db"
                opacity="0.3"
              />
              <path
                d="M 45,15 Q 50,12 55,14 L 60,16 L 65,15 L 68,18 L 70,22 L 68,26 L 65,28 L 60,27 L 55,26 L 50,24 L 45,20 Z"
                fill="#d1d5db"
                opacity="0.3"
              />
              
              {/* Distributor markers */}
              {distributorCountries.map((distributor) => (
                <g key={distributor.country}>
                  {/* Pin marker */}
                  <g
                    onClick={() => setSelectedCountry(distributor)}
                    className="cursor-pointer transition-transform hover:scale-110"
                    style={{ transformOrigin: `${distributor.coordinates.x}% ${distributor.coordinates.y}%` }}
                  >
                    {/* Pin shadow */}
                    <ellipse
                      cx={distributor.coordinates.x}
                      cy={distributor.coordinates.y + 0.8}
                      rx="0.4"
                      ry="0.2"
                      fill="rgba(0,0,0,0.2)"
                    />
                    {/* Pin body */}
                    <path
                      d={`M ${distributor.coordinates.x} ${distributor.coordinates.y - 1.5} 
                          Q ${distributor.coordinates.x - 0.8} ${distributor.coordinates.y - 1.5} 
                          ${distributor.coordinates.x - 0.8} ${distributor.coordinates.y - 0.7}
                          Q ${distributor.coordinates.x - 0.8} ${distributor.coordinates.y} 
                          ${distributor.coordinates.x} ${distributor.coordinates.y + 0.5}
                          Q ${distributor.coordinates.x + 0.8} ${distributor.coordinates.y}
                          ${distributor.coordinates.x + 0.8} ${distributor.coordinates.y - 0.7}
                          Q ${distributor.coordinates.x + 0.8} ${distributor.coordinates.y - 1.5}
                          ${distributor.coordinates.x} ${distributor.coordinates.y - 1.5} Z`}
                      fill="#dc2626"
                      stroke="#991b1b"
                      strokeWidth="0.05"
                    />
                    {/* Pin dot */}
                    <circle
                      cx={distributor.coordinates.x}
                      cy={distributor.coordinates.y - 1}
                      r="0.3"
                      fill="white"
                    />
                  </g>
                  
                  {/* Country label on hover */}
                  <text
                    x={distributor.coordinates.x}
                    y={distributor.coordinates.y + 1.5}
                    textAnchor="middle"
                    className="text-[0.8px] fill-gray-700 font-medium pointer-events-none opacity-0 hover:opacity-100 transition-opacity"
                    style={{ fontSize: '0.8px' }}
                  >
                    {distributor.country}
                  </text>
                </g>
              ))}
            </svg>
            
            {/* Selected country popup */}
            {selectedCountry && (
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs z-10">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      {selectedCountry.country}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedCountry(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
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
            )}
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
