import { useState } from 'react';
import { Package } from 'lucide-react';
import PageTemplate from '../components/PageTemplate';

interface JarProduct {
  id: string;
  name: string;
  description: string;
  src: string;
  alt: string;
}

const JARS: JarProduct[] = [
  {
    id: 'acrylic-jar-1',
    name: 'Acrylic Jar Style 1',
    description: 'Round acrylic jar with screw-on lid',
    src: '/jars/website_leeukopf_acrylic_jar_1.jpg',
    alt: 'Round clear acrylic jar with black screw-on lid for gel polish'
  },
  {
    id: 'acrylic-jar-2',
    name: 'Acrylic Jar Style 2',
    description: 'Wide acrylic jar with premium closure',
    src: '/jars/website_leeukopf_acrylic_jar_2.jpg',
    alt: 'Wide clear acrylic jar with premium black closure for builder gel'
  },
  {
    id: 'acrylic-jar-3',
    name: 'Acrylic Jar Style 3',
    description: 'Compact acrylic jar for travel sizes',
    src: '/jars/website_leeukopf_acrylic_jar_3.jpg',
    alt: 'Compact clear acrylic jar with black lid for travel-size products'
  },
  {
    id: 'acrylic-jar-4',
    name: 'Acrylic Jar Style 4',
    description: 'Professional acrylic jar with secure seal',
    src: '/jars/website_leeukopf_acrylic_jar_4.jpg',
    alt: 'Professional clear acrylic jar with secure seal for nail products'
  },
  {
    id: 'acrylic-jar-4-1',
    name: 'Acrylic Jar Variant 4-1',
    description: 'Premium acrylic jar with elegant design',
    src: '/jars/website_leeukopf_acrylic_jar_4_1.jpg',
    alt: 'Premium clear acrylic jar with elegant black closure design'
  },
  {
    id: 'acrylic-jar-4-2',
    name: 'Acrylic Jar Variant 4-2',
    description: 'Sleek acrylic jar for professional use',
    src: '/jars/website_leeukopf_acrylic_jar_4_2.jpg',
    alt: 'Sleek clear acrylic jar with modern design for professional nail salons'
  },
  {
    id: 'acrylic-jar-4-3',
    name: 'Acrylic Jar Variant 4-3',
    description: 'Versatile acrylic jar for various products',
    src: '/jars/website_leeukopf_acrylic_jar_4_3.jpg',
    alt: 'Versatile clear acrylic jar suitable for various nail care products'
  },
  {
    id: 'acrylic-jar-4-4',
    name: 'Acrylic Jar Variant 4-4',
    description: 'Stylish acrylic jar with modern aesthetic',
    src: '/jars/website_leeukopf_acrylic_jar_4_4.jpg',
    alt: 'Stylish clear acrylic jar with modern aesthetic and secure closure'
  },
  {
    id: 'acrylic-jar-4-5',
    name: 'Acrylic Jar Variant 4-5',
    description: 'Elegant acrylic jar for luxury brands',
    src: '/jars/website_leeukopf_acrylic_jar_4_5.jpg',
    alt: 'Elegant clear acrylic jar designed for luxury nail product brands'
  },
  {
    id: 'acrylic-jar-4-6',
    name: 'Acrylic Jar Variant 4-6',
    description: 'Contemporary acrylic jar design',
    src: '/jars/website_leeukopf_acrylic_jar_4_6.jpg',
    alt: 'Contemporary clear acrylic jar with sophisticated black lid'
  },
  {
    id: 'acrylic-jar-4-7',
    name: 'Acrylic Jar Variant 4-7',
    description: 'Refined acrylic jar for premium lines',
    src: '/jars/website_leeukopf_acrylic_jar_4_7.jpg',
    alt: 'Refined clear acrylic jar perfect for premium product lines'
  },
  {
    id: 'acrylic-jar-6',
    name: 'Acrylic Jar Style 6',
    description: 'Classic acrylic jar with timeless design',
    src: '/jars/website_leeukopf_acrylic_jar_6.jpg',
    alt: 'Classic clear acrylic jar with timeless design and black lid'
  },
  {
    id: 'acrylic-jar-7',
    name: 'Acrylic Jar Style 7',
    description: 'Durable acrylic jar for daily salon use',
    src: '/jars/website_leeukopf_acrylic_jar_7.jpg',
    alt: 'Durable clear acrylic jar ideal for daily salon use'
  },
  {
    id: 'acrylic-jar-8',
    name: 'Acrylic Jar Style 8',
    description: 'Large capacity acrylic jar',
    src: '/jars/website_leeukopf_acrylic_jar_8.jpg',
    alt: 'Large capacity clear acrylic jar for bulk products'
  },
  {
    id: 'acrylic-jar-9',
    name: 'Acrylic Jar Style 9',
    description: 'Standard acrylic jar with reliable seal',
    src: '/jars/website_leeukopf_acrylic_jar_9.jpg',
    alt: 'Standard clear acrylic jar with reliable sealing mechanism'
  },
  {
    id: 'acrylic-jar-10',
    name: 'Acrylic Jar Style 10',
    description: 'Professional-grade acrylic jar',
    src: '/jars/website_leeukopf_acrylic_jar_10.jpg',
    alt: 'Professional-grade clear acrylic jar for high-quality nail products'
  },
  {
    id: 'acrylic-jar-11',
    name: 'Acrylic Jar Style 11',
    description: 'Multi-purpose acrylic jar',
    src: '/jars/website_leeukopf_acrylic_jar_11.jpg',
    alt: 'Multi-purpose clear acrylic jar suitable for various applications'
  },
  {
    id: 'black-jar-1',
    name: 'Black Jar Style 1',
    description: 'Premium black jar with elegant finish',
    src: '/jars/website_leeukopf_black_jar_1.jpg',
    alt: 'Premium black acrylic jar with elegant matte finish'
  },
  {
    id: 'black-jar-2',
    name: 'Black Jar Style 2',
    description: 'Sleek black jar for luxury branding',
    src: '/jars/website_leeukopf_black_jar_2.jpg',
    alt: 'Sleek black acrylic jar perfect for luxury brand packaging'
  },
  {
    id: 'black-jar-4',
    name: 'Black Jar Style 4',
    description: 'Modern black jar with sophisticated look',
    src: '/jars/website_leeukopf_black_jar_4.jpg',
    alt: 'Modern black acrylic jar with sophisticated matte appearance'
  },
  {
    id: 'colored-jar-1',
    name: 'Colored Jar Style 1',
    description: 'Colorful jar for vibrant branding',
    src: '/jars/website_leeukopf_colored_jar_1.jpg',
    alt: 'Colorful acrylic jar available in various vibrant colors'
  },
  {
    id: 'colored-jar-1-2',
    name: 'Colored Jar Variant 1-2',
    description: 'Custom colored jar option',
    src: '/jars/website_leeukopf_colored_jar_1_2.jpg',
    alt: 'Custom colored acrylic jar for unique brand identity'
  },
  {
    id: 'colored-jar-1-3',
    name: 'Colored Jar Variant 1-3',
    description: 'Tinted jar with premium appearance',
    src: '/jars/website_leeukopf_colored_jar_1_3.jpg',
    alt: 'Tinted acrylic jar with premium colored finish'
  },
  {
    id: 'colored-jar-1-4',
    name: 'Colored Jar Variant 1-4',
    description: 'Designer colored jar option',
    src: '/jars/website_leeukopf_colored_jar_1_4.jpg',
    alt: 'Designer colored acrylic jar for distinctive packaging'
  },
  {
    id: 'colored-jar-1-5',
    name: 'Colored Jar Variant 1-5',
    description: 'Specialty colored jar design',
    src: '/jars/website_leeukopf_colored_jar_1_5.jpg',
    alt: 'Specialty colored acrylic jar with unique hue'
  },
  {
    id: 'colored-jar-1-6',
    name: 'Colored Jar Variant 1-6',
    description: 'Fashionable colored jar',
    src: '/jars/website_leeukopf_colored_jar_1_6.jpg',
    alt: 'Fashionable colored acrylic jar for trendy brands'
  },
  {
    id: 'colored-jar-1-7',
    name: 'Colored Jar Variant 1-7',
    description: 'Exclusive colored jar finish',
    src: '/jars/website_leeukopf_colored_jar_1_7.jpg',
    alt: 'Exclusive colored acrylic jar with premium finish'
  },
  {
    id: 'white-jar-1',
    name: 'White Jar Style 1',
    description: 'Pure white jar with clean aesthetic',
    src: '/jars/website_leeukopf_white_jar_1.jpg',
    alt: 'Pure white acrylic jar with clean and minimal aesthetic'
  },
  {
    id: 'white-jar-2',
    name: 'White Jar Style 2',
    description: 'Elegant white jar for premium lines',
    src: '/jars/website_leeukopf_white_jar_2.jpg',
    alt: 'Elegant white acrylic jar ideal for premium product lines'
  },
  {
    id: 'hexagonal-jar-1',
    name: 'Hexagonal Jar',
    description: 'Unique hexagonal design for standout branding',
    src: '/jars/website_leeukopf_hexagonal_jar_1.jpg',
    alt: 'Unique hexagonal acrylic jar for distinctive brand packaging'
  }
];

export default function PrivateLabelJarsPage() {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (jarId: string) => {
    setImageErrors(prev => new Set(prev).add(jarId));
  };

  return (
    <PageTemplate
      title="Private Label Jars"
      subtitle="Premium acrylic and glass jars for gel polish, builder gel, and other nail products. Perfect for custom branding."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Private Label', path: '/private-label' },
        { label: 'Jars' }
      ]}
    >
      <div className="space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {JARS.map((jar) => (
            <div
              key={jar.id}
              className="group cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-square bg-gray-50 relative overflow-hidden">
                {imageErrors.has(jar.id) ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    <Package size={48} className="text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500 text-center">Image not available</p>
                  </div>
                ) : (
                  <img
                    src={jar.src}
                    alt={jar.alt}
                    loading="lazy"
                    onError={() => handleImageError(jar.id)}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{jar.name}</h3>
                <p className="text-sm text-gray-600 font-light">{jar.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
            <button className="px-8 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors">
              Request Jar Specifications
            </button>
            <button className="px-8 py-3 bg-white border-2 border-blue-800 text-blue-800 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
              Get Pricing
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 font-light">
            Available in multiple sizes • Custom colors available • Glossy and matte finishes
          </p>
        </div>
      </div>
    </PageTemplate>
  );
}
