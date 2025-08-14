// File: src/components/landing/PricingSection.tsx
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLANS } from '@/mockdata/landingpage/plans';

export default function PricingSection() {
  const navigate = useNavigate();

  const handlePlanClick = (planKey: string) => {
    navigate(`/get-started?plan=${encodeURIComponent(planKey)}`);
  };

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Choose Your Transformation Plan
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            🚀 Start your journey with the perfect plan for your goals.
          </p>
        </div>

        {/* ≤ iPad: horizontal snap; ≥ lg: 3 fixed-width cards centered */}
        <div
          className="
            flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden
            snap-x snap-mandatory scroll-px-4
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            lg:overflow-visible lg:scroll-px-0
            lg:grid lg:grid-cols-3 lg:gap-8 lg:justify-items-center
            lg:max-w-6xl lg:mx-auto
          "
          role="list"
          aria-label="Pricing plans"
        >
          {PLANS.map((plan, idx) => {
            const isPopular = Boolean((plan as any).popular);
            const periodLabel = plan.period === 'One-Time' ? plan.period : `/${plan.period}`;

            return (
              <div
                key={`${plan.name}-${idx}`}
                role="listitem"
                className={`
                  relative p-8 snap-start shrink-0 rounded-3xl
                  border ${isPopular ? 'border-emerald-300 ring-1 ring-emerald-300' : 'border-gray-200'}
                  bg-white shadow-md transition-transform md:hover:scale-105
                  bg-gradient-to-br ${plan.gradient || 'from-white to-white'}
                  /* width behavior */
                  min-w-[88%] sm:min-w-[70%] md:min-w-[58%]      /* mobile/tablet: nice peeking */
                  lg:min-w-0 lg:w-[340px] xl:w-[360px]           /* desktop: fixed width, no stretch */
                `}
              >
                {/* Corner ⭐ badge */}
                {isPopular && (
                  <div className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-orange-500 text-white shadow-lg grid place-items-center">
                    <span className="text-lg leading-none">⭐</span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-1">{plan.name}</h3>
                  <div className="mb-1">
                    <span className="text-3xl font-extrabold text-emerald-600">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{periodLabel}</span>
                  </div>
                  {plan.summary && <p className="text-sm text-muted-foreground">{plan.summary}</p>}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((f: any, i: number) => (
                    <div key={i} className="flex items-start space-x-3">
                      {f.included ? (
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${f.included ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  onClick={() => handlePlanClick(plan.planKey)}
                  className={`w-full ${isPopular ? 'btn-wellness-primary' : 'btn-wellness-secondary'}`}
                >
                  {plan.ctaText}
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
}
