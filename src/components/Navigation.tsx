import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection('home')}
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hover:from-cyan-300 hover:to-blue-400 transition-all"
            >
              LEEUKOPF
            </button>
          </div>

          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Who We Are
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Our Products
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Contact
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-cyan-400 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-800/95 backdrop-blur-sm border-t border-cyan-500/20">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left px-3 py-2 text-gray-300 hover:text-cyan-400 hover:bg-slate-700/50 rounded-md transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-3 py-2 text-gray-300 hover:text-cyan-400 hover:bg-slate-700/50 rounded-md transition-colors"
            >
              Who We Are
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="block w-full text-left px-3 py-2 text-gray-300 hover:text-cyan-400 hover:bg-slate-700/50 rounded-md transition-colors"
            >
              Our Products
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-3 py-2 text-gray-300 hover:text-cyan-400 hover:bg-slate-700/50 rounded-md transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
