import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroImage from '/hero-wellness.jpg'; // Ensure this path is correct

export default function HeroSection() {

  const handleCTAClick = () => {
    // This would typically navigate to your signup page
    console.log("Navigating to signup...");
    // For example: window.location.href = '/signup';
  };

  return (
    <section className="relative h-screen">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="A person engaged in a wellness activity"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tighter drop-shadow-xl">
            Your Personal Path to Wellness Starts Here
          </h1>
          <p className="mt-6 text-lg sm:text-xl max-w-xl mx-auto opacity-90 drop-shadow-lg">
            Get expert-led plans for fitness, nutrition, and mental clarity, all tailored to you.
          </p>
          
          <div className="mt-10">
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="h-14 px-8 text-lg font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-transform transform hover:scale-105"
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
