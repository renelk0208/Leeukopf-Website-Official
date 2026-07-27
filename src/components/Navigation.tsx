import { type FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import CalendlyButton from './CalendlyButton';

interface SocialLinksProps {
  vertical?: boolean;
}

const SocialLinks = ({ vertical = false }: SocialLinksProps) => {
  const socialMedia = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/thermitek-ltd', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v5.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452z" />
      </svg>
    ), color: '#0A66C2' },
    { name: 'Instagram', url: 'https://www.instagram.com/leeukopf.laboratories', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 0 1 1.772 1.153 4.902 4.902 0 0 1 1.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123s-.012 3.056-.06 4.123c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 0 1-1.153 1.772 4.902 4.902 0 0 1-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.047-1.379.06-3.808.06-2.43 0-2.784-.013-3.808-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 0 1-1.772-1.153 4.902 4.902 0 0 1-1.153-1.772c-.247-.636-.416-1.363-.465-2.427C2.013 15.371 2 15.031 2 12.315s.013-3.056.06-4.123c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 0 1 1.153-1.772A4.902 4.902 0 0 1 5.45 2.84c.636-.247 1.363-.416 2.427-.465C8.901 2.328 9.256 2.315 11.685 2.315h.63zm-.315 1.802c-2.388 0-2.698.01-3.711.056-.937.043-1.446.2-1.784.332a3.116 3.116 0 0 0-1.125.732 3.116 3.116 0 0 0-.732 1.125c-.132.338-.289.847-.332 1.784-.046 1.013-.056 1.323-.056 3.711s.01 2.698.056 3.711c.043.937.2 1.446.332 1.784.17.437.393.808.732 1.125.317.317.688.56 1.125.732.338.132.847.289 1.784.332 1.013.046 1.323.056 3.711.056s2.698-.01 3.711-.056c.937-.043 1.446-.2 1.784-.332a3.116 3.116 0 0 0 1.125-.732 3.116 3.116 0 0 0 .732-1.125c.132-.338.289-.847.332-1.784.046-1.013.056-1.323.056-3.711s-.01-2.698-.056-3.711c-.043-.937-.2-1.446-.332-1.784a3.116 3.116 0 0 0-.732-1.125 3.116 3.116 0 0 0-1.125-.732c-.338-.132-.847-.289-1.784-.332-1.013-.046-1.323-.056-3.711-.056zm0 3.066a5.447 5.447 0 1 1 0 10.894 5.447 5.447 0 0 1 0-10.894zm0 1.802a3.645 3.645 0 1 0 0 7.29 3.645 3.645 0 0 0 0-7.29zm5.663-2.104a1.273 1.273 0 1 1 0 2.546 1.273 1.273 0 0 1 0-2.546z" />
      </svg>
    ), color: '#E4405F' },
    { name: 'Facebook', url: 'https://www.facebook.com/leeukopf.laboratories', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ), color: '#1877F2' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@leeukopf.laboratories', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V8.73a8.16 8.16 0 0 0 4.77 1.53V6.69h-1.04z" />
      </svg>
    ), color: '#000000' },
    // YouTube — hidden until channel is ready. Re-enable by uncommenting:
    // { name: 'YouTube', url: 'https://www.youtube.com/channel/UCVNjCrfp_4SLyCoLBG-5ILA', icon: (
    //   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    //     <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.504 2.504 0 0 1-1.768-1.768C2.002 15.255 2 12 2 12s0-3.254.418-4.814A2.504 2.504 0 0 1 4.186 5.418C5.746 5 12 5 12 5s6.255 0 7.812.418zM10 15.5l6-3.5-6-3.5v7z" />
    //   </svg>
    // ), color: '#FF0000' },
  ];

  return (
    <div className={vertical ? 'flex flex-col items-center gap-2' : 'flex items-center gap-2'}>
      {socialMedia.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-9 h-9 bg-gray-100 hover:bg-primary-50 rounded-lg transition-all duration-200 hover:scale-105"
          aria-label={social.name}
        >
          <span className="text-[#444444] group-hover:text-[#1F2566] transition-colors">
            {social.icon}
          </span>
          <span className={vertical
            ? 'absolute left-12 top-1/2 -translate-y-1/2 bg-[#444444] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none'
            : 'absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#444444] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none'}
          >
            {social.name}
          </span>
        </a>
      ))}
    </div>
  );
};

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.pathname.startsWith('/products')) {
      return;
    }

    const queryValue = new URLSearchParams(location.search).get('search') ?? '';
    setSearchQuery(queryValue);
    setIsDesktopSearchOpen(Boolean(queryValue));
  }, [location.pathname, location.search]);

  const navItems = [
    { label: 'Home', path: '/' },
    // { label: "Valentine's", path: '/valentines' }, // hidden until seasonal colours are updated
    { label: 'About Us', path: '/about' },
    { label: 'Our Products', path: '/products' },
    { label: 'Private Label', path: '/private-label' },
    { label: 'Gelitup Distribution', path: '/our-brands' },
    { label: 'Certificates', path: '/certificates-and-compliance' },
    { label: 'Start Your Brand', path: '/faq-starting-a-gel-polish-brand' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    const destination = trimmedQuery
      ? `/products?search=${encodeURIComponent(trimmedQuery)}`
      : '/products';

    navigate(destination);
    setIsOpen(false);
    setIsDesktopSearchOpen(Boolean(trimmedQuery));
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        {/* Utility bar — existing-client links, visible at xl+ (40px), brings total header to 120px at xl */}
        <div className="hidden xl:flex items-center h-10 border-b border-gray-100 bg-gray-50">
          <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 flex justify-end items-center gap-2 text-xs text-gray-500">
            <span className="uppercase tracking-wide">Existing clients</span>
            <span aria-hidden="true">|</span>
            <Link to="/portal/login" className="hover:text-primary transition-colors">
              Portal
            </Link>
            <span aria-hidden="true">|</span>
            <Link to="/client-registration" className="hover:text-primary transition-colors">
              Client Registration
            </Link>
          </div>
        </div>

        {/* Main nav bar (80px) */}
        <nav className="border-b border-gray-200" aria-label="Site navigation">
          <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
            <div className="flex justify-between items-center h-20">
              <div className="flex-shrink-0 mr-2">
                <Link to="/" className="block">
                  <OptimizedImage
                    src="/leeukopf_black.png"
                    alt="Leeukopf Laboratories Logo"
                    width={200}
                    height={50}
                    lazy={false}
                    fetchPriority="high"
                    className="h-10 md:h-12 w-auto object-contain hover:opacity-80 transition-opacity"
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden xl:flex flex-1 items-center justify-center min-w-0">
                <ul className="flex items-center justify-center flex-nowrap gap-x-0 min-w-0">
                  {navItems.map((item) => (
                    <li key={item.path} className="nav-item shrink-0">
                      <Link
                        to={item.path}
                        className={`block px-1.5 2xl:px-2 py-2 text-xs 2xl:text-sm font-medium transition-colors whitespace-nowrap ${
                          isActive(item.path)
                            ? 'text-[#1F2566] border-b-2 border-[#1F2566]'
                            : 'text-[#444444] hover:text-[#1F2566]'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                <div className="hidden xl:flex items-center">
                  {isDesktopSearchOpen ? (
                    <form onSubmit={handleSearchSubmit} className="flex items-center">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(event) => setSearchQuery(event.target.value)}
                          placeholder="Search products"
                          aria-label="Search products"
                          autoFocus
                          onKeyDown={(event) => {
                            if (event.key === 'Escape') {
                              event.preventDefault();
                              if (!searchQuery.trim()) {
                                setIsDesktopSearchOpen(false);
                              }
                            }
                          }}
                          className="w-44 rounded-lg border border-gray-300 bg-white pl-9 pr-9 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (searchQuery.trim()) {
                              setSearchQuery('');
                              navigate('/products');
                              return;
                            }

                            setIsDesktopSearchOpen(false);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={searchQuery.trim() ? 'Clear search' : 'Close search'}
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsDesktopSearchOpen(true)}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-500 hover:text-primary hover:border-primary transition-colors"
                      aria-label="Open product search"
                    >
                      <Search className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <div className="hidden xl:flex items-center space-x-1.5">
                  <CalendlyButton size="sm" />
                </div>
                <div className="xl:hidden">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-[#444444] hover:text-[#1F2566] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                <form onSubmit={handleSearchSubmit} className="px-1 pt-2 pb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search products"
                      aria-label="Search products"
                      className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </form>

                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block w-full text-left px-3 py-3 rounded-md transition-colors font-medium text-sm ${
                      isActive(item.path)
                        ? 'text-[#1F2566] bg-primary-50'
                        : 'text-[#444444] hover:text-[#1F2566] hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-2">Existing clients</p>
                  <div className="flex items-center gap-3 text-sm">
                    <Link
                      to="/portal/login"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Portal
                    </Link>
                    <span className="text-gray-300" aria-hidden="true">|</span>
                    <Link
                      to="/client-registration"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Client Registration
                    </Link>
                  </div>
                </div>

                <div className="pt-4 pb-2 border-t border-gray-200 mt-4">
                  <div className="px-3 mb-3">
                    <CalendlyButton size="md" className="w-full" />
                  </div>
                  <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Follow us
                  </div>
                  <div className="flex justify-center">
                    <SocialLinks />
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
      <div className="hidden md:flex fixed right-3 top-1/2 -translate-y-1/2 z-[60] rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm shadow-md p-2">
        <SocialLinks vertical />
      </div>
    </>
  );
}
