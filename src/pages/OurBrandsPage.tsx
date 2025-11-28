import PageTemplate from '../components/PageTemplate';
import OptimizedImage from '../components/OptimizedImage';
import { RESPONSIVE_SIZES } from '../lib/responsive-sizes';

// GelitUp product images - only existing images in the repo
const GELITUP_IMAGES = [
  { src: '/img/brands/gelitup/Gelitup1 (1).jpg', alt: 'GEL.IT.UP gel polish collection showcase' },
  { src: '/img/brands/gelitup/Gelitup1 (2).jpg', alt: 'GEL.IT.UP professional nail products' },
  { src: '/img/brands/gelitup/Gelitup1 (3).jpg', alt: 'GEL.IT.UP vibrant color range' },
  { src: '/img/brands/gelitup/Gelitup1 (5).jpg', alt: 'GEL.IT.UP premium gel polish bottles' },
  { src: '/img/brands/gelitup/Gelitup1 (6).jpg', alt: 'GEL.IT.UP professional nail supplies' },
  { src: '/img/brands/gelitup/Gelitup1 (7).jpg', alt: 'GEL.IT.UP color palette display' },
  { src: '/img/brands/gelitup/Gelitup1 (8).jpg', alt: 'GEL.IT.UP salon-quality products' },
  { src: '/img/brands/gelitup/Gelitup1 (9).jpg', alt: 'GEL.IT.UP gel polish application' },
  { src: '/img/brands/gelitup/Gelitup1 (10).jpg', alt: 'GEL.IT.UP nail art inspiration' },
  { src: '/img/brands/gelitup/Gelitup1 (71).jpg', alt: 'GEL.IT.UP trending nail colors' },
  { src: '/img/brands/gelitup/Gelitup1 (76).jpg', alt: 'GEL.IT.UP professional-grade formulas' },
  { src: '/img/brands/gelitup/Gelitup1 (79).jpg', alt: 'GEL.IT.UP luxury nail collection' },
  { src: '/img/brands/gelitup/Gelitup1 (89).jpg', alt: 'GEL.IT.UP salon essentials' },
  { src: '/img/brands/gelitup/Gelitup1 (91).jpg', alt: 'GEL.IT.UP gel polish finish' },
  { src: '/img/brands/gelitup/Gelitup1 (92).jpg', alt: 'GEL.IT.UP nail care products' },
  { src: '/img/brands/gelitup/Gelitup1 (93).jpg', alt: 'GEL.IT.UP color innovation' },
  { src: '/img/brands/gelitup/Gelitup1 (94).jpg', alt: 'GEL.IT.UP professional results' },
  { src: '/img/brands/gelitup/Gelitup1 (100).jpg', alt: 'GEL.IT.UP complete nail system' },
  { src: '/img/brands/gelitup/Gelitup1 (105).jpg', alt: 'GEL.IT.UP gel polish durability' },
  { src: '/img/brands/gelitup/Gelitup1 (107).jpg', alt: 'GEL.IT.UP nail artistry' },
  { src: '/img/brands/gelitup/Gelitup1 (111).jpg', alt: 'GEL.IT.UP professional nail kit' },
  { src: '/img/brands/gelitup/Gelitup1 (112).jpg', alt: 'GEL.IT.UP gel polish shine' },
  { src: '/img/brands/gelitup/Gelitup1 (113).jpg', alt: 'GEL.IT.UP nail enhancement' },
  { src: '/img/brands/gelitup/Gelitup1 (114).jpg', alt: 'GEL.IT.UP color selection' },
  { src: '/img/brands/gelitup/Gelitup1 (120).jpg', alt: 'GEL.IT.UP premium nail products' },
  { src: '/img/brands/gelitup/Gelitup1 (122).jpg', alt: 'GEL.IT.UP salon quality' },
  { src: '/img/brands/gelitup/Gelitup1 (126).jpg', alt: 'GEL.IT.UP gel polish variety' },
  { src: '/img/brands/gelitup/Gelitup1 (130).jpg', alt: 'GEL.IT.UP professional collection' },
];

export default function OurBrandsPage() {

  return (
    <PageTemplate
      title="Our Brands"
      subtitle="Discover GEL.IT.UP by GIUP® - our premium professional nail brand, crafted with superior innovation and dedication to excellence."
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Our Brands' }
      ]}
      showCTA={true}
      ctaText="Become a Distributor"
      heroImage="/img/hero/our-brand-hero.jpg"
    >
      <div className="grid grid-cols-1 gap-8 sm:gap-10 md:gap-12">
        {/* Responsive brand section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 md:p-8 bg-white rounded-lg border border-gray-200">
          <div className="order-1">
            <OptimizedImage
              src="/GEL.IT.UP-NEW-LOGO-2024_black_2.png"
              alt="GEL.IT.UP products"
              width={800}
              height={400}
              sizes={RESPONSIVE_SIZES.twoColumn}
              className="w-full h-auto rounded-lg object-contain"
            />
          </div>
          <div className="flex flex-col justify-center order-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">GEL.IT.UP</h2>
            <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base md:text-lg">
              Founded in 2011, GEL.IT.UP by GIUP® is rooted in the philosophy of "Superior Innovation." We deliver top-class nail products while strictly adhering to EU regulations and global GMP (good manufacturing practices). From the start, we've been dedicated to cruelty-free practices, with Leaping Bunny certification representing the gold standard. Professionals are at the heart of our brand—our products are exclusively distributed to industry experts to maintain nail industry standards. We emphasize personalized 1-on-1 customer service, keeping our rapidly growing global distributor network like a family. We actively promote environmental responsibility through our Waste Management Program, encouraging recycling of gel polish bottles from any brand. Inclusivity is a core value—we welcome everyone regardless of age, race, or gender. Our vision is for a healthier planet, sustainable beauty, and respect for diversity.
            </p>
            <div className="mt-4 sm:mt-6">
              <a
                href="https://www.gelitup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 font-semibold hover:text-blue-900 inline-flex items-center min-h-[44px] text-sm sm:text-base"
              >
                Explore GEL.IT.UP →
              </a>
            </div>
          </div>
        </div>

        {/* Product Gallery Section - Responsive Grid */}
        <div className="mt-4 sm:mt-6 md:mt-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Our Product Collection</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {GELITUP_IMAGES.map((image, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="aspect-square p-3 sm:p-4 flex items-center justify-center bg-gray-50">
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
