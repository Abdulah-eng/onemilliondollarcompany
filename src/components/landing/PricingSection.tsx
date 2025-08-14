// File: src/components/landing/PricingSection.tsx
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLANS } from '@/mockdata/landingpage/plans';

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Choose Your Transformation Plan
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            🚀 Start your journey with the perfect plan for your goals.
          </p>
        </div>

        {/* Mobile-first: horizontal scroll; Desktop (lg+): original 3-col grid */}
        <div
          className="
            /* base → iPad & below: snap carousel */
            flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden
            snap-x snap-mandatory scroll-px-4
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden

            /* desktop: restore original grid exactly */
            lg:overflow-visible lg:scroll-px-0
            lg:grid lg:grid-cols-3 lg:gap-8 lg:max-w-6xl lg:mx-auto
          "
          role="list"
          aria-label="Pricing plans"
        >
          {PLANS.map((plan, index) => (
            <div
              key={plan.name}
              role="listitem"
              className={`
                wellness-card relative p-8 rounded-3xl bg-white
                ${plan.featured ? 'ring-2 ring-emerald-500 bg-emerald-50 border border-emerald-200' : 'border border-gray-200'}
                hover:scale-105 transition-all duration-300 shadow-md

                /* card widths for horizontal mode (<= lg) */
                snap-start shrink-0 min-w-[88%] sm:min-w-[75%] md:min-w-[60%]

                /* desktop: cancel min-width so grid controls size (no wide cards) */
                lg:min-w-0 lg:w-auto
              `}
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
                  <span className="text-3xl font-bold text-emerald-600">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
                {(plan as any).summary || plan.description ? (
                  <p className="text-sm text-muted-foreground">
                    {(plan as any).summary || plan.description}
                  </p>
                ) : null}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? 'text-foreground' : 'text-muted-foreground line-through'
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA — correct green gradient */}
              <Button className="w-full btn-wellness-primary">
                {(plan as any).ctaText || plan.cta || 'Get Started'}
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
