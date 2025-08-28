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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ✅ HEADER IS POSITIONED ABSOLUTELY OVER THE HERO */}
      <header className="absolute top-0 z-50 w-full">
        <Navbar />
      </header>
      
      <main>
        {/* The Hero Section is now the first element, taking up the full screen */}
        <HeroSection />
        
        {/* All other sections will appear below the hero */}
        <div className="flex flex-col gap-20 md:gap-28 lg:gap-32">
          <section id="features" aria-label="Core Features" data-reveal className="reveal">
            <FeaturesSection />
          </section>
          
          <section id="more-than-plan" aria-label="More Than a Plan" data-reveal className="reveal">
            <MoreThanPlanSection />
          </section>
          
          <section id="how-it-works" aria-label="How It Works" data-reveal className="reveal">
            <HowItWorksSection />
          </section>

          <section id="testimonials" aria-label="Testimonials" data-reveal className="reveal">
            <TestimonialsSection />
          </section>
          
          <section id="pricing" aria-label="Pricing Plans" data-reveal className="reveal">
            <PricingSection />
          </section>
          
          <section id="cta" aria-label="Call to Action" data-reveal className="reveal">
            <CTASection />
          </section>
        </div>
      </main>
      
      <footer className="mt-20 md:mt-28 bg-card text-card-foreground border-t">
        <Footer />
      </footer> 
    </div>
  );
}
