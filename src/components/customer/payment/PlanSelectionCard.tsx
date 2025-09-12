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

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground">Select the plan that best fits your needs</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrentPlan = plan.name === currentPlan;
          const isSelected = selectedPlan === plan.planKey;
          
          return (
            <Card key={plan.planKey} className={`relative transition-all ${
              isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
            }`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-3">
                <CardTitle className="flex items-center justify-center gap-2">
                  {plan.name}
                  {isCurrentPlan && (
                    <Badge variant="secondary" className="text-xs">Current</Badge>
                  )}
                </CardTitle>
                <div className="space-y-1">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  {plan.oldPrice && (
                    <div className="text-sm text-muted-foreground line-through">
                      {plan.oldPrice}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.summary}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className={`h-4 w-4 mt-0.5 ${
                        feature.included ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <span className={`text-sm ${
                        feature.included ? 'text-foreground' : 'text-muted-foreground line-through'
                      }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => onSelectPlan(plan.planKey)}
                  variant={isSelected ? "default" : "outline"}
                  className="w-full"
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? 'Current Plan' : 
                   isSelected ? 'Selected' : plan.ctaText}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PlanSelectionCard;