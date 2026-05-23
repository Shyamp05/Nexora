import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/landing/Hero';
import TrustStats from '@/components/landing/TrustStats';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

// ============================================
// LandingPage — Full marketing landing page
// ============================================

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },
};

export default function LandingPage() {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#06060b]"
    >
      <Navbar />
      <Hero />
      <TrustStats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Footer />
    </motion.div>
  );
}
