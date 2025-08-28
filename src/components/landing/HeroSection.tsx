import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import heroImage from '/hero-wellness.jpg';

export default function HeroSection() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmail('');
      alert('Thank you for your interest! We\'ll be in touch soon.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-[80vh] md:min-h-screen flex items-center bg-gradient-hero">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h1 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Transform Your Life. <span className="text-primary">One Plan at a Time.</span>
            </h1>
            <p className="mb-8 text-lg sm:text-xl text-muted-foreground">
              Fitness, Nutrition & Mental Clarity — Personalized by a Real Coach.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mb-6 flex max-w-md flex-col gap-3 sm:flex-row lg:mx-0"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
                className="rounded-2xl"
              />
              <Button
                type="submit"
                className="btn-wellness-primary text-base px-8 py-3 whitespace-nowrap rounded-2xl"
                disabled={submitting}
              >
                {submitting ? 'Please wait…' : 'Start Free Trial'}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground">
              ✨ 14-day free trial · 🔒 No credit card required · ❌ Cancel anytime
            </p>
          </div>

          <div className="relative">
            <div className="relative">
              <img
                src={heroImage}
                alt="Wellness and fitness transformation"
                className="w-full rounded-3xl shadow-wellness"
              />
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-primary-glow/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
