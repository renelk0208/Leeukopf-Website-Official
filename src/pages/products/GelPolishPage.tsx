import { ArrowRight } from 'lucide-react';
import PageTemplate from '../../components/PageTemplate';
import ProductCarousel from '../../components/ProductCarousel';
import GelPolishCategoryGallery from '../../components/GelPolishCategoryGallery';
import { getSubcategoryImages, categoryHero } from '../../config/imageMap';

export default function GelPolishPage() {

  const autumnWinterImages = getSubcategoryImages('gel-polish', 'autumn-winter-25-26').map((src) => {
    // Extract descriptive name from filename for alt text
    const filename = src.split('/').pop() || '';
    const altText = filename
      .replace(/2026_new_collection_/gi, '')
      .replace(/_/g, ' ')
      .replace(/\.jpg$/i, '')
      .trim();
    return {
      src,
      alt: `Autumn Winter 25/26 gel polish ${altText} collection`
    };
  });

  const springSummerImages = getSubcategoryImages('gel-polish', 'spring-summer-26').map((src) => {
    // Extract descriptive name from filename for alt text
    const filename = src.split('/').pop() || '';
    const altText = filename
      .replace(/2026_spring_summer_collection_/gi, '')
      .replace(/_/g, ' ')
      .replace(/\.jpg$/i, '')
      .trim();
    return {
      src,
      alt: `Spring Summer 26 gel polish ${altText} collection`
    };
  });

  return (
    <>
      <PageTemplate
        title="Gel Polish Collection"
        subtitle="Professional gel polish systems with exceptional shine, durability, and color payoff. Perfect for salon and home use."
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Our Products', path: '/products' },
          { label: 'Gel Polish' }
        ]}
      >
        <div className="mb-10 sm:mb-12 md:mb-16">
          {/* Hero image */}
          <div className="mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
            <img
              src={categoryHero['gel-polish']}
              alt="Professional Gel Polish Collection"
              width="1600"
              height="400"
              className="category-hero"
            />
          </div>

          {/* Products CTA section - responsive */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 lg:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-4 sm:mb-6">
                <ArrowRight className="text-blue-800 w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Complete Gel Polish Catalogue</h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 font-light leading-relaxed">
                Explore our comprehensive range of gel polish products and discover our full collection of colors, finishes, and formulations.
              </p>

              <a
                href="/products/gel-polish#solid-colour-collection"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white rounded-md font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[44px] text-sm sm:text-base"
              >
                See Our Products
                <ArrowRight size={18} className="ml-2" aria-hidden="true" />
              </a>

              <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
                View our complete product catalog with detailed color charts, specifications, and application guidelines
              </p>
            </div>
          </div>
        </div>

        {/* Gel Polish Categories Gallery - directly under Complete Gel Polish Catalogue */}
        <GelPolishCategoryGallery />

        {/* Spring Summer '26 Subcategory - responsive */}
        <div className="mb-10 sm:mb-12 md:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Spring Summer '26</h3>
            <p className="text-base sm:text-lg text-gray-600 font-light max-w-2xl mx-auto px-2">
              Embrace the vibrant energy of the new season with our fresh Spring Summer collection. 
              Featuring bright florals, soft pastels, and bold neons perfect for warm weather looks.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <ProductCarousel images={springSummerImages} autoPlay={true} autoPlayInterval={4000} />
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <p className="text-xs sm:text-sm text-gray-500 italic">
              Featuring bright colors, pastels, neons, and floral designs
            </p>
          </div>
        </div>

        {/* Autumn Winter '25/26 Subcategory - responsive */}
        <div className="mb-10 sm:mb-12 md:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Autumn Winter '25/26</h3>
            <p className="text-base sm:text-lg text-gray-600 font-light max-w-2xl mx-auto px-2">
              Discover our latest seasonal collection featuring warm, sophisticated shades perfect for the colder months. 
              From rich cat eyes to festive glitters, this collection brings elegance and trend to your fingertips.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <ProductCarousel images={autumnWinterImages} autoPlay={true} autoPlayInterval={4000} />
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <p className="text-xs sm:text-sm text-gray-500 italic">
              Featuring cat eye effects, glitters, and seasonal must-haves
            </p>
          </div>
        </div>

        {/* Product features - responsive */}
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 border border-gray-200">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Product Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Long-Lasting Wear</h3>
              <p className="text-gray-600 font-light text-xs sm:text-sm">Up to 3 weeks of chip-resistant wear with proper application and base/top coat system.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">High Pigmentation</h3>
              <p className="text-gray-600 font-light text-xs sm:text-sm">Rich color payoff with excellent coverage. Many shades achieve full opacity in 1-2 coats.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Easy Application</h3>
              <p className="text-gray-600 font-light text-xs sm:text-sm">Self-leveling formula with perfect consistency. Professional results without streaking or patchiness.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">LED/UV Compatible</h3>
              <p className="text-gray-600 font-light text-xs sm:text-sm">Cures perfectly under LED and UV lamps. Quick cure times for efficient salon services.</p>
            </div>
          </div>
        </div>
      </PageTemplate>
    </>
  );
}
