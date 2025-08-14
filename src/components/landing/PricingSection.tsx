import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLANS } from '@/mockdata/landingpage/plans';

export default function PricingSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal text-center mb-16" data-reveal>
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold">
            Choose Your Transformation Plan
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            🚀 Start your journey with the perfect plan for your goals.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div 
              key={plan.name} 
              className={`reveal relative p-8 bg-card rounded-3xl shadow-card transition-transform duration-300 hover:scale-105 ${
                plan.featured ? 'ring-2 ring-primary bg-primary/5' : ''
              }`} 
              data-reveal
            >
              {plan.badge && (
                <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6 text-center">
                <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-8 space-y-3">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    {f.included ? (
                      <Check className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
                    ) : (
                      <X className="mt-0.5 h-5 w-5 text-muted-foreground" aria-hidden />
                    )}
                    <span className={`text-sm ${
                      f.included ? 'text-foreground' : 'text-muted-foreground line-through'
                    }`}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>

              <Button 
                className={`w-full rounded-2xl ${
                  plan.featured ? 'btn-wellness-primary' : 'btn-wellness-secondary'
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            ✨ 14-day free trial on Standard · 🔒 Secure payment · ❌ Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}