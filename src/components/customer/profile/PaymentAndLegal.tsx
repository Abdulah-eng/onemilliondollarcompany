import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/contexts/AuthContext';
import { createCheckoutSession, syncCheckoutSession, cancelSubscriptionAtPeriodEnd, resumeSubscription, openCustomerPortal } from '@/lib/stripe/api';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePaymentInfo } from '@/hooks/usePaymentInfo';
import { useCurrencyDetection } from '@/hooks/useCurrencyDetection';

const PaymentAndLegal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const { paymentInfo, loading: paymentLoading } = usePaymentInfo();
  const { detectedCurrency, getCurrencyOption } = useCurrencyDetection();
  const [selectedCurrency, setSelectedCurrency] = useState(detectedCurrency);

  // Update selected currency when detected currency changes
  useEffect(() => {
    setSelectedCurrency(detectedCurrency);
  }, [detectedCurrency]);

  const handleSubscribe = async () => {
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        alert('Failed to load Stripe. Please try again.');
        return;
      }
      
      const { checkoutUrl } = await createCheckoutSession({
        priceKey: 'platform_monthly',
        trialDays: 14,
        stripeCustomerId: profile?.stripe_customer_id ?? null,
        currency: selectedCurrency,
        userId: profile?.id,
      });
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert('Failed to create checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription process. Please try again.');
    }
  };

  const handleCancelAtPeriodEnd = async () => {
    try {
      if (!profile?.stripe_subscription_id) {
        alert('No active subscription found.');
        return;
      }
      const res = await cancelSubscriptionAtPeriodEnd(profile.stripe_subscription_id);
      if (res?.success) {
        alert('Your subscription will be canceled at the end of the current period.');
        window.location.reload();
      } else {
        alert(res?.error || 'Failed to schedule cancellation');
      }
    } catch (e: any) {
      alert(e?.message || 'Failed to schedule cancellation');
    }
  };

  const handleResume = async () => {
    try {
      if (!profile?.stripe_subscription_id) {
        alert('No active subscription found.');
        return;
      }
      const res = await resumeSubscription(profile.stripe_subscription_id);
      if (res?.success) {
        alert('Your subscription has been resumed.');
        window.location.reload();
      } else {
        alert(res?.error || 'Failed to resume subscription');
      }
    } catch (e: any) {
      alert(e?.message || 'Failed to resume subscription');
    }
  };

  const handleOpenCustomerPortal = async () => {
    try {
      if (!profile?.stripe_customer_id) {
        alert('No Stripe customer found on your profile.');
        return;
      }
      const { url } = await openCustomerPortal(profile.stripe_customer_id, `${window.location.origin}/customer/settings`);
      if (url) {
        window.location.href = url;
      }
    } catch (e: any) {
      alert(e?.message || 'Failed to open billing portal');
    }
  };

  // After redirect from Stripe success, sync immediately then refresh
  const params = new URLSearchParams(location.search);
  const status = params.get('status');
  const sessionId = params.get('session_id');
  if (status === 'success' && sessionId) {
    console.log('[Frontend] Returning from Stripe. Syncing session', sessionId);
    syncCheckoutSession(sessionId)
      .then((data) => {
        console.log('[Frontend] Sync response', data);
        if (data && data.ok) {
          alert('Subscription activated successfully. Plan info updated.');
        } else {
          alert(`Subscription sync failed: ${data?.error || 'Unknown error'}`);
        }
        window.location.replace('/customer/settings');
      })
      .catch((err) => {
        console.error('[Frontend] Sync request error', err);
        alert('Subscription sync failed due to a network error.');
        window.location.replace('/customer/settings');
      });
  }
  return (
    <div className="space-y-6">
      <Card className="shadow-md rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">Settings & Legal</h3>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base font-medium">Payment & Subscription</AccordionTrigger>
            <AccordionContent className="p-4 space-y-6">
              {paymentLoading ? (
                <div className="text-center py-4">Loading payment information...</div>
              ) : paymentInfo ? (
                <>
                  <div className="space-y-2 text-sm">
                    <p><strong>Current Plan:</strong> {paymentInfo.currentPlan.name}</p>
                    <p><strong>Price:</strong> {paymentInfo.currentPlan.price} / {paymentInfo.currentPlan.billingCycle}</p>
                    <p><strong>Next Billing:</strong> {paymentInfo.currentPlan.nextBillingDate}</p>
                    <p><strong>Status:</strong> <span className={`capitalize ${paymentInfo.currentPlan.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{paymentInfo.currentPlan.status}</span></p>
                  </div>
                  {paymentInfo.paymentMethod ? (
                    <div className="space-y-2 text-sm">
                      <p><strong>Card:</strong> {paymentInfo.paymentMethod.brand} ending in {paymentInfo.paymentMethod.last4}</p>
                      <p><strong>Expires:</strong> {paymentInfo.paymentMethod.expiry}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>No payment method on file</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4 text-muted-foreground">No payment information available</div>
              )}
                {/* Payment method updates are managed in Stripe Billing Portal */}
              <div className="space-y-4">
                {/* Currency is auto-detected; selector hidden */}
                <div className="space-y-2 text-sm">
                  {paymentInfo?.currentPlan?.status === 'active' ? (
                    // User has an active plan - show manage billing and cancel options
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleOpenCustomerPortal}
                      >
                        Manage Billing
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="ml-2"
                        onClick={handleCancelAtPeriodEnd}
                      >
                        Cancel Subscription
                      </Button>
                    </>
                  ) : (
                    // User doesn't have an active plan - show subscribe option
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={handleSubscribe}
                    >
                      Subscribe {getCurrencyOption(selectedCurrency).price}/mo (14-day trial)
                    </Button>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base font-medium">Privacy Policy & Terms</AccordionTrigger>
            <AccordionContent className="p-4 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Privacy Policy</h4>
                    <p className="text-sm text-muted-foreground">
                      Learn how we protect and use your data
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/privacy')}
                  >
                    Read Policy
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Terms of Service</h4>
                    <p className="text-sm text-muted-foreground">
                      Review our terms and conditions
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/terms')}
                  >
                    Read Terms
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
};

export default PaymentAndLegal;
