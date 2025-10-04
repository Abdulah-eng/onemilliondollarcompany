'use client';

import React, { useState } from 'react';
import { CoachAccount } from '@/mockdata/settings/mockSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Lock, Globe, DollarSign, Save, CreditCard, Building2, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface AccountSettingsProps {
  account: CoachAccount;
  onUpdate: (updatedAccount: CoachAccount) => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ account, onUpdate }) => {
  const [formData, setFormData] = useState(account);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [payoutForm, setPayoutForm] = useState({
    method: 'bank' as 'bank' | 'paypal' | 'stripe',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    paypalEmail: '',
    stripeAccount: ''
  });
  const [isUpdatingPayout, setIsUpdatingPayout] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  const handlePasswordChange = (e: React.MouseEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    if (passwordForm.new.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    // Simulate API call for password change
    toast.success("Password successfully updated!");
    setPasswordForm({ current: '', new: '', confirm: '' });
  };
  
  const handleSave = () => {
    onUpdate(formData);
    toast.success('Account Information Updated!');
  };

  const handlePayoutUpdate = async () => {
    setIsUpdatingPayout(true);
    try {
      // Simulate API call for payout method update
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedAccount = {
        ...formData,
        payoutMethod: payoutForm.method,
        payoutDetails: payoutForm.method === 'bank' 
          ? `${payoutForm.bankName} - ****${payoutForm.accountNumber.slice(-4)}`
          : payoutForm.method === 'paypal'
          ? payoutForm.paypalEmail
          : payoutForm.stripeAccount
      };
      
      onUpdate(updatedAccount);
      setFormData(updatedAccount);
      setIsPayoutModalOpen(false);
      toast.success('Payout method updated successfully!');
    } catch (error) {
      toast.error('Failed to update payout method. Please try again.');
    } finally {
      setIsUpdatingPayout(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Contact Information */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Mail className="h-5 w-5" /> Private Contact Info
          </CardTitle>
          <CardDescription>Your email and phone number (kept private).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      {/* Payout Information */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="h-5 w-5" /> Payout Details
          </CardTitle>
          <CardDescription>Where we send your earnings (secure).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Payout Method</Label>
            <div className="flex items-center gap-2">
              {formData.payoutMethod === 'bank' && <Building2 className="h-4 w-4 text-muted-foreground" />}
              {formData.payoutMethod === 'paypal' && <CreditCard className="h-4 w-4 text-muted-foreground" />}
              {formData.payoutMethod === 'stripe' && <CreditCard className="h-4 w-4 text-muted-foreground" />}
              <Input readOnly value={formData.payoutMethod.charAt(0).toUpperCase() + formData.payoutMethod.slice(1)} />
            </div>
            <p className="text-sm text-muted-foreground">Current Details: {formData.payoutDetails}</p>
          </div>
          
          <Dialog open={isPayoutModalOpen} onOpenChange={setIsPayoutModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Update Payout Method
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Update Payout Method</DialogTitle>
                <DialogDescription>
                  Choose how you'd like to receive your earnings.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label>Payout Method</Label>
                  <Select 
                    value={payoutForm.method} 
                    onValueChange={(value: 'bank' | 'paypal' | 'stripe') => 
                      setPayoutForm({ ...payoutForm, method: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {payoutForm.method === 'bank' && (
                  <div className="space-y-3">
                    <div>
                      <Label>Bank Name</Label>
                      <Input 
                        value={payoutForm.bankName}
                        onChange={(e) => setPayoutForm({ ...payoutForm, bankName: e.target.value })}
                        placeholder="e.g., Chase Bank"
                      />
                    </div>
                    <div>
                      <Label>Account Number</Label>
                      <Input 
                        value={payoutForm.accountNumber}
                        onChange={(e) => setPayoutForm({ ...payoutForm, accountNumber: e.target.value })}
                        placeholder="1234567890"
                        type="password"
                      />
                    </div>
                    <div>
                      <Label>Routing Number</Label>
                      <Input 
                        value={payoutForm.routingNumber}
                        onChange={(e) => setPayoutForm({ ...payoutForm, routingNumber: e.target.value })}
                        placeholder="123456789"
                      />
                    </div>
                  </div>
                )}

                {payoutForm.method === 'paypal' && (
                  <div>
                    <Label>PayPal Email</Label>
                    <Input 
                      value={payoutForm.paypalEmail}
                      onChange={(e) => setPayoutForm({ ...payoutForm, paypalEmail: e.target.value })}
                      placeholder="your-email@example.com"
                      type="email"
                    />
                  </div>
                )}

                {payoutForm.method === 'stripe' && (
                  <div>
                    <Label>Stripe Account ID</Label>
                    <Input 
                      value={payoutForm.stripeAccount}
                      onChange={(e) => setPayoutForm({ ...payoutForm, stripeAccount: e.target.value })}
                      placeholder="acct_1234567890"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsPayoutModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handlePayoutUpdate}
                    disabled={isUpdatingPayout}
                    className="flex-1"
                  >
                    {isUpdatingPayout ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Method'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      
      {/* Password and Security */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lock className="h-5 w-5" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="password" placeholder="Current Password" value={passwordForm.current} onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} />
          <Input type="password" placeholder="New Password (min 8 chars)" value={passwordForm.new} onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })} />
          <Input type="password" placeholder="Confirm New Password" value={passwordForm.confirm} onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })} />
          <Button onClick={handlePasswordChange} className="w-full bg-red-600 hover:bg-red-700">
            Update Password
          </Button>
        </CardContent>
      </Card>
      
      {/* Preferences */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Globe className="h-5 w-5" /> Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Preferred Language</Label>
          <Select 
            value={formData.preferredLanguage} 
            onValueChange={(value) => setFormData({ ...formData, preferredLanguage: value as 'English' | 'Spanish' | 'German' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="German">German</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="pt-4 flex justify-end">
        <Button onClick={handleSave} size="lg" className="gap-2">
          <Save className="h-5 w-5" /> Save Account Settings
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;
