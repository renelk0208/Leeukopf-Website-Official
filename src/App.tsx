import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import CertificatesPage from './pages/CertificatesPage';
import PrivateLabelPage from './pages/PrivateLabelPage';
import PrivateLabelBottlesPage from './pages/PrivateLabelBottlesPage';
import PrivateLabelJarsPage from './pages/PrivateLabelJarsPage';
import PrivateLabelBulkPage from './pages/PrivateLabelBulkPage';
import OurBrandsPage from './pages/OurBrandsPage';
import DistributorsWantedPage from './pages/DistributorsWantedPage';
import ClientRegistrationPage from './pages/ClientRegistrationPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiesPolicyPage from './pages/CookiesPolicyPage';
import PrivacyNoticeDistributorsPage from './pages/PrivacyNoticeDistributorsPage';
import SeasonTrendsPage from './pages/SeasonTrendsPage';
import LiveFeedPage from './pages/LiveFeedPage';
import FaqStartBrandPage from './pages/FaqStartBrandPage';

// Product Pages
import GelPolishPage from './pages/products/GelPolishPage';
import BuilderAndStructureGelsPage from './pages/products/BuilderAndStructureGelsPage';
import TopAndBasesPage from './pages/products/TopAndBasesPage';
import PolygelAcrygelPage from './pages/products/PolygelAcrygelPage';
import AcrylicSystemsPage from './pages/products/AcrylicSystemsPage';
import LiquidsAndSolutionsPage from './pages/products/LiquidsAndSolutionsPage';
import NailArtPage from './pages/products/NailArtPage';
import AccessoriesPage from './pages/products/AccessoriesPage';
import CategoryGridTestPage from './pages/products/CategoryGridTestPage';

// Builder Gels Subcategories
import ThreePhasePage from './pages/products/builder-gels/ThreePhasePage';
import ThreeInOnePage from './pages/products/builder-gels/ThreeInOnePage';
import PremiumFiberGlassPage from './pages/products/builder-gels/PremiumFiberGlassPage';

// Top & Bases Subcategories
import TopCoatsPage from './pages/products/top-bases/TopCoatsPage';
import StandardTopCoatsPage from './pages/products/top-bases/top-coats/StandardTopCoatsPage';
import EffectsTopCoatsPage from './pages/products/top-bases/top-coats/EffectsTopCoatsPage';
import BaseCoatsPage from './pages/products/top-bases/BaseCoatsPage';
import ClassicBasePage from './pages/products/top-bases/base-coats/ClassicBasePage';
import RubberBasePage from './pages/products/top-bases/base-coats/RubberBasePage';
import SuperiorBasePage from './pages/products/top-bases/base-coats/SuperiorBasePage';

// Legacy Product Pages
import TopsBasesPrimersPage from './pages/products/TopsBasesPrimersPage';
import BuilderSystemsPage from './pages/products/BuilderSystemsPage';
import FrenchCollectionPage from './pages/products/FrenchCollectionPage';

// Brand Pages
import GelItUpPage from './pages/brands/GelItUpPage';

import CookieConsent from './components/CookieConsent';

function App() {
  return (
    <>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/certificates-and-compliance" element={<CertificatesPage />} />
        <Route path="/distributors-wanted" element={<DistributorsWantedPage />} />
        <Route path="/client-registration" element={<ClientRegistrationPage />} />
        <Route path="/season-trends" element={<SeasonTrendsPage />} />
        <Route path="/live-feed" element={<LiveFeedPage />} />
        <Route path="/faq-starting-a-gel-polish-brand" element={<FaqStartBrandPage />} />

        {/* Products */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/gel-polish" element={<GelPolishPage />} />
        <Route path="/products/category-grid-test" element={<CategoryGridTestPage />} />
        
        {/* Builder & Structure Gels */}
        <Route path="/products/builder-and-structure-gels" element={<BuilderAndStructureGelsPage />} />
        <Route path="/products/builder-and-structure-gels/3-phase" element={<ThreePhasePage />} />
        <Route path="/products/builder-and-structure-gels/3-in-1" element={<ThreeInOnePage />} />
        <Route path="/products/builder-and-structure-gels/premium-fiber-glass" element={<PremiumFiberGlassPage />} />
        
        {/* Top & Bases */}
        <Route path="/products/top-and-bases" element={<TopAndBasesPage />} />
        <Route path="/products/top-and-bases/top-coats" element={<TopCoatsPage />} />
        <Route path="/products/top-and-bases/top-coats/standard" element={<StandardTopCoatsPage />} />
        <Route path="/products/top-and-bases/top-coats/effects" element={<EffectsTopCoatsPage />} />
        <Route path="/products/top-and-bases/base-coats" element={<BaseCoatsPage />} />
        <Route path="/products/top-and-bases/base-coats/classic" element={<ClassicBasePage />} />
        <Route path="/products/top-and-bases/base-coats/rubber-base" element={<RubberBasePage />} />
        <Route path="/products/top-and-bases/base-coats/superior-base-5-in-1" element={<SuperiorBasePage />} />
        
        {/* Other Product Categories */}
        <Route path="/products/polygel-acrygel" element={<PolygelAcrygelPage />} />
        <Route path="/products/acrylic-systems" element={<AcrylicSystemsPage />} />
        <Route path="/products/liquids-and-solutions" element={<LiquidsAndSolutionsPage />} />
        <Route path="/products/nail-art" element={<NailArtPage />} />
        <Route path="/products/accessories" element={<AccessoriesPage />} />

        {/* Legacy Product Routes (for backwards compatibility) */}
        <Route path="/products/tops-bases-primers" element={<TopsBasesPrimersPage />} />
        <Route path="/products/builder-systems" element={<BuilderSystemsPage />} />
        <Route path="/products/french-collection" element={<FrenchCollectionPage />} />

        {/* Private Label */}
        <Route path="/private-label" element={<PrivateLabelPage />} />
        <Route path="/private-label/bottles" element={<PrivateLabelBottlesPage />} />
        <Route path="/private-label/jars" element={<PrivateLabelJarsPage />} />
        <Route path="/private-label/bulk" element={<PrivateLabelBulkPage />} />

        {/* Brands */}
        <Route path="/our-brands" element={<OurBrandsPage />} />
        <Route path="/our-brands/gel-it-up" element={<GelItUpPage />} />

        {/* Legal Pages */}
        <Route path="/terms-of-use" element={<TermsOfUsePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/cookies-policy" element={<CookiesPolicyPage />} />
        <Route path="/privacy-notice-distributors" element={<PrivacyNoticeDistributorsPage />} />
      </Routes>
      <CookieConsent />
    </>
  );
}

export default App;
