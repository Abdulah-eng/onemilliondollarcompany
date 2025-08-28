import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  // ✅ New, high-quality, and reliable image URL
  const heroImageUrl = "https://images.unsplash.com/photo-1548690312-e3b511d48c04?q=80&w=2070&auto=format&fit=crop";

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImageUrl}
          alt="A person engaged in a wellness activity"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center text-white px-4">
        <div className="max-w-3xl" data-reveal>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter drop-shadow-xl">
            Your Personal Path to Wellness Starts Here
          </h1>
          <p className="mt-6 text-lg sm:text-xl max-w-xl mx-auto opacity-90 drop-shadow-lg">
            Get expert-led plans for fitness, nutrition, and mental clarity, all tailored to you.
          </p>
          
          <div className="mt-10">
            <Button
              size="lg"
              className="h-14 px-8 text-lg font-bold rounded-full bg-gradient-primary text-primary-foreground transition-transform transform hover:scale-105 shadow-2xl shadow-primary/30"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="mt-4 text-sm opacity-80">
              14-day free trial · No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
