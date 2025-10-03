import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { PLANS } from '@/mockdata/landingpage/plans';
import { customerProfile } from '@/mockdata/profile/profileData';

interface PlanSelectionCardProps {
  onSelectPlan: (planKey: string) => void;
  selectedPlan?: string;
}

const PlanSelectionCard = ({ onSelectPlan, selectedPlan }: PlanSelectionCardProps) => {
  const currentPlan = customerProfile.payment.currentPlan.name;
  const plan = PLANS[0]; // Single plan
  const isCurrentPlan = plan.name === currentPlan;
  const isSelected = selectedPlan === plan.planKey;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Transform Your Life
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Complete access to everything you need for fitness, nutrition, and mental wellness
        </p>
      </div>

      <div className="flex justify-center">
        <Card
          className={`relative w-full max-w-xl transition-all ${
            isSelected ? 'ring-2 ring-primary shadow-2xl' : 'shadow-xl'
          } bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black text-white border-primary/30`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-white text-sm px-4 py-1">
                <Star className="h-4 w-4 mr-1" />
                Complete Access
              </Badge>
            </div>
          )}

          <CardHeader className="text-center pb-4 pt-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Star className="w-8 h-8 text-primary drop-shadow-[0_2px_8px_rgba(251,146,60,0.6)]" />
              </div>
            </div>
            
            <CardTitle className="flex items-center justify-center gap-2 text-2xl sm:text-3xl">
              {plan.name}
              {isCurrentPlan && (
                <Badge variant="secondary" className="text-xs">Current</Badge>
              )}
            </CardTitle>
            
            <div className="space-y-2 my-6">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl sm:text-6xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="text-white/70 text-lg">/{plan.period}</span>
              </div>
              {plan.oldPrice && (
                <div className="text-base sm:text-lg text-white/50 line-through">
                  {plan.oldPrice}
                </div>
              )}
            </div>
            
            <p className="text-base sm:text-lg text-white/80 font-medium">{plan.summary}</p>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-sm sm:text-base text-white/90">
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => onSelectPlan(plan.planKey)}
              variant="default"
              size="lg"
              className="w-full text-base sm:text-lg h-12 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30"
              disabled={isCurrentPlan}
            >
              {isCurrentPlan ? 'Current Plan' : isSelected ? 'Selected ✓' : plan.ctaText}
            </Button>

            <div className="flex items-center justify-center gap-6 text-xs sm:text-sm text-white/60 pt-2">
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3" /> Cancel Anytime
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3" /> Secure Payment
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanSelectionCard;
