import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

// ✅ 1. IMPORT YOUR IMAGES HERE
// Make sure you have images in your 'src/assets/' folder.
// For example: import heroImage1 from '@/assets/hero-1.jpg';
// Then, use the imported variables in the array below.
// I'm using placeholder URLs so the component works visually.
const carouselImages = [
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517836357463-d257692634c2?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop",
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Effect for the automatic image carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="relative h-screen flex items-center">
      
      {/* BACKGROUND IMAGE CAROUSEL */}
      <div className="absolute inset-0 z-0">
        {carouselImages.map((src, index) => (
          <img
            key={src}
            src={src}
            alt="Person engaged in a wellness activity"
            className={`w-full h-full object-cover absolute transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {/* Removed the dark overlay as requested */}
      </div>

      {/* ✅ CONTENT CONTAINER (Left-aligned on desktop, centered on mobile) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center md:justify-start">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter text-white drop-shadow-xl">
            Your Personal Path to Wellness Starts Here
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/90 drop-shadow-lg">
            Get expert-led plans for fitness, nutrition, and mental clarity, all tailored to you.
          </p>
          
          <div className="mt-10 flex flex-col items-center md:items-start">
            <Button
              size="lg"
              className="h-14 px-8 text-lg font-bold rounded-full bg-gradient-primary text-primary-foreground transition-transform transform hover:scale-105 shadow-2xl shadow-primary/30"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="mt-4 text-sm text-white/80">
              14-day free trial · No credit card required
            </p>
          </div>

          {/* CUSTOMER RATING / SOCIAL PROOF */}
          <div className="mt-8 flex items-center justify-center md:justify-start gap-4">
              <div className="flex items-center text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-sm font-medium text-white/90">
                  Rated <span className="font-bold text-white">4.9/5</span> by 1,000+ users
              </p>
          </div>
        </div>
      </div>
    </section>
  );
}
