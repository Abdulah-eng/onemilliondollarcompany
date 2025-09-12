import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PlanSelectionCard from '@/components/customer/payment/PlanSelectionCard';
import PaymentMethodCard from '@/components/customer/payment/PaymentMethodCard';
import UpdatePaymentMethodForm from '@/components/customer/payment/UpdatePaymentMethodForm';
import { toast } from 'sonner';

const UpdatePaymentPlanPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlanSelect = (planKey: string) => {
    setSelectedPlan(planKey);
  };

  const handleUpdatePaymentMethod = () => {
    setShowPaymentForm(true);
  };

  const handleConfirmUpdate = async () => {
    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    toast.success('Plan updated successfully!');
    navigate('/customer/settings');
  };

  if (showPaymentForm) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setShowPaymentForm(false)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plan Selection
          </Button>
        </div>
        <UpdatePaymentMethodForm />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/customer/settings')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Update Plan</h1>
          <p className="text-muted-foreground">Choose a new plan that fits your needs</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PlanSelectionCard 
            onSelectPlan={handlePlanSelect}
            selectedPlan={selectedPlan}
          />
        </div>
        
        <div className="space-y-6">
          <PaymentMethodCard 
            onUpdate={handleUpdatePaymentMethod}
          />
          
          {selectedPlan && (
            <div className="sticky top-4">
              <div className="p-4 bg-muted rounded-lg space-y-4">
                <h3 className="font-semibold">Plan Update Summary</h3>
                <p className="text-sm text-muted-foreground">
                  Your new plan will take effect immediately and you'll be charged the prorated amount.
                </p>
                <Button 
                  onClick={handleConfirmUpdate}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Plan Update'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatePaymentPlanPage;