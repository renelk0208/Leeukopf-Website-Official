import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DistributorLocation {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
}

interface Distributor {
  country: string;
  coordinates: string; // For Google Maps embed
  locations?: DistributorLocation[];
}

// Countries with distributor information (in alphabetical order)
const distributorCountries: Distributor[] = [
  { 
    country: 'Belgium',
    coordinates: '50.8503,4.3517', // Brussels
    locations: [
      {
        name: 'GEL.IT.UP Belgium',
        address: 'Gentsesteenweg 200, 9800 Deinze, Belgium',
        phone: '+32 484963975'
      }
    ]
  },
  { 
    country: 'Bulgaria',
    coordinates: '42.6977,23.3219', // Sofia
    locations: [
      {
        name: 'GEL.IT.UP Bulgaria',
        address: 'Bulgaria',
        phone: '+359876850055',
        email: 'sales@gelitup.bg',
        website: 'https://gelitup.bg'
      }
    ]
  },
  { 
    country: 'Cyprus',
    coordinates: '35.1264,33.4299' // Nicosia
  },
  { 
    country: 'France',
    coordinates: '48.8566,2.3522', // Paris
    locations: [
      {
        name: 'GEL.IT.UP France',
        address: '7 Rue du Chemin Blanc, 63800 Cournon d\'Auvergne, France',
        phone: '(+33) 0473845460',
        email: 'info@gelitup.fr',
        website: 'https://gelitup.fr/'
      }
    ]
  },
  { 
    country: 'Greece',
    coordinates: '37.9838,23.7275', // Athens
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
      },
      {
        name: 'Comoprof',
        address: '5 Pyrsinella Vasileiou Street, Ioannina 453 32, Greece',
        phone: '+30 2651 039850',
        email: 'info@comoprof.gr',
        website: 'https://www.comoprof.gr/'
      },
      {
        name: 'Sonothing',
        address: '3 Thanou Mikroutsikou Street (134 Knossou Avenue), Heraklion, Crete',
        phone: '+30 2810324235',
        email: 'info@sonothing.gr',
        website: 'https://www.sonothing.gr/'
      },
      {
        name: 'Bagatouris',
        address: '48 Vasilissis Olgas Avenue, Thessaloniki 546 42, Greece',
        phone: '+30 2311824834',
        email: 'info@beautycompany.gr',
        website: 'https://beautycompany.gr'
      }
    ]
  },
  { 
    country: 'Kingdom of Saudi Arabia',
    coordinates: '24.7136,46.6753' // Riyadh
  },
  { 
    country: 'Qatar',
    coordinates: '25.2854,51.5310' // Doha
  },
  { 
    country: 'United States',
    coordinates: '40.7128,-74.0060' // New York
  }
];

export default function DistributorMap() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Get the selected distributor data
  const selectedDistributor = selectedCountry 
    ? distributorCountries.find(d => d.country === selectedCountry)
    : null;

  // Generate map URL based on selected country
  const getMapUrl = () => {
    if (selectedDistributor && selectedDistributor.coordinates) {
      return `https://www.google.com/maps?q=${selectedDistributor.coordinates}&output=embed&z=6`;
    }
    // Default world view centered on Europe
    return "https://www.google.com/maps?q=Europe&output=embed&z=3";
  };

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country === selectedCountry ? null : country);
  };

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
            key={getMapUrl()} // Force re-render when URL changes
            src={getMapUrl()}
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
        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
          Current Distributor Locations - Click to View Details
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {distributorCountries.map((distributor) => (
            <button
              key={distributor.country}
              onClick={() => handleCountryClick(distributor.country)}
              className={`flex items-center space-x-2 p-3 rounded-lg border transition-all ${
                selectedCountry === distributor.country
                  ? 'bg-primary text-white border-primary shadow-lg scale-105'
                  : 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40 text-gray-900'
              }`}
            >
              <MapPin className={`w-4 h-4 flex-shrink-0 ${
                selectedCountry === distributor.country ? 'text-white' : 'text-primary'
              }`} />
              <span className="text-sm font-medium text-left">{distributor.country}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected country distributor details */}
      {selectedDistributor?.locations && selectedDistributor.locations.length > 0 && (
        <div className="mb-6 p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            {selectedDistributor.country} Distributors
          </h4>
          <div className="space-y-4">
            {selectedDistributor.locations.map((location, index) => (
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
                      {location.website.replace('https://', '').replace('www.', '')}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to action - pink/primary themed with centered layout */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-primary to-primary/90 text-white rounded-lg text-center">
        <h4 className="text-lg sm:text-xl font-bold mb-3">
          Interested in becoming a distributor?
        </h4>
        <p className="text-sm sm:text-base mb-6 leading-relaxed text-white/90">
          Contact us to discuss partnership opportunities in your region and join our growing global network.
        </p>
        <button
          onClick={() => navigate('/client-registration')}
          className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg text-base transition-colors duration-200 inline-flex items-center justify-center min-h-[48px]"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}
