// File: src/components/landing/PricingSection.tsx
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLANS } from '@/mockdata/landingpage/plans';

const PricingSection = () => {
  // Normalize mock data so it matches the old component’s expected fields
  const plans = PLANS.map((p: any) => {
    const featured = p.featured ?? p.popular ?? false;
    const description = p.description ?? p.summary ?? '';
    const cta = p.cta ?? p.ctaText ?? 'Get Started';
    const badge = p.badge ?? (featured ? '⭐' : null);
    // Keep your original rendering behavior for period string
    const period =
      p.period === 'One-Time' || p.period?.startsWith('/')
        ? p.period
        : `/${p.period}`;

    return {
      name: p.name,
      price: p.price,
      period,
      description,
      featured,
      features: p.features || [],
      cta,
      badge,
    };
  });

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

        {/* Pricing Cards */}
        {/* This container now switches to a grid on `lg` screens to prevent tablet overlap */}
        <div className="flex gap-8 overflow-x-auto py-8 -mx-4 px-4 lg:grid lg:grid-cols-3 lg:mx-auto lg:px-0">
          {plans.map((plan: any, index: number) => (
            <div
              key={plan.name}
              className={`wellness-card p-8 relative rounded-3xl shadow-xl min-w-[300px] flex-shrink-0 ${
                plan.featured ? 'ring-2 ring-primary bg-gradient-primary/5' : 'bg-card'
              } hover:scale-105 transition-all duration-300`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Badge (forced on featured/Premium) */}
              {plan.badge && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg">
                  {plan.badge}
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
                {plan.description && (
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map(
                  (
                    feature: { text: string | string[]; included: boolean },
                    i: number
                  ) => (
                    <div key={i} className="flex items-start space-x-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      )}
                      {/* UPDATED: Logic to handle multi-line text */}
                      <div
                        className={`text-sm ${
                          feature.included
                            ? 'text-foreground'
                            : 'text-muted-foreground line-through'
                        }`}
                      >
                        {Array.isArray(feature.text) ? (
                          feature.text.map((line, lineIndex) => (
                            <span key={lineIndex} className="block">
                              {line}
                            </span>
                          ))
                        ) : (
                          feature.text
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* CTA Button (keeps your original primary/secondary styling) */}
              <Button
                className={`w-full ${
                  plan.featured ? 'btn-wellness-primary' : 'btn-wellness-secondary'
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
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
