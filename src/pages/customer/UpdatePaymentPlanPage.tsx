import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe } from 'lucide-react';
import PlanSelectionCard from '@/components/customer/payment/PlanSelectionCard';
import { toast } from 'sonner';
import { createCheckoutSession } from '@/lib/stripe/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrencyDetection } from '@/hooks/useCurrencyDetection';

const UpdatePaymentPlanPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { detectedCurrency, getCurrencyOption, loading: currencyLoading } = useCurrencyDetection();

  const handlePlanSelect = (planKey: string) => {
    setSelectedPlan(planKey);
  };

  // Auto-select the plan on mount
  useEffect(() => {
    if (!selectedPlan) {
      setSelectedPlan('all-access');
    }
  }, [selectedPlan]);

  const handleConfirmUpdate = async () => {
    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }

    setIsProcessing(true);
    try {
      // Map UI plan keys to backend price keys
      const planKeyMap: Record<string, { priceKey: string; trialDays?: number }> = {
        'all-access': { priceKey: 'platform_monthly' },
        premium: { priceKey: 'platform_monthly' },
        standard: { priceKey: 'platform_monthly', trialDays: 14 },
        basic: { priceKey: 'platform_monthly' },
      };
      const mapped = planKeyMap[selectedPlan] || { priceKey: selectedPlan };
      const { checkoutUrl } = await createCheckoutSession({
        ...mapped,
        currency: detectedCurrency,
        stripeCustomerId: profile?.stripe_customer_id ?? null,
        userId: profile?.id,
      });
      window.location.href = checkoutUrl;
    } catch (e: any) {
      toast.error(e?.message || 'Failed to start checkout');
      setIsProcessing(false);
    }
  };

  const currencyOption = getCurrencyOption(detectedCurrency);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/customer/settings')}
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Update Your Plan</h1>
          <p className="text-sm text-muted-foreground">
            Complete access to transform your health
          </p>
        </div>
      </div>

      <PlanSelectionCard
        onSelectPlan={handlePlanSelect}
        selectedPlan={selectedPlan}
        detectedCurrency={detectedCurrency}
        currencyLoading={currencyLoading}
      />

      {selectedPlan && (
        <div className="sticky bottom-4 p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-xl shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Ready to Transform?</h3>
              <p className="text-sm text-muted-foreground">
                Your subscription starts immediately
              </p>
            </div>
            {currencyLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 animate-pulse" />
                Detecting...
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                {currencyOption.country}
              </div>
            )}
          </div>
          
          <Button
            onClick={handleConfirmUpdate}
            disabled={isProcessing || currencyLoading}
            size="lg"
            className="w-full h-11 text-base font-semibold"
          >
            {isProcessing ? 'Processing...' : `Subscribe Now - ${currencyOption.price}/month`}
          </Button>
          
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span>✓ Cancel Anytime</span>
            <span>✓ Secure Payment</span>
            <span>✓ Instant Access</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatePaymentPlanPage;
