import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PlanSelectionCard from '@/components/customer/payment/PlanSelectionCard';
import PaymentMethodCard from '@/components/customer/payment/PaymentMethodCard';
import UpdatePaymentMethodForm from '@/components/customer/payment/UpdatePaymentMethodForm';
import { toast } from 'sonner';
import { createCheckoutSession } from '@/lib/stripe/api';
import { useAuth } from '@/contexts/AuthContext';

const UpdatePaymentPlanPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('usd');

  const currencyOptions = [
    { value: 'usd', label: 'USD - $49.99/month', price: '$49.99' },
    { value: 'nok', label: 'NOK - 499 kr/month', price: '499 kr' },
    { value: 'sek', label: 'SEK - 499 kr/month', price: '499 kr' },
    { value: 'dkk', label: 'DKK - 349 kr/month', price: '349 kr' },
  ];

  const handlePlanSelect = (planKey: string) => {
    setSelectedPlan(planKey);
  };

  // Auto-select the plan on mount
  useEffect(() => {
    if (!selectedPlan) {
      setSelectedPlan('all-access');
    }
  }, [selectedPlan]);

  const handleUpdatePaymentMethod = () => {
    setShowPaymentForm(true);
  };

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
        currency: selectedCurrency,
        stripeCustomerId: profile?.stripe_customer_id ?? null,
        userId: profile?.id,
      });
      window.location.href = checkoutUrl;
    } catch (e: any) {
      toast.error(e?.message || 'Failed to start checkout');
      setIsProcessing(false);
    }
  };

  if (showPaymentForm) {
    return (
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Button
          variant="ghost"
          onClick={() => setShowPaymentForm(false)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plan Selection
        </Button>
        <UpdatePaymentMethodForm />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/customer/settings')}
          className="w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Update Plan</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Complete access to transform your health and wellness
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <PlanSelectionCard
            onSelectPlan={handlePlanSelect}
            selectedPlan={selectedPlan}
          />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <PaymentMethodCard onUpdate={handleUpdatePaymentMethod} />
          
          <div className="p-4 bg-card border rounded-xl space-y-4">
            <h3 className="text-lg font-semibold">Currency</h3>
            <div className="space-y-2">
              <Label htmlFor="currency-select">Select Your Currency</Label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger id="currency-select" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedPlan && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-4">
              <h3 className="text-lg font-semibold">Ready to Transform?</h3>
              <p className="text-sm text-muted-foreground">
                Your subscription starts immediately with full access to all features.
              </p>
              <Button
                onClick={handleConfirmUpdate}
                disabled={isProcessing}
                size="lg"
                className="w-full h-12 text-base"
              >
                {isProcessing ? 'Processing...' : `Subscribe - ${currencyOptions.find(opt => opt.value === selectedCurrency)?.price}/mo`}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Cancel anytime • Secure payment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatePaymentPlanPage;
