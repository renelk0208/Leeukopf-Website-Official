import { Sparkles } from 'lucide-react';

export default function Hero() {
  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDEyYzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSJyZ2JhKDIwOSwgMjEzLCAyMTksIDAuMykiLz48L2c+PC9zdmc+')] opacity-50"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div className="space-y-8">
          <div className="inline-flex items-center justify-center p-2 mb-4">
            <Sparkles className="text-primary-500" size={40} />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            LEEUKOPF
            <span className="block text-3xl sm:text-4xl lg:text-5xl text-gray-600 font-normal mt-2">
              Laboratories
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
            Premium Gel Polish Manufacturing & Private Label Excellence
          </p>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">
            Over 2000 colors • Cruelty-Free Certified • Bulgarian Cosmetics Excellence
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <button
              onClick={scrollToProducts}
              className="px-8 py-4 bg-gray-900 text-white rounded-md font-semibold hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Explore Our Products
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-white text-gray-900 rounded-md font-semibold border-2 border-gray-300 hover:border-gray-400 transition-all duration-300"
            >
              Contact Us
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-16">
            <div className="p-8 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">2000+</div>
              <div className="text-gray-600 font-light">Color Options</div>
            </div>
            <div className="p-8 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">100%</div>
              <div className="text-gray-600 font-light">Cruelty-Free</div>
            </div>
            <div className="p-8 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">GMP</div>
              <div className="text-gray-600 font-light">Certified</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
