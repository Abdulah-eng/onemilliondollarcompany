import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { customerProfile } from '@/mockdata/profile/profileData';
import { useNavigate } from 'react-router-dom';

const PaymentAndLegal = () => {
  const navigate = useNavigate();
  const { payment, preferences } = customerProfile;
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
