import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackButton from './components/BackButton';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProductsPage from './pages/ProductsPage';
import PrivateLabelPage from './pages/PrivateLabelPage';
import PrivateLabelBottlesPage from './pages/PrivateLabelBottlesPage';
import OurBrandsPage from './pages/OurBrandsPage';
import DistributorsWantedPage from './pages/DistributorsWantedPage';
import CertificatesPage from './pages/CertificatesPage';
import LiveFeedPage from './pages/LiveFeedPage';
import TermsOfUsePage from './pages/TermsOfUsePage';

import GelPolishPage from './pages/products/GelPolishPage';
import TopsBasesPrimersPage from './pages/products/TopsBasesPrimersPage';
import BuilderSystemsPage from './pages/products/BuilderSystemsPage';
import FrenchCollectionPage from './pages/products/FrenchCollectionPage';
import PrivateLabelJarsPage from './pages/PrivateLabelJarsPage';
import ClientRegistrationPage from './pages/ClientRegistrationPage';

function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/gel-polish" element={<GelPolishPage />} />
        <Route path="/products/gel-polish/french-collection" element={<FrenchCollectionPage />} />
        <Route path="/products/tops-bases-primers" element={<TopsBasesPrimersPage />} />
        <Route path="/products/builder-systems" element={<BuilderSystemsPage />} />

        <Route path="/private-label" element={<PrivateLabelPage />} />
        <Route path="/private-label/bottles" element={<PrivateLabelBottlesPage />} />
        <Route path="/private-label/jars" element={<PrivateLabelJarsPage />} />
        <Route path="/our-brands" element={<OurBrandsPage />} />
        <Route path="/distributors-wanted" element={<DistributorsWantedPage />} />
        <Route path="/certificates-and-compliance" element={<CertificatesPage />} />
        <Route path="/client-registration" element={<ClientRegistrationPage />} />
        <Route path="/terms-of-use" element={<TermsOfUsePage />} />
        <Route path="/live" element={<LiveFeedPage />} />
      </Routes>
      <Footer />
      <ScrollToTop />
      <BackButton />
    </div>
  );
}

export default App;
