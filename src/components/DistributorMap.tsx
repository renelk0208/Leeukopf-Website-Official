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
    coordinates: '43.8563,25.9568', // Ruse
    locations: [
      {
        name: 'GEL.IT.UP Bulgaria and GEL.IT.UP Nails School',
        address: 'INFINITY NAILS Ltd., Midia Enos No. 3, Entrance 1, Floor 9, Ruse, UIC (Company ID): 203055670, Bulgaria',
        phone: '+359876850055',
        email: 'gelitup_professional@abv.bg',
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
        name: 'GEL.IT.UP Greece / GEL.IT.UP Nail College',
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
      },
      {
        name: 'Centrecare',
        address: 'P.P GERMANOU 14, Thessaloniki, 54622, Greece',
        phone: '+30 2310 265200',
        email: 'Centrecare@centercare.gr'
      },
      {
        name: 'Nails Services Institute Elena Chiou',
        address: 'Greece',
        phone: '+30 2241300919, +30 2241112572',
        email: 'nsinailsgr@gmail.com'
      },
      {
        name: 'Master Educator Nails Artist and Podology Trade and Training Center',
        address: 'Karpathoy 17, RHODES, 85100, Greece'
      },
      {
        name: 'HairMod - Vrettakos Panagiotis',
        address: 'Ippodamou 8 Patra, Patra, 26442, Greece',
        phone: '+30 2614008088',
        email: 'info@hairmod.gr'
      }
    ]
  },
  { 
    country: 'Kingdom of Saudi Arabia',
    coordinates: '21.5433,39.1728', // Jeddah
    locations: [
      {
        name: 'GEL.IT.UP Saudi Arabia - BEAUTY ADDRESS TRADING CO.LTD',
        address: 'AL KHAYAT CENTER, AL TAHLIA STREET ROLEX BOUTIQUE, 2ND FLOOR # 405, Jeddah, 23322, Kingdom of Saudi Arabia',
        phone: '+966 55 337 4320'
      }
    ]
  },
  { 
    country: 'Qatar',
    coordinates: '25.4052,51.4892', // Lusail City
    locations: [
      {
        name: 'GEL.IT.UP Qatar',
        address: 'Burj Marina Tower, 11th Floor, Bldg. No-108 Street-303, Zone-69, PO Box-5774 Lusail City Doha, Qatar',
        phone: '+974 4418 0270'
      }
    ]
  },
  { 
    country: 'United States',
    coordinates: '25.7907,-80.1300', // Miami Beach, FL
    locations: [
      {
        name: 'GEL.IT.UP USA',
        address: '400 Alton Rd Ste 105, Miami Beach, FL 33139',
        phone: '(+1) 786 395-8506, (+1) 786 200-2062',
        email: 'usagelitup@gmail.com',
        website: 'www.gelitup.us.com'
      }
    ]
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
    if (selectedDistributor?.coordinates) {
      return `https://www.google.com/maps?q=${selectedDistributor.coordinates}&output=embed&z=6`;
    }
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
          Current Distributor Locations
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

      {/* Selected country name shown above map when active */}
      {selectedDistributor && (
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
          <MapPin className="w-4 h-4" />
          <span>{selectedDistributor.country}</span>
          <button
            onClick={() => { setSelectedCountry(null); }}
            className="ml-2 text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Reset
          </button>
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
