import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OptimizedImage from './OptimizedImage';
import LanguageSwitcher from './LanguageSwitcher';

const SocialLinks = () => {
  const socialMedia = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/thermitek-ltd', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ), color: '#0A66C2' },
    { name: 'Instagram', url: 'https://www.instagram.com/leeukopf.laboratories', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
      </svg>
    ), color: '#E4405F' },
    { name: 'Facebook', url: 'https://www.facebook.com/leeukopf.laboratories', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
      </svg>
    ), color: '#1877F2' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@leeukopf.laboratories', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    ), color: '#000000' },
  ];

  return (
    <div className="flex items-center gap-2">
      {socialMedia.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-9 h-9 bg-gray-100 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105"
          aria-label={social.name}
        >
          <span className="text-gray-600 group-hover:text-blue-700 transition-colors">
            {social.icon}
          </span>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {social.name}
          </span>
        </a>
      ))}
    </div>
  );
};

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.products'), path: '/products' },
    { label: t('nav.privateLabel'), path: '/private-label' },
    { label: t('nav.ourBrands'), path: '/our-brands' },
    { label: t('nav.distributors'), path: '/distributors-wanted' },
    { label: t('nav.certificates'), path: '/certificates-and-compliance' },
    { label: t('nav.faq'), path: '/faq-starting-a-gel-polish-brand' },
    { label: t('nav.clientRegistration'), path: '/client-registration' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="block">
              <OptimizedImage
                src="/leeukopf_black.png"
                alt="Leeukopf Laboratories Logo"
                width={200}
                height={50}
                lazy={false}
                fetchPriority="high"
                className="h-12 md:h-14 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:block flex-1 mx-6" aria-label="Main navigation">
            <ul className="flex items-center justify-center space-x-4 2xl:space-x-6">
              {navItems.map((item) => (
                <li key={item.path} className="nav-item whitespace-nowrap">
                  <Link
                    to={item.path}
                    className={`px-2 py-2 text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-[#1E90FF] border-b-2 border-[#1E90FF]'
                        : 'text-gray-700 hover:text-[#1E90FF]'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden xl:flex items-center space-x-4">
              <LanguageSwitcher variant="desktop" />
              <SocialLinks />
            </div>
            <div className="xl:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-[#1E90FF] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="xl:hidden bg-white border-t border-gray-200 shadow-lg max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block w-full text-left px-3 py-3 rounded-md transition-colors font-medium text-sm ${
                  isActive(item.path)
                    ? 'text-[#1E90FF] bg-blue-50'
                    : 'text-gray-700 hover:text-[#1E90FF] hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Language Switcher for Mobile */}
            <div className="pt-4 pb-2 border-t border-gray-200 mt-4">
              <LanguageSwitcher variant="mobile" />
            </div>

            <div className="pt-4 pb-2 border-t border-gray-200 mt-4">
              <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('nav.followUs')}
              </div>
              <div className="flex justify-center">
                <SocialLinks />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
