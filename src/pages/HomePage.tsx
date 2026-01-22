import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import SocialProof from '../components/SocialProof';
import HowItWorks from '../components/HowItWorks';
import InstagramFeed from '../components/InstagramFeed';  
import StartHereBanner from '../components/StartHereBanner';
import CertificatesBanner from '../components/CertificatesBanner';
import About from '../components/About';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

export default function HomePage() {
  return (
    <>
      <ScrollToTop />
      <Navigation />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <InstagramFeed />
      <StartHereBanner />
      <CertificatesBanner />
      <About />
      <Footer />
    </>
  );
}
