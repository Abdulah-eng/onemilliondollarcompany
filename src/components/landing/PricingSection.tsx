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

        {/* Horizontal scroll for tablets & below */}
        <div
          className="
            -mx-4 px-4
            flex gap-4 overflow-x-auto snap-x snap-mandatory
            md:gap-6
            lg:mx-auto lg:px-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible
          "
        >
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative p-8 snap-start shrink-0 rounded-3xl
                min-w-[85%] sm:min-w-[70%] md:min-w-[60%]
                bg-white shadow-md border border-gray-200
                lg:min-w-0 lg:shrink
              `}
            >
              {/* Plan header */}
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="text-3xl font-bold text-orange-500">
                  {plan.price}
                  <span className="text-base text-gray-500 ml-1">/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="mb-8 space-y-3 text-sm">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    {f.included ? (
                      <span className="text-green-500 text-lg">✔</span>
                    ) : (
                      <span className="text-red-500 text-lg">✘</span>
                    )}
                    <span className={`${!f.included ? 'line-through text-gray-400' : 'text-gray-700'}`}>
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

        {/* Footer note */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          ✨ 14-day free trial on Standard · 🔒 Secure payment · ❌ Cancel anytime
        </div>
      </div>
    </section>
  );
}
