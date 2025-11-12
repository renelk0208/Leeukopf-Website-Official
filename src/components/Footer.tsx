import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-cyan-500/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Leeukopf Laboratories. All rights reserved.
          </div>

          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>Made with</span>
            <Heart className="text-red-400 fill-red-400" size={16} />
            <span>in Bulgaria</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-400 text-sm">Cruelty-Free Certified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
