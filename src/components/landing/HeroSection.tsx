import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import heroImage from '/hero-wellness.jpg'; // Ensure this path is correct

export default function HeroSection() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmail('');
      alert('Thank you for your interest! We\'ll be in touch soon.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
      {/* Decorative background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: '8s' }}
      />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            {/* Headline with Text Gradient */}
            <h1 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              Transform Your Life. <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text">One Plan at a Time.</span>
            </h1>
            <p className="mb-8 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Fitness, Nutrition & Mental Clarity — Personalized by a Real Coach.
            </p>

            {/* Form with enhanced styling */}
            <form
              onSubmit={handleSubmit}
              className="relative mx-auto mb-6 flex max-w-md flex-col gap-3 sm:flex-row lg:mx-0 p-2 bg-card/60 dark:bg-card/30 backdrop-blur-sm border border-border rounded-full"
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
                className="h-12 flex-1 bg-transparent border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base rounded-full"
              />
              <Button
                type="submit"
                className="h-12 text-base px-8 whitespace-nowrap rounded-full bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all duration-300 transform hover:scale-105"
                disabled={submitting}
              >
                {submitting ? 'Submitting…' : 'Start Free Trial'}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground">
              ✨ 14-day free trial · 🔒 No credit card required · ❌ Cancel anytime
            </p>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Wellness and fitness transformation"
              className="w-full rounded-3xl shadow-2xl shadow-black/10 dark:shadow-primary/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
