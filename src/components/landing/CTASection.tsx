import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CTASection() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <section className="py-20 bg-gradient-to-r from-pink-500/10 to-orange-500/10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="reveal" data-reveal>
          <h2 className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-bold">
            Ready to transform your life?
          </h2>
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
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
              {submitting ? 'Submitting…' : 'Get Started'}
            </Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            By submitting, you agree to our <a href="/privacy" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </section>
  );
}