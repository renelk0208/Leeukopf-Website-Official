import PageTemplate from '../components/PageTemplate';
import ProductCarousel from '../components/ProductCarousel';

export default function OurBrandsPage() {
  // Array of at least 30 product images for the carousel
  const carouselImages = [
    { src: '/1280x1280_DH-113_10ml.jpg', alt: 'GEL.IT.UP Gel Polish 10ml' },
    { src: '/1280x1280_DH-1294A_13ml.jpg', alt: 'GEL.IT.UP Gel Polish 13ml' },
    { src: '/1280x1280_DH-134.jpg', alt: 'GEL.IT.UP Gel Polish' },
    { src: '/1280x1280_DH-1716.jpg', alt: 'GEL.IT.UP Gel Polish' },
    { src: '/1280x1280_DH-1882_9ml.jpg', alt: 'GEL.IT.UP Gel Polish 9ml' },
    { src: '/1280x1280_DH-2833_10ml.jpg', alt: 'GEL.IT.UP Gel Polish 10ml' },
    { src: '/1280x1280_DH-294.jpg', alt: 'GEL.IT.UP Gel Polish' },
    { src: '/1280x1280_DH-3019_9mljpg.jpg', alt: 'GEL.IT.UP Gel Polish 9ml' },
    { src: '/1280x1280_DH-31_7ml.jpg', alt: 'GEL.IT.UP Gel Polish 7ml' },
    { src: '/1280x1280_DH-3308_15ml.jpg', alt: 'GEL.IT.UP Gel Polish 15ml' },
    { src: '/1280x1280_DH-3387.jpg', alt: 'GEL.IT.UP Gel Polish' },
    { src: '/1280x1280_DH-357_10ml.jpg', alt: 'GEL.IT.UP Gel Polish 10ml' },
    { src: '/1280x1280_DH-359.jpg', alt: 'GEL.IT.UP Gel Polish' },
    { src: '/1280x1280_DH-426A.jpg', alt: 'GEL.IT.UP Gel Polish' },
    { src: '/1280x1280_DH-435_11ml.jpg', alt: 'GEL.IT.UP Gel Polish 11ml' },
    { src: '/1280x1280_DH-439.jpg', alt: 'GEL.IT.UP Gel Polish' },
    { src: '/1280x1280_DH-459_1.jpg', alt: 'GEL.IT.UP Gel Polish' },
    { src: '/1280x1280_DH-489.jpg', alt: 'GEL.IT.UP Gel Polish' },
    { src: '/1280x1280_DH-614_11ml.jpg', alt: 'GEL.IT.UP Gel Polish 11ml' },
    { src: '/1280x1280_DH-62133_10ml.jpg', alt: 'GEL.IT.UP Gel Polish 10ml' },
    { src: '/1280x1280_DH-688_15ml.jpg', alt: 'GEL.IT.UP Gel Polish 15ml' },
    { src: '/1280x1280_DH-93A_8ml.jpg', alt: 'GEL.IT.UP Gel Polish 8ml' },
    { src: '/1280x1280_DH-9A.jpg', alt: 'GEL.IT.UP Gel Polish' },
    { src: '/1280x1280_DH-9A_7ml.jpg', alt: 'GEL.IT.UP Gel Polish 7ml' },
    { src: '/1280x1280_DH_11ml.jpg', alt: 'GEL.IT.UP Gel Polish 11ml' },
    { src: '/1280x1280_DH_8ml.jpg', alt: 'GEL.IT.UP Gel Polish 8ml' },
    { src: '/1280x1280_bottles_DH-1115.jpg', alt: 'GEL.IT.UP Bottle' },
    { src: '/1280x1280_bottles_DH-113A.jpg', alt: 'GEL.IT.UP Bottle' },
    { src: '/1280x1280_bottles_DH-1576.jpg', alt: 'GEL.IT.UP Bottle' },
    { src: '/1280x1280_bottles_DH-1622.jpg', alt: 'GEL.IT.UP Bottle' },
    { src: '/1280x1280_bottles_DH-1861.jpg', alt: 'GEL.IT.UP Bottle' },
    { src: '/1280x1280_bottles_DH-227.jpg', alt: 'GEL.IT.UP Bottle' },
    { src: '/1280x1280_bottles_DH-2830.jpg', alt: 'GEL.IT.UP Bottle' },
    { src: '/1280x1280_bottles_DH-3346.jpg', alt: 'GEL.IT.UP Bottle' },
    { src: '/1280x1280_bottles_DH-4284.jpg', alt: 'GEL.IT.UP Bottle' },
    { src: '/1280x1280_bottles_DH-430.jpg', alt: 'GEL.IT.UP Bottle' },
    { src: '/1280x1280_bottles_DH-918.jpg', alt: 'GEL.IT.UP Bottle' }
  ];

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
    >
      <div className="grid grid-cols-1 gap-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-white rounded-lg border border-gray-200">
          <div className="order-1">
            <img
              src="/GEL.IT.UP-NEW-LOGO-2024_black_2.png"
              alt="GEL.IT.UP products"
              className="w-full h-auto rounded-lg object-contain"
            />
          </div>
          <div className="flex flex-col justify-center order-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">GEL.IT.UP</h2>
            <p className="text-gray-600 font-light leading-relaxed text-lg">
              Founded in 2011, GEL.IT.UP by GIUP® is rooted in the philosophy of "Superior Innovation." We deliver top-class nail products while strictly adhering to EU regulations and global GMP (good manufacturing practices). From the start, we've been dedicated to cruelty-free practices, with Leaping Bunny certification representing the gold standard. Professionals are at the heart of our brand—our products are exclusively distributed to industry experts to maintain nail industry standards. We emphasize personalized 1-on-1 customer service, keeping our rapidly growing global distributor network like a family. We actively promote environmental responsibility through our Waste Management Program, encouraging recycling of gel polish bottles from any brand. Inclusivity is a core value—we welcome everyone regardless of age, race, or gender. Our vision is for a healthier planet, sustainable beauty, and respect for diversity.
            </p>
            <div className="mt-6">
              <a
                href="https://www.gelitup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 font-semibold hover:text-blue-900 inline-block"
              >
                Explore GEL.IT.UP →
              </a>
            </div>
          </div>
        </div>

        {/* Product Carousel Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Product Collection</h3>
          <ProductCarousel images={carouselImages} autoPlay={true} autoPlayInterval={3000} />
        </div>
      </div>
    </PageTemplate>
  );
}
