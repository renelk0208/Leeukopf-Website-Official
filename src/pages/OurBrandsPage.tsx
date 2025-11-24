import { Link } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';

export default function OurBrandsPage() {
  const brands = [
    {
      name: 'GEL.IT.UP',
      description: 'Founded in 2011, GEL.IT.UP by GIUP® is rooted in the philosophy of "Superior Innovation." We deliver top-class nail products while strictly adhering to EU regulations and global GMP (good manufacturing practices). From the start, we\'ve been dedicated to cruelty-free practices, with Leaping Bunny certification representing the gold standard. Professionals are at the heart of our brand—our products are exclusively distributed to industry experts to maintain nail industry standards. We emphasize personalized 1-on-1 customer service, keeping our rapidly growing global distributor network like a family. We actively promote environmental responsibility through our Waste Management Program, encouraging recycling of gel polish bottles from any brand. Inclusivity is a core value—we welcome everyone regardless of age, race, or gender. Our vision is for a healthier planet, sustainable beauty, and respect for diversity.',
      path: '/our-brands/gel-it-up',
      image: '/GEL.IT.UP-NEW-LOGO-2024_black_2.png'
    }
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
        {brands.map((brand, index) => (
          <Link
            key={brand.path}
            to={brand.path}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-white rounded-lg border border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all duration-300"
          >
            <div className={index % 2 === 0 ? 'order-1' : 'order-1 lg:order-2'}>
              <img
                src={brand.image}
                alt={`${brand.name} products`}
                className="w-full h-auto rounded-lg object-contain"
              />
            </div>
            <div className={`flex flex-col justify-center ${index % 2 === 0 ? 'order-2' : 'order-2 lg:order-1'}`}>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{brand.name}</h2>
              <p className="text-gray-600 font-light leading-relaxed text-lg">
                {brand.description}
              </p>
              <div className="mt-6">
                <span className="text-blue-800 font-semibold hover:text-blue-900">
                  Explore {brand.name} →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageTemplate>
  );
}
