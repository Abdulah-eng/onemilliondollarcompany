// src/components/landing/PricingSection.tsx

import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLANS } from '@/mockdata/landingpage/plans';
import { Link } from 'react-router-dom'; // 👈 STEP 1: Import Link

const PricingSection = () => {
  const plans = PLANS.map((p: any) => ({
    // ... (the plan mapping logic remains the same)
  }));

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header is unchanged */}
        <div className="text-center mb-16">
           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
             Choose Your Transformation Plan
           </h2>
           <p className="text-lg sm:text-xl text-muted-foreground">
             🚀 Start your journey with the perfect plan for your goals.
           </p>
         </div>

        <div className="flex gap-8 overflow-x-auto py-8 -mx-4 px-4 lg:grid lg:grid-cols-3 lg:mx-auto lg:px-0">
          {plans.map((plan: any, index: number) => (
            <div
              key={plan.name}
              className={`wellness-card p-8 relative rounded-3xl shadow-xl min-w-[300px] flex-shrink-0 ${
                plan.featured ? 'ring-2 ring-primary bg-gradient-primary/5' : 'bg-card'
              } hover:scale-105 transition-all duration-300`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Badge, Plan Header, and Features are unchanged */}
              
              {/* 👇 STEP 2: Update CTA Button */}
              <Link to="/get-started">
                <Button
                  className={`w-full ${
                    plan.featured ? 'btn-wellness-primary' : 'btn-wellness-secondary'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
        
        {/* Footer Note is unchanged */}
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
