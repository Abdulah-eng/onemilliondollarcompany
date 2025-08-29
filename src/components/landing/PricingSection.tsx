import { Check, Sparkles, ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLANS } from '@/mockdata/landingpage/plans';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const PricingSection = () => {
  const plans = PLANS.map((p: any) => {
    let icon;
    if (p.name === 'Premium') icon = Sparkles;
    else if (p.name === 'Standard') icon = User;
    else icon = ShieldCheck;

    return {
      name: p.name,
      price: p.price,
      period: p.period === 'One-Time' ? 'one-time' : `/${p.period}`,
      description: p.summary,
      features: p.features.filter((f: any) => f.included),
      cta: p.ctaText,
      featured: p.popular,
      badge: p.popular ? 'Most Popular' : null,
      icon: icon,
    };
  });

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16" data-reveal>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-foreground mb-4">
            Choose Your Transformation Plan
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Start your journey with the perfect plan for your goals. No hidden fees, just pure value.
          </p>
          <div className="mt-6 flex justify-center items-center gap-x-4 sm:gap-x-6 text-sm text-muted-foreground">
            <span>✓ 14-day free trial on Standard</span>
            <span className="text-primary">•</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>

        {/* Scrollable Cards */}
        <div
          className="flex gap-6 overflow-x-auto px-2 scroll-px-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          data-reveal
        >
          {plans.map((plan: any) => (
            <div
              key={plan.name}
              className={cn(
                'relative flex-shrink-0 snap-center p-6 sm:p-8 rounded-3xl border flex flex-col h-full w-[280px] sm:w-[320px] md:w-[360px]',
                plan.featured
                  ? 'bg-foreground text-background border-primary/50'
                  : 'bg-card border-border'
              )}
            >
              {plan.badge && (
                <div className="absolute top-0 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="flex-grow">
                {plan.icon && <plan.icon className="w-8 h-8 mb-4 text-primary" />}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p
                  className={cn(
                    'text-sm h-10',
                    plan.featured ? 'text-background/70' : 'text-muted-foreground'
                  )}
                >
                  {plan.description}
                </p>

                <div className="my-6 flex items-end gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  <span
                    className={cn('text-sm', plan.featured ? 'text-background/70' : 'text-muted-foreground')}
                  >
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-3 text-left">
                  {plan.features.map((feature: any, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        {Array.isArray(feature.text) ? feature.text.join(' ') : feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                asChild
                className={cn(
                  'w-full mt-6',
                  plan.featured
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20'
                )}
                size="lg"
              >
                <Link to="/get-started">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
