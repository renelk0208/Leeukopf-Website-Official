import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
            Professional Gel Systems • Builder Gel • Nail Art • Bulgarian Cosmetics Excellence
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <button
              onClick={() => navigate('/products')}
              className="btn-primary px-8 py-4"
            >
              Explore Our Products
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="btn-secondary px-8 py-4"
            >
              Contact Us
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto pt-16">
            <div className="p-6 bg-white rounded-xl border-2 border-blue-100 shadow-lg hover:shadow-xl hover:border-[#1E90FF] transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-3xl font-bold text-[#1E90FF] mb-2 tracking-tight">3000+</div>
              <div className="text-gray-800 font-semibold text-base">Colours</div>
              <div className="text-gray-600 text-sm mt-1 font-light">Premium gel polish collection</div>
            </div>
            <div className="p-6 bg-white rounded-xl border-2 border-blue-100 shadow-lg hover:shadow-xl hover:border-[#1E90FF] transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-3xl font-bold text-[#1E90FF] mb-2 tracking-tight">Builder</div>
              <div className="text-gray-800 font-semibold text-base">Gel Systems</div>
              <div className="text-gray-600 text-sm mt-1 font-light">Professional strength & durability</div>
            </div>
            <div className="p-6 bg-white rounded-xl border-2 border-blue-100 shadow-lg hover:shadow-xl hover:border-[#1E90FF] transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-3xl font-bold text-[#1E90FF] mb-2 tracking-tight">Nail Art</div>
              <div className="text-gray-800 font-semibold text-base">& Consumables</div>
              <div className="text-gray-600 text-sm mt-1 font-light">Complete product range</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
