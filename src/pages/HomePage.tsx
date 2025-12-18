import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import InstagramFeed from '../components/InstagramFeed';  
import StartHereBanner from '../components/StartHereBanner';
import CertificatesBanner from '../components/CertificatesBanner';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

export default function HomePage() {
  return (
    <>
      <ScrollToTop />
      <Navigation />
      <Hero />
      <InstagramFeed />
      <StartHereBanner />
      <CertificatesBanner />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
