// File: src/components/landing/PricingSection.tsx
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLANS } from '@/mockdata/landingpage/plans';

const PricingSection = () => {
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
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan, index) => (
            <div
              key={plan.name}
              className={`wellness-card p-8 relative ${
                plan.featured
                  ? 'ring-2 ring-emerald-500 bg-emerald-50'
                  : 'border border-gray-200'
              } hover:scale-105 transition-all duration-300 rounded-3xl bg-white`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 -right-3 w-9 h-9 bg-orange-500 text-white rounded-full flex items-center justify-center text-lg shadow-md">
                  {plan.badge}
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span
                    className={`text-3xl font-bold ${
                      plan.featured ? 'text-emerald-600' : 'text-emerald-500'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-start space-x-3"
                  >
                    {feature.included ? (
                      <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
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
                  plan.featured
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-emerald-600'
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
