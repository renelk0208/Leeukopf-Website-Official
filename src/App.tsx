import { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import CertificatesBanner from './components/CertificatesBanner';
import About from './components/About';
import ProductGallery from './components/ProductGallery';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);

  const handleNavigate = (section: string, categoryId?: string) => {
    if (section === 'products' && categoryId) {
      setSelectedCategoryId(categoryId);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation onNavigate={handleNavigate} />
      <Hero />
      <CertificatesBanner />
      <About />
      <ProductGallery
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={(id) => setSelectedCategoryId(id || undefined)}
      />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
