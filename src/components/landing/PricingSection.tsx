// File: src/components/landing/PricingSection.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLANS } from '@/mockdata/landingpage/plans';

export default function PricingSection() {
  const router = useRouter();

  const handlePlanClick = (planKey: string) => {
    router.push(`/get-started?plan=${encodeURIComponent(planKey)}`);
  };

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="reveal text-center mb-16" data-reveal>
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold">
            Choose Your Transformation Plan
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            🚀 Start your journey with the perfect plan for your goals.
          </p>
        </div>

        {/* Horizontal scroll on iPad & below; 3-col grid on lg+ */}
        <div
          className="
            -mx-4 px-4
            flex gap-4 overflow-x-auto snap-x snap-mandatory
            md:gap-6
            lg:mx-auto lg:px-0 lg:grid lg:max-w-6xl lg:grid-cols-3 lg:gap-8 lg:overflow-visible
          "
          role="list"
          aria-label="Pricing plans"
        >
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              role="listitem"
              className={`
                reveal relative p-8 snap-start shrink-0 rounded-3xl
                min-w-[85%] sm:min-w-[70%] md:min-w-[60%]
                transition-transform md:hover:scale-105
                bg-gradient-to-br ${plan.gradient}
                border-2 ${plan.popular ? 'border-orange-300' : 'border-border'}
                lg:min-w-0 lg:shrink
              `}
              data-reveal
            >
              {/* Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow">
                    ⭐ Most Popular
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6 mt-2 text-center">
                <h3 className="mb-2 text-2xl font-bold text-foreground">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.summary}</p>
              </div>

              {/* Features */}
              <div className="mb-8 space-y-3">
                {plan.features.map((f, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 text-sm ${
                      f.highlight ? 'bg-white/70 dark:bg-white/10 rounded-lg p-2 border border-orange-200/60' : ''
                    }`}
                  >
                    {f.included ? (
                      <Check className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
                    ) : (
                      <X className="mt-0.5 h-5 w-5 text-muted-foreground" aria-hidden />
                    )}
                    <span className={`${f.included ? 'text-foreground' : 'text-muted-foreground line-through'} leading-relaxed`}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                onClick={() => handlePlanClick(plan.planKey)}
                className={`w-full ${plan.popular ? 'btn-wellness-primary' : 'btn-wellness-secondary'}`}
              >
                {plan.ctaText}
              </Button>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            ✨ 14-day free trial on Standard · 🔒 Secure payment · ❌ Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
