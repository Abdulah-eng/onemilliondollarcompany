
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLANS } from '@/mockdata/landingpage/plans';

const PricingSection = () => {
  // Normalize mock data to the expected shape (no layout changes)
  const plans = PLANS.map((p: any) => {
    const featured = p.featured ?? p.popular ?? false;
    const description = p.description ?? p.summary ?? '';
    const cta = p.cta ?? p.ctaText ?? 'Get Started';
    const badge = p.badge ?? (featured ? '⭐' : null);
    const period =
      p.period === 'One-Time' || p.period?.startsWith('/') ? p.period : `/${p.period}`;

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

        {/* Pricing Cards — SAME grid & sizing as your original */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan: any, index: number) => (
            <div
              key={plan.name}
              className={`wellness-card p-8 relative ${
                plan.featured ? 'ring-2 ring-primary bg-gradient-primary/5' : ''
              } rounded-3xl hover:scale-105 transition-all duration-300
                 shadow-lg hover:shadow-2xl`}   {/* <-- shadows added */}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Badge (forced on featured/Premium if present) */}
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
                  <span className="text-3xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                {plan.description && (
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map(
                  (feature: { text: string; included: boolean }, i: number) => (
                    <div key={i} className="flex items-start space-x-3">
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
                  )
                )}
              </div>

              {/* CTA Button (same classes as your original) */}
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
