import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/contexts/AuthContext';
import { createCheckoutSession, syncCheckoutSession } from '@/lib/stripe/api';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { customerProfile } from '@/mockdata/profile/profileData';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const PaymentAndLegal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { payment, preferences } = customerProfile;
  const { profile } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState('usd');

  const currencyOptions = [
    { value: 'usd', label: 'USD - $29.99/month', price: '$29.99' },
    { value: 'nok', label: 'NOK - 299 kr/month', price: '299 kr' },
    { value: 'sek', label: 'SEK - 299 kr/month', price: '299 kr' },
    { value: 'dkk', label: 'DKK - 199 kr/month', price: '199 kr' },
  ];

  const handleSubscribe = async () => {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) return;
    const { checkoutUrl } = await createCheckoutSession({
      priceKey: 'platform_monthly',
      trialDays: 14,
      stripeCustomerId: profile?.stripe_customer_id ?? null,
      currency: selectedCurrency,
      userId: profile?.id,
    });
    window.location.href = checkoutUrl;
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
              <div className="space-y-2 text-sm">
                <p><strong>Current Plan:</strong> {payment.currentPlan.name}</p>
                <p><strong>Price:</strong> {payment.currentPlan.price} / {payment.currentPlan.billingCycle}</p>
                <p><strong>Next Billing:</strong> {payment.currentPlan.nextBillingDate}</p>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Card:</strong> {payment.paymentMethod.brand} ending in {payment.paymentMethod.last4}</p>
                <p><strong>Expires:</strong> {payment.paymentMethod.expiry}</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">Update Payment Method</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Payment Method</DialogTitle>
                      <DialogDescription>Enter your new payment details.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Card Number" />
                      <div className="flex gap-4">
                        <Input placeholder="MM/YY" className="w-1/2" />
                        <Input placeholder="CVC" className="w-1/2" />
                      </div>
                      <Button className="w-full">Save</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency-select">Choose Currency</Label>
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
                <div className="space-y-2 text-sm">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/customer/payment/update-plan')}
                  >
                    Update Plan
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="ml-2"
                    onClick={() => navigate('/customer/payment/cancel-subscription')}
                  >
                    Cancel Subscription
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="ml-2"
                    onClick={handleSubscribe}
                  >
                    Subscribe {currencyOptions.find(opt => opt.value === selectedCurrency)?.price}/mo (14-day trial)
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base font-medium">Preferences</AccordionTrigger>
            <AccordionContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme-select">Theme</Label>
                <Select>
                  <SelectTrigger id="theme-select" className="w-[120px]">
                    <SelectValue placeholder={preferences.theme} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="new-messages">New Messages</Label>
                <Switch checked={preferences.notifications.newMessages} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="coach-feedback">Coach Feedback</Label>
                <Switch checked={preferences.notifications.coachFeedback} />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
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
