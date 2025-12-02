import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OptimizedImage from './OptimizedImage';

const SocialLinks = () => {
  const socialMedia = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/thermitek-ltd', icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ) },
    { name: 'Instagram', url: 'https://www.instagram.com/leeukopf.laboratories', icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
      </svg>
    ) },
    { name: 'Facebook', url: 'https://www.facebook.com/leeukopf.laboratories', icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
      </svg>
    ) },
    { name: 'TikTok', url: 'https://www.tiktok.com/@leeukopf.laboratories', icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    ) },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {socialMedia.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon group relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white hover:bg-primary-50 rounded-lg transition-all duration-300 hover:scale-110 min-w-[44px] min-h-[44px]"
          aria-label={social.name}
        >
          <span className="transition-all">
            {social.icon}
          </span>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
            {social.name}
          </span>
        </a>
      ))}
    </div>
  );
};

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-br from-secondary-800 via-secondary-800 to-secondary-900 border-t border-secondary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Responsive grid - stacks on mobile, 4 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="block mb-4">
              <OptimizedImage
                src="/leeukopf_black.png"
                alt="Leeukopf Laboratories"
                width={200}
                height={50}
                className="h-10 sm:h-12 w-auto object-contain hover:opacity-90 transition-opacity brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 text-sm font-light leading-relaxed mb-4">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center space-x-2 text-gray-400 text-sm font-light">
              <span>{t('footer.madeWith')}</span>
              <Heart className="text-red-400 fill-red-400" size={14} />
              <span>{t('footer.inBulgaria')}</span>
            </div>
          </div>

          {/* Quick Links - responsive grid within */}
          <div>
            <h3 className="text-white font-semibold text-base mb-3">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 columns-2 sm:columns-1">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white hover:underline decoration-primary transition-colors text-sm font-light min-h-[44px] inline-flex items-center">
                  {t('footer.ourProducts')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white hover:underline decoration-primary transition-colors text-sm font-light min-h-[44px] inline-flex items-center">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/our-brands" className="text-gray-400 hover:text-white hover:underline decoration-primary transition-colors text-sm font-light min-h-[44px] inline-flex items-center">
                  {t('footer.ourBrands')}
                </Link>
              </li>
              <li>
                <Link to="/private-label" className="text-gray-400 hover:text-white hover:underline decoration-primary transition-colors text-sm font-light min-h-[44px] inline-flex items-center">
                  {t('footer.privateLabel')}
                </Link>
              </li>
              <li>
                <Link to="/distributors-wanted" className="text-gray-400 hover:text-white hover:underline decoration-primary transition-colors text-sm font-light min-h-[44px] inline-flex items-center">
                  {t('footer.becomeDistributor')}
                </Link>
              </li>
              <li>
                <Link to="/client-registration" className="text-gray-400 hover:text-white hover:underline decoration-primary transition-colors text-sm font-light min-h-[44px] inline-flex items-center">
                  {t('footer.clientRegistration')}
                </Link>
              </li>
              <li>
                <Link to="/certificates-and-compliance" className="text-gray-400 hover:text-white hover:underline decoration-primary transition-colors text-sm font-light min-h-[44px] inline-flex items-center">
                  {t('footer.certificates')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white hover:underline decoration-primary transition-colors text-sm font-light min-h-[44px] inline-flex items-center">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link to="/faq-starting-a-gel-polish-brand" className="text-gray-400 hover:text-white hover:underline decoration-primary transition-colors text-sm font-light min-h-[44px] inline-flex items-center">
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-3">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms-of-use" className="text-gray-400 hover:text-white hover:underline decoration-primary transition-colors text-sm font-light min-h-[44px] inline-flex items-center">
                  {t('footer.termsOfUse')}
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white hover:underline decoration-primary transition-colors text-sm font-light min-h-[44px] inline-flex items-center">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/cookies-policy" className="text-gray-400 hover:text-white hover:underline decoration-primary transition-colors text-sm font-light min-h-[44px] inline-flex items-center">
                  {t('footer.cookiesPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/privacy-notice-distributors" className="text-gray-400 hover:text-white hover:underline decoration-primary transition-colors text-sm font-light min-h-[44px] inline-flex items-center">
                  {t('footer.privacyNoticeDistributors')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social section */}
          <div>
            <h3 className="text-white font-semibold text-base mb-3">{t('footer.followUs')}</h3>
            <p className="text-gray-400 text-sm font-light mb-4">
              {t('footer.socialDescription')}
            </p>
            <div className="flex items-center">
              <SocialLinks />
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="pt-4 sm:pt-6 border-t border-gray-700">
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <OptimizedImage
              src="/favicon_leeukopf.jpg" 
              alt="Leeukopf Laboratories" 
              width={32}
              height={32}
              className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
            />
            <div className="text-center text-gray-400 text-xs font-light">
              &copy; {new Date().getFullYear()} Leeukopf Laboratories. {t('footer.allRightsReserved')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
