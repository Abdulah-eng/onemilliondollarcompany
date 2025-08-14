
import { useEffect } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import MoreThanPlanSection from './MoreThanPlanSection';
import HowItWorksSection from './HowItWorksSection';
import TestimonialsSection from './TestimonialsSection';
import PricingSection from './PricingSection';
import CTASection from './CTASection';
import Footer from './Footer';

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
      <header>
        <Navbar />
      </header>
      
      <main id="content" className="flex flex-col gap-16 md:gap-24 pt-16">
        <section id="hero" aria-label="Hero" data-reveal className="reveal">
          <HeroSection />
        </section>
        
        <section id="features" aria-label="Core Features" data-reveal className="reveal">
          <FeaturesSection />
        </section>
        
        <section aria-label="More Than a Plan" data-reveal className="reveal">
          <MoreThanPlanSection />
        </section>
        
        <section id="how-it-works" aria-label="How it Works" data-reveal className="reveal">
          <HowItWorksSection />
        </section>
        
        <section id="testimonials" aria-label="Testimonials" data-reveal className="reveal">
          <TestimonialsSection />
        </section>
        
        <section id="pricing" aria-label="Pricing" data-reveal className="reveal">
          <PricingSection />
        </section>
        
        <section id="get-started" aria-label="Get Started" data-reveal className="reveal">
          <CTASection />
        </section>
      </main>
      
      <footer className="mt-16">
        <Footer />
      </footer>
    </div>
  );
}
