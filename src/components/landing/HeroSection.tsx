import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// ✅ Use optimized .webp versions (convert your JPGs with Squoosh)
import heroImage1 from '@/assets/hero-image1.webp';
import heroImage2 from '@/assets/hero-image2.webp';
import heroImage3 from '@/assets/hero-image3.webp';

// ✅ Carousel Content
const carouselData = [
  {
    image: heroImage1,
    title: "Eat Better. Live Better.",
    description:
      "Food should fuel joy, not stress. Discover how to eat smarter without dieting—so you feel amazing, have more energy, and still enjoy every bite.",
  },
  {
    image: heroImage2,
    title: "Strong Starts Here",
    description:
      "Fitness isn’t about size—it’s about unlocking your energy, confidence, and power. Step into movement that feels good and finally see results that stick.",
  },
  {
    image: heroImage3,
    title: "Your Calm, Your Power",
    description:
      "A clear, focused mind changes everything. Learn simple tools to release stress, boost resilience, and build the inner strength that fuels success.",
  },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(true);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTextVisible(false); // fade-out text

      setTimeout(() => {
        setCurrentIndex((prev) =>
          prev === carouselData.length - 1 ? 0 : prev + 1
        );
        setIsTextVisible(true); // fade-in text
      }, 700);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const currentSlide = carouselData[currentIndex];

  return (
    <section id="hero" className="relative h-screen flex items-center">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {carouselData.map((slide, index) => (
          <img
            key={slide.title}
            src={slide.image}
            alt={slide.title}
            loading="lazy"
            className={`w-full h-full object-cover absolute transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center md:justify-start">
        <div className="max-w-xl text-center md:text-left">
          {/* Text with fade animation */}
          <div
            className={cn(
              "transition-opacity duration-700 ease-in-out",
              isTextVisible ? "opacity-100" : "opacity-0"
            )}
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter text-white drop-shadow-xl">
              {currentSlide.title}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/90 drop-shadow-lg">
              {currentSlide.description}
            </p>
          </div>

          {/* CTA */}
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

          {/* Rating */}
          <div className="mt-8 flex items-center justify-center md:justify-start gap-4">
            <div className="flex items-center text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
            </div>
            <p className="text-sm font-medium text-white/90">
              Rated <span className="font-bold text-white">4.9/5</span> by
              1,000+ users
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
