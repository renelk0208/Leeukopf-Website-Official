import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProductsPage from './pages/ProductsPage';
import PrivateLabelPage from './pages/PrivateLabelPage';
import OurBrandsPage from './pages/OurBrandsPage';
import DistributorsWantedPage from './pages/DistributorsWantedPage';
import CertificatesPage from './pages/CertificatesPage';

import GelPolishPage from './pages/products/GelPolishPage';
import TopsBasesPrimersPage from './pages/products/TopsBasesPrimersPage';
import BuilderSystemsPage from './pages/products/BuilderSystemsPage';

import TopsPage from './pages/products/subcategories/TopsPage';
import BasesPage from './pages/products/subcategories/BasesPage';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/gel-polish" element={<GelPolishPage />} />
        <Route path="/products/tops-bases-primers" element={<TopsBasesPrimersPage />} />
        <Route path="/products/tops-bases-primers/tops" element={<TopsPage />} />
        <Route path="/products/tops-bases-primers/bases" element={<BasesPage />} />
        <Route path="/products/builder-systems" element={<BuilderSystemsPage />} />

        <Route path="/private-label" element={<PrivateLabelPage />} />
        <Route path="/our-brands" element={<OurBrandsPage />} />
        <Route path="/distributors-wanted" element={<DistributorsWantedPage />} />
        <Route path="/certificates-and-compliance" element={<CertificatesPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
