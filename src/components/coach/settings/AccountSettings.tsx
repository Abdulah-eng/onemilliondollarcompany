'use client';

import React, { useState } from 'react';
import { CoachAccount } from '@/mockdata/settings/mockSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Lock, Globe, DollarSign, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AccountSettingsProps {
  account: CoachAccount;
  onUpdate: (updatedAccount: CoachAccount) => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ account, onUpdate }) => {
  const [formData, setFormData] = useState(account);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  const handlePasswordChange = (e: React.MouseEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert("New password and confirmation do not match.");
      return;
    }
    if (passwordForm.new.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
    // Simulate API call for password change
    alert("Password successfully updated!");
    setPasswordForm({ current: '', new: '', confirm: '' });
  };
  
  const handleSave = () => {
    onUpdate(formData);
    alert('Account Information Updated!');
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
            <Input readOnly value={formData.payoutMethod} />
            <p className="text-sm text-muted-foreground">Current Details: {formData.payoutDetails}</p>
          </div>
          <Button variant="outline" className="w-full">
            Update Payout Method
          </Button>
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
