import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDEyYzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSJyZ2JhKDU5LCAxMzAsIDE4NiwgMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div className="space-y-8">
          <div className="flex justify-center mb-8">
            <img
              src="/leeukopf_black.png"
              alt="Leeukopf Laboratories Logo"
              className="w-full max-w-2xl lg:max-w-3xl h-auto object-contain px-8"
            />
          </div>

          <p className="text-xl sm:text-2xl text-gray-800 max-w-3xl mx-auto leading-relaxed font-medium">
            Premium Gel Polish Manufacturing & Private Label Excellence
          </p>

          <p className="text-lg text-blue-600 max-w-2xl mx-auto font-medium">
            Over 4000 colors • Cruelty-Free Certified • Bulgarian Cosmetics Excellence
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Explore Our Products
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-white text-blue-600 rounded-md font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              Contact Us
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-16">
            <div className="p-8 bg-white rounded-lg border-2 border-blue-100 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2 tracking-tight">4000+</div>
              <div className="text-gray-700 font-medium">Color Options</div>
            </div>
            <div className="p-8 bg-white rounded-lg border-2 border-blue-100 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2 tracking-tight">100%</div>
              <div className="text-gray-700 font-medium">Cruelty-Free</div>
            </div>
            <div className="p-8 bg-white rounded-lg border-2 border-blue-100 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2 tracking-tight">GMP</div>
              <div className="text-gray-700 font-medium">Certified</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
