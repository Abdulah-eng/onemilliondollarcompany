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
      oldPrice: p.oldPrice,
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
        <div className="text-center mb-12" data-reveal>
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

        {/* Responsive Grid for Cards */}
        <div
          className="relative pt-8 grid grid-flow-col auto-cols-[90%] sm:auto-cols-[380px] lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-3 gap-8 overflow-x-auto lg:overflow-visible pb-8 lg:py-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          data-reveal
        >
          {plans.map((plan: any) => (
            <div
              key={plan.name}
              className={cn(
                'relative p-8 rounded-3xl border flex flex-col',
                plan.featured
                  ? 'bg-gradient-to-b from-gray-900 to-black text-white border-primary/50 lg:scale-105'
                  : 'bg-card border-border'
              )}
            >
              {plan.badge && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-orange-400 text-white shadow-lg text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="flex-grow pt-4">
                {plan.icon && <plan.icon className="w-8 h-8 mb-4 text-primary drop-shadow-[0_2px_4px_rgba(251,146,60,0.5)]" />}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={cn('text-sm h-10', plan.featured ? 'text-white/70' : 'text-muted-foreground')}>
                  {plan.description}
                </p>

                <div className="my-8 flex items-end gap-2">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  {plan.oldPrice && (
                    <span className={cn('text-xl line-through', plan.featured ? 'text-white/50' : 'text-muted-foreground/80')}>{plan.oldPrice}</span>
                  )}
                  <span className={cn('text-sm', plan.featured ? 'text-white/70' : 'text-muted-foreground')}>
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-4 text-left">
                  {plan.features.map((feature: any, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{Array.isArray(feature.text) ? feature.text.join(' ') : feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                asChild
                className={cn(
                  'w-full mt-8',
                  plan.featured
                    ? 'text-white bg-gradient-to-r from-primary to-orange-400 hover:opacity-90 border-0'
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
