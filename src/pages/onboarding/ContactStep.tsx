// src/pages/onboarding/ContactStep.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer';
import { AvatarUploadCompressed } from '@/components/onboarding/AvatarUploadCompressed';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

const ContactStep = () => {
  const { state, updateState, loading } = useOnboarding();
  const navigate = useNavigate();
  const { contactInfo } = state;
  const [showPass, setShowPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState('');

  const handleInputChange = (field, value) => {
    updateState('contactInfo', { ...contactInfo, [field]: value });
  };

  const isFormValid = contactInfo.password.length >= 6 && contactInfo.password === confirmPass;

  return (
    <OnboardingContainer
      title="Secure Your Account"
      subtitle="Add a photo and set a strong password to protect your account."
      currentStep={4}
      totalSteps={5}
      onBack={() => navigate('/onboarding/step-3')}
      onNext={() => navigate('/onboarding/success')}
      nextDisabled={!isFormValid || loading}
      isLoading={loading}
      nextLabel="Finish Setup"
    >
      <div className="max-w-md mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardContent className="p-6 sm:p-8 space-y-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <Label className="text-lg font-bold text-gray-800">Profile Photo (Optional)</Label>
              <AvatarUploadCompressed preview={contactInfo.avatarPreview} onChange={(file) => handleInputChange('avatarFile', file)} />
            </div>
            
            <FormField label="Phone (Optional)" htmlFor="phone">
              <Input id="phone" type="tel" placeholder="+1 555 123 4567" value={contactInfo.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
            </FormField>

            <FormField label="New Password" htmlFor="password">
              <div className="relative">
                <Input id="password" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={contactInfo.password} onChange={(e) => handleInputChange('password', e.target.value)} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showPass ? <EyeOff/> : <Eye/>}</button>
              </div>
            </FormField>

            <FormField label="Confirm Password" htmlFor="confirm-password">
              <Input id="confirm-password" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
            </FormField>
            {contactInfo.password && confirmPass && contactInfo.password !== confirmPass && <p className="text-red-500 text-sm">Passwords do not match.</p>}
          </CardContent>
        </Card>
      </div>
    </OnboardingContainer>
  );
};

const FormField = ({ label, htmlFor, children }) => (
  <div className="space-y-2">
    <Label htmlFor={htmlFor} className="font-semibold text-gray-700">{label}</Label>
    {children}
  </div>
);

export default ContactStep;
