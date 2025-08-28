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
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    
    if (reduce) { 
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
      <header className="bg-background/80 backdrop-blur-sm border-b border-border">
        <Navbar />
      </header>
      
      <main id="content" className="flex flex-col gap-16 md:gap-24 pt-16">
        <section
          id="hero"
          aria-label="Hero"
          data-reveal
          className="reveal bg-background text-foreground"
        >
          <HeroSection />
        </section>
        
        <section
          id="features"
          aria-label="Core Features"
          data-reveal
          className="reveal bg-container text-foreground"
        >
          <FeaturesSection />
        </section>
        
        <section
          aria-label="More Than a Plan"
          data-reveal
          className="reveal bg-card shadow-md text-foreground"
        >
          <MoreThanPlanSection />
        </section>
        
        <section
          id="how-it-works"
          aria-label="How it Works"
          data-reveal
          className="reveal bg-background text-foreground"
        >
          <HowItWorksSection />
        </section>
        
        <section
          id="testimonials"
          aria-label="Testimonials"
          data-reveal
          className="reveal bg-muted text-muted-foreground"
        >
          <TestimonialsSection />
        </section>
        
        <section
          id="pricing"
          aria-label="Pricing"
          data-reveal
          className="reveal bg-background text-foreground"
        >
          <PricingSection />
        </section>
        
        <section
          id="get-started"
          aria-label="Get Started"
          data-reveal
          className="reveal bg-primary text-primary-foreground rounded-2xl shadow-lg"
        >
          <CTASection />
        </section>
      </main>
      
      <footer className="mt-16 bg-sidebar-background text-sidebar-foreground border-t border-sidebar-border">
        <Footer />
      </footer>
    </div>
  );
}
