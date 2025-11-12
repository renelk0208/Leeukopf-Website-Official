import { Sparkles, Beaker, Globe } from 'lucide-react';

export default function Hero() {
  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptLTEyIDEyYzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSJyZ2JhKDYsIDE4MiwgMjEyLCAwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>

      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div className="space-y-8">
          <div className="flex justify-center space-x-4 mb-6">
            <div className="p-3 bg-cyan-500/10 rounded-lg backdrop-blur-sm border border-cyan-500/20 animate-float">
              <Sparkles className="text-cyan-400" size={32} />
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg backdrop-blur-sm border border-blue-500/20 animate-float delay-200">
              <Beaker className="text-blue-400" size={32} />
            </div>
            <div className="p-3 bg-cyan-500/10 rounded-lg backdrop-blur-sm border border-cyan-500/20 animate-float delay-400">
              <Globe className="text-cyan-400" size={32} />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="block mb-2">LEEUKOPF</span>
            <span className="block text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Laboratories
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Premium Gel Polish Manufacturing & Private Label Excellence
          </p>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Over 2000 colors • Cruelty-Free Certified • Bulgarian Cosmetics Excellence
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={scrollToProducts}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30"
            >
              Explore Our Products
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm text-cyan-400 rounded-lg font-semibold border-2 border-cyan-500/30 hover:bg-slate-700/50 hover:border-cyan-400/50 transition-all transform hover:scale-105"
            >
              Contact Us
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-12">
            <div className="p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-cyan-500/20">
              <div className="text-3xl font-bold text-cyan-400 mb-2">2000+</div>
              <div className="text-gray-300">Color Options</div>
            </div>
            <div className="p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-cyan-500/20">
              <div className="text-3xl font-bold text-cyan-400 mb-2">100%</div>
              <div className="text-gray-300">Cruelty-Free</div>
            </div>
            <div className="p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-cyan-500/20">
              <div className="text-3xl font-bold text-cyan-400 mb-2">GMP</div>
              <div className="text-gray-300">Certified</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}
