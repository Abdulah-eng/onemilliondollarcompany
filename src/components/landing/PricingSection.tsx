// File: src/components/landing/PricingSection.tsx
import { useNavigate } from 'react-router-dom';
import { PLANS } from '@/mockdata/landingpage/plans';
import { Button } from '@/components/ui/button';

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
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold">
            Choose Your Transformation Plan
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            🚀 Start your journey with the perfect plan for your goals.
          </p>
        </div>

        {/* Row: snap-scroll on <= lg, grid on desktop */}
        <div
          className="
            w-full
            flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden
            snap-x snap-mandatory scroll-px-4
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            lg:overflow-visible lg:scroll-px-0
            lg:grid lg:grid-cols-3 lg:gap-8 lg:justify-between
          "
          role="list"
          aria-label="Pricing plans"
        >
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              role="listitem"
              className={`
                relative snap-start shrink-0
                rounded-3xl border border-gray-200 bg-white shadow-md
                p-8 transition-transform md:hover:scale-105
                /* card width: responsive; tight on desktop */
                min-w-[88%] sm:min-w-[70%] md:min-w-[58%]
                lg:min-w-0 lg:max-w-[360px] xl:max-w-[380px] lg:w-full lg:mx-auto
                bg-gradient-to-br ${plan.gradient || 'from-white to-white'}
              `}
            >
              {/* MOST POPULAR badge (top-right) */}
              {plan.popular && (
                <div className="absolute -top-3 -right-3 h-9 w-9 rounded-full bg-orange-500 text-white shadow-lg grid place-items-center">
                  <span className="text-base leading-none">⭐</span>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-extrabold text-emerald-600">{plan.price}</span>
                  <span className="ml-1 text-gray-500">
                    {plan.period === 'One-Time' ? plan.period : `/${plan.period}`}
                  </span>
                </div>
                {plan.summary && (
                  <p className="mt-2 text-sm text-gray-600">{plan.summary}</p>
                )}
              </div>

              {/* Features */}
              <ul className="mb-8 space-y-3 text-sm">
                {plan.features.map((f: any, i: number) => (
                  <li key={i} className={`flex items-start gap-2 ${f.highlight ? 'bg-white/70 rounded-lg p-2 border border-emerald-200/60' : ''}`}>
                    <span className={`text-lg ${f.included ? 'text-emerald-500' : 'text-gray-400'}`}>
                      {f.included ? '✓' : '✗'}
                    </span>
                    <span className={`${f.included ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                onClick={() => handlePlanClick(plan.planKey)}
                className="w-full btn-wellness-primary"
              >
                {plan.ctaText}
              </Button>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          ✨ 14-day free trial on Standard · 🔒 Secure payment · ❌ Cancel anytime
        </div>
      </div>
    </section>
  );
}
