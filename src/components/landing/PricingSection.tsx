// File: src/components/landing/PricingSection.tsx
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PricingSection = () => {
  const plans = [
    {
      name: 'Basic',
      price: '$17.99',
      period: 'One-Time',
      description: 'Perfect for trying out our approach',
      featured: false,
      features: [
        { text: 'One 1-month plan', included: true },
        { text: 'Progress tools', included: false },
        { text: 'Feedback', included: false },
      ],
      cta: 'Get Started',
      badge: null,
    },
    {
      name: 'Standard',
      price: '$14.99',
      period: '/month',
      description: 'Most popular choice for consistent growth',
      featured: false,
      features: [
        { text: 'One monthly plan (choose 1 pillar)', included: true },
        { text: 'Knowledge Hub', included: true },
        { text: 'Blog Access', included: true },
        { text: 'Feedback / Progress Tracking', included: false },
        { text: '14-day trial', included: true },
      ],
      cta: 'Start Free Trial',
      badge: null,
    },
    {
      name: 'Premium',
      price: '$29.99',
      period: '/month',
      description: 'Complete transformation package',
      featured: true,
      features: [
        { text: 'Fitness, Nutrition & Mind Plans', included: true },
        { text: 'Full Knowledge Hub', included: true },
        { text: 'Progress Tracking', included: true },
        { text: 'Coach Feedback', included: true },
        { text: 'Monthly Plan Updates', included: true },
      ],
      cta: 'Start Free Trial',
      badge: '⭐', // keep or omit; we force badge below anyway
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Choose Your Transformation Plan
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            🚀 Start your journey with the perfect plan for your goals.
          </p>
        </div>

        {/* Pricing Cards — unchanged sizing/layout */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isPremium =
              plan.name.toLowerCase() === 'premium' || plan.featured === true;
            const showBadge = plan.badge || isPremium; // <— force badge on Premium

            return (
              <div
                key={plan.name}
                className={`wellness-card p-8 relative ${
                  plan.featured ? 'ring-2 ring-primary bg-gradient-primary/5' : ''
                } hover:scale-105 transition-all duration-300`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Badge (top-right) */}
                {showBadge && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg">
                    {plan.badge || '⭐'}
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-primary">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included
                            ? 'text-foreground'
                            : 'text-muted-foreground line-through'
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full ${
                    plan.featured ? 'btn-wellness-primary' : 'btn-wellness-secondary'
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-muted-foreground">
            ✨ 14-day free trial on Standard · 🔒 Secure payment · ❌ Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
