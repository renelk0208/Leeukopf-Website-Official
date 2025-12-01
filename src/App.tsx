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
import GelPolishPage from './pages/products/GelPolishPage';
import TopsBasesPrimersPage from './pages/products/TopsBasesPrimersPage';
import BuilderSystemsPage from './pages/products/BuilderSystemsPage';
import FrenchCollectionPage from './pages/products/FrenchCollectionPage';
import GelItUpPage from './pages/brands/GelItUpPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/gel-polish" element={<GelPolishPage />} />
      <Route path="/products/tops-bases-primers" element={<TopsBasesPrimersPage />} />
      <Route path="/products/builder-systems" element={<BuilderSystemsPage />} />
      <Route path="/products/french-collection" element={<FrenchCollectionPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/certificates-and-compliance" element={<CertificatesPage />} />
      <Route path="/private-label" element={<PrivateLabelPage />} />
      <Route path="/private-label/bottles" element={<PrivateLabelBottlesPage />} />
      <Route path="/private-label/jars" element={<PrivateLabelJarsPage />} />
      <Route path="/private-label/bulk" element={<PrivateLabelBulkPage />} />
      <Route path="/our-brands" element={<OurBrandsPage />} />
      <Route path="/our-brands/gel-it-up" element={<GelItUpPage />} />
      <Route path="/distributors-wanted" element={<DistributorsWantedPage />} />
      <Route path="/client-registration" element={<ClientRegistrationPage />} />
      <Route path="/terms-of-use" element={<TermsOfUsePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/cookies-policy" element={<CookiesPolicyPage />} />
      <Route path="/privacy-notice-distributors" element={<PrivacyNoticeDistributorsPage />} />
      <Route path="/season-trends" element={<SeasonTrendsPage />} />
      <Route path="/live-feed" element={<LiveFeedPage />} />
      <Route path="/faq-starting-a-gel-polish-brand" element={<FaqStartBrandPage />} />
    </Routes>
  );
}

export default App;
