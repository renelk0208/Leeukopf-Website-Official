import { useState } from 'react';
import PageTemplate from '../../components/PageTemplate';
import { ExternalLink } from 'lucide-react';

export default function GelItUpPage() {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const brandImages = [
    { src: '/img/brands/gelitup/Gelitup1 (1).jpg', alt: 'GEL.IT.UP Product Image 1' },
    { src: '/img/brands/gelitup/Gelitup1 (2).jpg', alt: 'GEL.IT.UP Product Image 2' },
    { src: '/img/brands/gelitup/Gelitup1 (3).jpg', alt: 'GEL.IT.UP Product Image 3' },
    { src: '/img/brands/gelitup/Gelitup1 (4).jpg', alt: 'GEL.IT.UP Product Image 4' },
    { src: '/img/brands/gelitup/Gelitup1 (5).jpg', alt: 'GEL.IT.UP Product Image 5' },
    { src: '/img/brands/gelitup/Gelitup1 (6).jpg', alt: 'GEL.IT.UP Product Image 6' },
    { src: '/img/brands/gelitup/Gelitup1 (7).jpg', alt: 'GEL.IT.UP Product Image 7' },
    { src: '/img/brands/gelitup/Gelitup1 (8).jpg', alt: 'GEL.IT.UP Product Image 8' },
    { src: '/img/brands/gelitup/Gelitup1 (9).jpg', alt: 'GEL.IT.UP Product Image 9' },
    { src: '/img/brands/gelitup/Gelitup1 (10).jpg', alt: 'GEL.IT.UP Product Image 10' },
    { src: '/img/brands/gelitup/Gelitup1 (70).jpg', alt: 'GEL.IT.UP Product Image 11' },
    { src: '/img/brands/gelitup/Gelitup1 (71).jpg', alt: 'GEL.IT.UP Product Image 12' },
    { src: '/img/brands/gelitup/Gelitup1 (76).jpg', alt: 'GEL.IT.UP Product Image 13' },
    { src: '/img/brands/gelitup/Gelitup1 (78).jpg', alt: 'GEL.IT.UP Product Image 14' },
    { src: '/img/brands/gelitup/Gelitup1 (79).jpg', alt: 'GEL.IT.UP Product Image 15' },
    { src: '/img/brands/gelitup/Gelitup1 (89).jpg', alt: 'GEL.IT.UP Product Image 16' },
    { src: '/img/brands/gelitup/Gelitup1 (91).jpg', alt: 'GEL.IT.UP Product Image 17' },
    { src: '/img/brands/gelitup/Gelitup1 (92).jpg', alt: 'GEL.IT.UP Product Image 18' },
    { src: '/img/brands/gelitup/Gelitup1 (93).jpg', alt: 'GEL.IT.UP Product Image 19' },
    { src: '/img/brands/gelitup/Gelitup1 (94).jpg', alt: 'GEL.IT.UP Product Image 20' },
    { src: '/img/brands/gelitup/Gelitup1 (100).jpg', alt: 'GEL.IT.UP Product Image 21' },
    { src: '/img/brands/gelitup/Gelitup1 (102).jpg', alt: 'GEL.IT.UP Product Image 22' },
    { src: '/img/brands/gelitup/Gelitup1 (105).jpg', alt: 'GEL.IT.UP Product Image 23' },
    { src: '/img/brands/gelitup/Gelitup1 (106).jpg', alt: 'GEL.IT.UP Product Image 24' },
    { src: '/img/brands/gelitup/Gelitup1 (107).jpg', alt: 'GEL.IT.UP Product Image 25' },
    { src: '/img/brands/gelitup/Gelitup1 (108).jpg', alt: 'GEL.IT.UP Product Image 26' },
    { src: '/img/brands/gelitup/Gelitup1 (111).jpg', alt: 'GEL.IT.UP Product Image 27' },
    { src: '/img/brands/gelitup/Gelitup1 (112).jpg', alt: 'GEL.IT.UP Product Image 28' },
    { src: '/img/brands/gelitup/Gelitup1 (113).jpg', alt: 'GEL.IT.UP Product Image 29' },
    { src: '/img/brands/gelitup/Gelitup1 (114).jpg', alt: 'GEL.IT.UP Product Image 30' },
    { src: '/img/brands/gelitup/Gelitup1 (118).jpg', alt: 'GEL.IT.UP Product Image 31' },
    { src: '/img/brands/gelitup/Gelitup1 (119).jpg', alt: 'GEL.IT.UP Product Image 32' },
    { src: '/img/brands/gelitup/Gelitup1 (120).jpg', alt: 'GEL.IT.UP Product Image 33' },
    { src: '/img/brands/gelitup/Gelitup1 (121).jpg', alt: 'GEL.IT.UP Product Image 34' },
    { src: '/img/brands/gelitup/Gelitup1 (122).jpg', alt: 'GEL.IT.UP Product Image 35' },
    { src: '/img/brands/gelitup/Gelitup1 (125).jpg', alt: 'GEL.IT.UP Product Image 36' },
    { src: '/img/brands/gelitup/Gelitup1 (126).jpg', alt: 'GEL.IT.UP Product Image 37' },
    { src: '/img/brands/gelitup/Gelitup1 (130).jpg', alt: 'GEL.IT.UP Product Image 38' },
  ];

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <PageTemplate
      title="GEL.IT.UP"
      subtitle="Premium gel polish system with exceptional durability and shine. Professional quality for salon and home use."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Brands', path: '/our-brands' },
        { label: 'GEL.IT.UP' }
      ]}
    >
      {/* Brand Logo Section */}
      <div className="mb-16 text-center">
        <div className="max-w-md mx-auto mb-8">
          <img
            src="/GEL.IT.UP-NEW-LOGO-2024_black_2.png"
            alt="GEL.IT.UP Logo"
            className="w-full h-auto"
          />
        </div>
        <p className="text-lg text-gray-600 font-light max-w-3xl mx-auto leading-relaxed mb-6">
          GEL.IT.UP represents the pinnacle of gel polish innovation, combining cutting-edge formulation 
          technology with stunning color collections. Trusted by professionals worldwide for its 
          exceptional performance and long-lasting results.
        </p>
        <a
          href="https://www.gelitup.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <ExternalLink size={18} className="mr-2" />
          Visit www.gelitup.com
        </a>
      </div>

      {/* Brand Story Section */}
      <div className="mb-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">About GEL.IT.UP</h2>
        <div className="max-w-4xl mx-auto space-y-4 text-gray-600 font-light leading-relaxed">
          <p>
            GEL.IT.UP is more than just a gel polish brand—it's a commitment to excellence in nail care. 
            Our formulas are crafted with precision, ensuring vibrant colors that last and nails that stay healthy.
          </p>
          <p>
            Every product in the GEL.IT.UP line undergoes rigorous testing to meet the highest standards 
            of quality and performance. From classic shades to trendsetting colors, our collection offers 
            something for every style and occasion.
          </p>
        </div>
      </div>

      {/* Product Gallery Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Explore GEL.IT.UP</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {brandImages.map((image, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {imageErrors[index] ? (
                  <div className="text-center p-4">
                    <p className="text-gray-400 text-sm">Image unavailable</p>
                  </div>
                ) : (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Why Choose GEL.IT.UP</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-gray-600 font-light text-sm">
              Formulated with high-quality ingredients for superior performance and brilliant shine.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Long-Lasting</h3>
            <p className="text-gray-600 font-light text-sm">
              Up to 3 weeks of chip-free wear with proper application and care.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Vibrant Colors</h3>
            <p className="text-gray-600 font-light text-sm">
              Extensive palette of on-trend shades with excellent pigmentation and coverage.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Application</h3>
            <p className="text-gray-600 font-light text-sm">
              Self-leveling formula for smooth, professional-looking results every time.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">LED/UV Compatible</h3>
            <p className="text-gray-600 font-light text-sm">
              Fast curing time under both LED and UV lamps for maximum convenience.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
              <span className="text-2xl">🌟</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Professional Grade</h3>
            <p className="text-gray-600 font-light text-sm">
              Trusted by nail professionals and suitable for both salon and home use.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience GEL.IT.UP?</h2>
        <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
          Contact us today to learn more about becoming a GEL.IT.UP distributor or to place your order.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center px-8 py-4 bg-white text-blue-700 rounded-md font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <ExternalLink size={20} className="mr-2" />
          Get in Touch
        </a>
      </div>
    </PageTemplate>
  );
}
