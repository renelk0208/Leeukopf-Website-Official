import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import CertificatesBanner from '../components/CertificatesBanner';
import About from '../components/About';
import InstagramFeed from '../components/InstagramFeed';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

export default function HomePage() {
  return (
    <>
      <ScrollToTop />
      <Navigation />
      <Hero />
      <CertificatesBanner />
      <About />
      <InstagramFeed />
      <Contact />
      <Footer />
    </>
  );
}
