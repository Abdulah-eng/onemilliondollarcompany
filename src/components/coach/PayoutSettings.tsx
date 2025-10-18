import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCoachPayoutSettings } from '@/hooks/useCoachPayoutSettings';
import { DollarSign, CreditCard, Banknote, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const PayoutSettings = () => {
  const { settings, balance, loading, error, updateSettings, requestPayout } = useCoachPayoutSettings();
  const [payoutAmount, setPayoutAmount] = useState('');
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);

  const handleUpdateSettings = async (formData: any) => {
    const success = await updateSettings(formData);
    if (success) {
      toast.success('Payout settings updated successfully');
    } else {
      toast.error('Failed to update payout settings');
    }
  };

  const handleRequestPayout = async () => {
    const amount = parseFloat(payoutAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!balance || amount > balance.availableBalance / 100) {
      toast.error('Insufficient available balance');
      return;
    }

    setIsRequestingPayout(true);
    const success = await requestPayout(Math.round(amount * 100));
    if (success) {
      toast.success('Payout request submitted successfully');
      setPayoutAmount('');
    } else {
      toast.error('Failed to request payout');
    }
    setIsRequestingPayout(false);
  };

  if (loading && !settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payout Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      {balance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Earnings Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${(balance.totalEarnings / 100).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${(balance.availableBalance / 100).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Available Balance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  ${(balance.pendingAmount / 100).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Pending Payouts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout Request */}
      {balance && balance.availableBalance > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Request Payout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="payoutAmount">Amount (USD)</Label>
                <Input
                  id="payoutAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  max={balance.availableBalance / 100}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleRequestPayout}
                  disabled={isRequestingPayout || !payoutAmount}
                  className="min-w-[120px]"
                >
                  {isRequestingPayout ? 'Processing...' : 'Request Payout'}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Available balance: ${(balance.availableBalance / 100).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payout Method Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Method</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bank" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
              <TabsTrigger value="paypal">PayPal</TabsTrigger>
              <TabsTrigger value="stripe">Stripe</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bank" className="space-y-4">
              <BankTransferForm 
                settings={settings} 
                onUpdate={handleUpdateSettings}
                loading={loading}
              />
            </TabsContent>
            
            <TabsContent value="paypal" className="space-y-4">
              <PayPalForm 
                settings={settings} 
                onUpdate={handleUpdateSettings}
                loading={loading}
              />
            </TabsContent>
            
            <TabsContent value="stripe" className="space-y-4">
              <StripeForm 
                settings={settings} 
                onUpdate={handleUpdateSettings}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}
    </div>
  );
};

const BankTransferForm = ({ settings, onUpdate, loading }: any) => {
  const [formData, setFormData] = useState({
    account_holder: settings?.bank_details?.account_holder || '',
    account_number: settings?.bank_details?.account_number || '',
    routing_number: settings?.bank_details?.routing_number || '',
    bank_name: settings?.bank_details?.bank_name || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      payout_method: 'bank',
      bank_details: formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="account_holder">Account Holder Name</Label>
          <Input
            id="account_holder"
            value={formData.account_holder}
            onChange={(e) => setFormData({ ...formData, account_holder: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="bank_name">Bank Name</Label>
          <Input
            id="bank_name"
            value={formData.bank_name}
            onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="account_number">Account Number</Label>
          <Input
            id="account_number"
            value={formData.account_number}
            onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="routing_number">Routing Number</Label>
          <Input
            id="routing_number"
            value={formData.routing_number}
            onChange={(e) => setFormData({ ...formData, routing_number: e.target.value })}
            required
          />
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Bank Details'}
      </Button>
    </form>
  );
};

const PayPalForm = ({ settings, onUpdate, loading }: any) => {
  const [email, setEmail] = useState(settings?.paypal_email || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      payout_method: 'paypal',
      paypal_email: email,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="paypal_email">PayPal Email</Label>
        <Input
          id="paypal_email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save PayPal Email'}
      </Button>
    </form>
  );
};

const StripeForm = ({ settings, onUpdate, loading }: any) => {
  const [accountId, setAccountId] = useState(settings?.stripe_account_id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      payout_method: 'stripe',
      stripe_account_id: accountId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="stripe_account_id">Stripe Account ID</Label>
        <Input
          id="stripe_account_id"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Stripe Account'}
      </Button>
    </form>
  );
};
