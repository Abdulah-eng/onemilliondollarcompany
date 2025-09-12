import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import CancellationSurvey from '@/components/customer/payment/CancellationSurvey';
import { customerProfile } from '@/mockdata/profile/profileData';
import { toast } from 'sonner';

const CancelSubscriptionPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'survey' | 'confirmation' | 'success'>('survey');
  const [surveyData, setSurveyData] = useState<{ reason: string; feedback: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { payment } = customerProfile;

  const handleSurveySubmit = (data: { reason: string; feedback: string }) => {
    setSurveyData(data);
    setStep('confirmation');
  };

  const handleFinalCancel = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setStep('success');
  };

  const handleKeepSubscription = () => {
    navigate('/customer/settings');
  };

  if (step === 'success') {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <Card className="text-center">
          <CardHeader>
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Subscription Cancelled</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your subscription has been cancelled successfully. You'll continue to have access to your account until {payment.currentPlan.nextBillingDate}.
            </p>
            <Alert>
              <AlertDescription>
                We've sent a confirmation email to your registered email address with the cancellation details.
              </AlertDescription>
            </Alert>
            <div className="pt-4">
              <Button onClick={() => navigate('/customer/dashboard')} className="w-full">
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setStep('survey')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-destructive">Final Confirmation</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Are you sure you want to cancel?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription>
                <strong>What happens when you cancel:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Your subscription will end on {payment.currentPlan.nextBillingDate}</li>
                  <li>You'll lose access to all premium features</li>
                  <li>Your data will be preserved for 30 days in case you want to reactivate</li>
                  <li>No refunds will be issued for the current billing period</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Your cancellation reason:</h4>
              <p className="text-sm text-muted-foreground capitalize">
                {surveyData?.reason.replace('-', ' ')}
              </p>
              {surveyData?.feedback && (
                <div className="mt-2">
                  <h5 className="font-medium text-sm">Additional feedback:</h5>
                  <p className="text-sm text-muted-foreground">{surveyData.feedback}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="text-center space-y-4">
                <h4 className="font-semibold text-primary">Wait! Before you go...</h4>
                <p className="text-sm text-muted-foreground">
                  Would you like to pause your subscription instead? You can resume anytime within 6 months.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleKeepSubscription} className="flex-1">
                    Pause Instead
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleFinalCancel}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? 'Cancelling...' : 'Yes, Cancel Subscription'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/customer/settings')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-destructive">Cancel Subscription</h1>
          <p className="text-muted-foreground">We're sorry to see you go</p>
        </div>
      </div>

      <CancellationSurvey 
        onSubmit={handleSurveySubmit}
        onCancel={handleKeepSubscription}
      />
    </div>
  );
};

export default CancelSubscriptionPage;