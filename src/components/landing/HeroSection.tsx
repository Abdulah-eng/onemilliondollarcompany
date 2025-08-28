// src/components/landing/HeroSection.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';

const heroImageUrl =
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1374&auto=format&fit=crop';

export default function HeroSection() {
  return (
    <section className="relative w-screen h-screen overflow-hidden">
      {/* Background image */}
      <img
        src={heroImageUrl}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 sm:px-6 lg:px-8 text-center lg:text-left text-white max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
          Your Personal Path to Wellness Starts Here
        </h1>
        <p className="mt-6 max-w-xl text-lg sm:text-xl text-white/90">
          Get expert-led plans for fitness, nutrition, and mental clarity, all tailored to you.
        </p>

        <form className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto lg:mx-0">
          <Input
            type="email"
            placeholder="Enter Your Email"
            className="h-12 text-base flex-grow"
            aria-label="Email address"
          />
          <Button
            type="submit"
            size="lg"
            className="h-12 w-full sm:w-auto px-6 text-base font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 transform transition"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>
      </div>
    </section>
  );
}
