import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import CancellationSurvey from '@/components/customer/payment/CancellationSurvey';
import { customerProfile } from '@/mockdata/profile/profileData';

const steps = [
  { id: 'survey', label: 'Survey' },
  { id: 'confirmation', label: 'Confirmation' },
  { id: 'success', label: 'Success' },
];

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
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    setStep('success');
  };

  const handleKeepSubscription = () => {
    navigate('/customer/settings');
  };

  // --- Progress Bar Component ---
  const ProgressBar = () => {
    const activeIndex = steps.findIndex((s) => s.id === step);

    return (
      <div className="flex justify-between items-center w-full max-w-2xl mx-auto px-2 sm:px-0 mb-6">
        {steps.map((s, index) => (
          <div key={s.id} className="flex-1 flex flex-col items-center">
            {/* Circle */}
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold 
              ${index <= activeIndex ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
            >
              {index + 1}
            </div>
            {/* Label */}
            <span
              className={`mt-1 text-[10px] sm:text-xs ${
                index <= activeIndex ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (step === 'success') {
    return (
      <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <ProgressBar />
        <Card className="text-center">
          <CardHeader>
            <CheckCircle className="h-14 w-14 sm:h-16 sm:w-16 text-primary mx-auto mb-3 sm:mb-4" />
            <CardTitle className="text-xl sm:text-2xl">Subscription Cancelled</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm sm:text-base text-muted-foreground">
              Your subscription has been cancelled. You’ll still have access until{' '}
              {payment.currentPlan.nextBillingDate}.
            </p>
            <Alert>
              <AlertDescription>
                We’ve sent a confirmation email with the cancellation details.
              </AlertDescription>
            </Alert>
            <div className="pt-3 sm:pt-4">
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
      <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6">
        <ProgressBar />
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <Button variant="ghost" onClick={() => setStep('survey')} className="w-fit">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-destructive">Final Confirmation</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive text-lg sm:text-xl">
              <AlertTriangle className="h-5 w-5" />
              Are you sure you want to cancel?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription>
                <strong>What happens when you cancel:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm sm:text-base">
                  <li>Ends on {payment.currentPlan.nextBillingDate}</li>
                  <li>Lose access to premium features</li>
                  <li>Data preserved for 30 days</li>
                  <li>No refunds for current billing period</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="p-3 sm:p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2 text-sm sm:text-base">Your cancellation reason:</h4>
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
              <div className="text-center space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-primary">Wait! Before you go...</h4>
                <p className="text-sm text-muted-foreground">
                  You can pause your subscription instead and resume within 6 months.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={handleKeepSubscription}
                    className="w-full sm:flex-1"
                  >
                    Pause Instead
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleFinalCancel}
                    disabled={isProcessing}
                    className="w-full sm:flex-1"
                  >
                    {isProcessing ? 'Cancelling...' : 'Yes, Cancel'}
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
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6">
      <ProgressBar />
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Button variant="ghost" onClick={() => navigate('/customer/settings')} className="w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-destructive">Cancel Subscription</h1>
          <p className="text-sm sm:text-base text-muted-foreground">We’re sorry to see you go</p>
        </div>
      </div>

      <CancellationSurvey onSubmit={handleSurveySubmit} onCancel={handleKeepSubscription} />
    </div>
  );
};

export default CancelSubscriptionPage;
