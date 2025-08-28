import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {

  // A new, more fitting image for the hero section
  const heroImageUrl = "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1374&auto=format&fit=crop";

  return (
    <section className="relative bg-background overflow-hidden pt-24 md:pt-32 lg:pt-40">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background z-0"/>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tighter">
              Your Personal Path to Wellness Starts Here
            </h1>
            <p className="mt-6 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 text-muted-foreground">
              Get expert-led plans for fitness, nutrition, and mental clarity, all tailored to you.
            </p>
            
            {/* CTA Form */}
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
                className="h-12 w-full sm:w-auto px-6 text-base font-bold bg-gradient-primary text-primary-foreground transition-transform transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>

            {/* Social Proof */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-2 overflow-hidden">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-background" src="https://randomuser.me/api/portraits/women/79.jpg" alt="User 1"/>
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-background" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User 2"/>
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-background" src="https://randomuser.me/api/portraits/women/44.jpg" alt="User 3"/>
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                    Trusted by <span className="font-bold text-foreground">1,000+</span> health coaches
                </p>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative">
            <img 
              src={heroImageUrl}
              alt="A person performing a fitness exercise"
              className="rounded-3xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
