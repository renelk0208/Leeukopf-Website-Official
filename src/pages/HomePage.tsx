import { lazy, Suspense } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import SocialProof from '../components/SocialProof';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

// Lazy load below-the-fold sections
const HowItWorks = lazy(() => import('../components/HowItWorks'));
const InstagramFeed = lazy(() => import('../components/InstagramFeed'));
const StartHereBanner = lazy(() => import('../components/StartHereBanner'));
const CertificatesBanner = lazy(() => import('../components/CertificatesBanner'));
const About = lazy(() => import('../components/About'));

export default function HomePage() {
  return (
    <>
      <ScrollToTop />
      <Navigation />
      <Hero />
      <SocialProof />
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <HowItWorks />
        <InstagramFeed />
        <StartHereBanner />
        <CertificatesBanner />
        <About />
      </Suspense>
      <Footer />
    </>
  );
}
