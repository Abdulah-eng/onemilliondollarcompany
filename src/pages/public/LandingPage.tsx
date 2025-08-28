import { useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import MoreThanPlanSection from '@/components/landing/MoreThanPlanSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingSection from '@/components/landing/PricingSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

// A helper hook for scroll animations (can be kept as is)
function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => el.classList.add('reveal-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('reveal-visible');
      }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function LandingPage() {
  useRevealOnScroll();

  return (
    // ✅ Apply the new landing page theme here
    <div className="theme-landing min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar is positioned absolutely over the HeroSection */}
      <header className="absolute top-0 z-50 w-full">
        <Navbar />
      </header>
      
      <main>
        {/* HeroSection is now the primary visual element */}
        <HeroSection />
        
        {/* Container for the rest of the page content */}
        <div className="flex flex-col gap-16 md:gap-24">
          {/* Each subsequent section would go here */}
          {/* <section id="features" aria-label="Core Features" data-reveal className="reveal">
            <FeaturesSection />
          </section>
          ...etc
          */}
        </div>
      </main>
      
      {/* <footer className="mt-16 bg-card text-card-foreground border-t">
        <Footer />
      </footer> 
      */}
    </div>
  );
}
