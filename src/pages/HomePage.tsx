import Hero from '../components/Hero';
import CertificatesBanner from '../components/CertificatesBanner';
import WhyLeeukopf from '../components/WhyLeeukopf';
import About from '../components/About';
import Contact from '../components/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CertificatesBanner />
      <WhyLeeukopf />
      <About />
      <Contact />
    </>
  );
}
