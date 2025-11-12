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
              className="px-8 py-4 bg-blue-500 text-white rounded-md font-semibold hover:bg-white hover:text-blue-500 hover:border-2 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Explore Our Products
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-white text-blue-500 rounded-md font-semibold border-2 border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
              Contact Us
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-8">
            <img
              src="/572916675_122131040858961647_8170659271303111919_n.jpg"
              alt="Leaping Bunny Certified"
              className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
            <span className="text-gray-400">·</span>
            <img
              src="/img/certifications/gmp-logo.png"
              alt="GMP Certified"
              className="h-7 sm:h-9 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
            <span className="text-gray-400">·</span>
            <img
              src="/viber_image_2025-11-12_13-55-24-523.png"
              alt="EU 1223/2009 Compliant"
              className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
            <span className="text-gray-400">·</span>
            <img
              src="/viber_image_2025-11-12_13-54-58-003.png"
              alt="HEMA & TPO Free"
              className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto pt-16">
            <div className="p-6 bg-white rounded-xl border-2 border-blue-100 shadow-lg hover:shadow-xl hover:border-blue-700 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-3xl font-bold text-blue-800 mb-2 tracking-tight">3000+</div>
              <div className="text-gray-800 font-semibold text-base">Colours</div>
              <div className="text-gray-600 text-sm mt-1 font-light">Premium gel polish collection</div>
            </div>
            <div className="p-6 bg-white rounded-xl border-2 border-blue-100 shadow-lg hover:shadow-xl hover:border-blue-700 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-3xl font-bold text-blue-800 mb-2 tracking-tight">Builder</div>
              <div className="text-gray-800 font-semibold text-base">Gel Systems</div>
              <div className="text-gray-600 text-sm mt-1 font-light">Professional strength & durability</div>
            </div>
            <div className="p-6 bg-white rounded-xl border-2 border-blue-100 shadow-lg hover:shadow-xl hover:border-blue-700 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-3xl font-bold text-blue-800 mb-2 tracking-tight">Nail Art</div>
              <div className="text-gray-800 font-semibold text-base">& Consumables</div>
              <div className="text-gray-600 text-sm mt-1 font-light">Complete product range</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
