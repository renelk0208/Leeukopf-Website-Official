import { Link } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';

export default function OurBrandsPage() {
  const brands = [
    {
      name: 'GEL.IT.UP',
      description: 'Premium gel polish system with exceptional durability and shine. Professional quality for salon and home use.',
      path: '/our-brands/gel-it-up',
      image: '/GEL.IT.UP-NEW-LOGO-2024_black_2.png'
    },
    {
      name: 'Gender Neutral',
      description: 'Inclusive beauty products designed for everyone. Breaking boundaries in nail care with universal appeal.',
      path: '/our-brands/gender-neutral',
      image: '/gn_logo.png'
    },
    {
      name: 'The Gel Crew',
      description: 'Professional-grade gel systems trusted by nail technicians. Complete solutions for modern nail artistry.',
      path: '/our-brands/the-gel-crew',
      image: '/gel_crew_ad_post2.jpg'
    }
  ];

  return (
    <PageTemplate
      title="Our Brands"
      subtitle="Discover our family of professional beauty brands, each crafted with precision and passion."
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
