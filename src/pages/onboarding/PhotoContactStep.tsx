import { useNavigate } from 'react-router-dom';
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer';
import { AvatarUploadCompressed } from '@/components/onboarding/AvatarUploadCompressed';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const PhotoContactStep = () => {
  const { state, updateContactInfo, saveStep, loading, initializing } = useOnboarding();
  const navigate = useNavigate();

  if (initializing) {
    return (
      <OnboardingContainer title="Loading..." currentStep={4} totalSteps={4} nextDisabled>
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </OnboardingContainer>
    );
  }

  const handlePhotoChange = (file: File | null) => {
    updateContactInfo({
      ...state.contactInfo,
      avatarFile: file,
      avatarPreview: file ? URL.createObjectURL(file) : null
    });
  };

  const handleNext = async () => {
    await saveStep(4);
    navigate('/onboarding/success');
  };

  return (
    <OnboardingContainer
      title="Complete your profile"
      subtitle="A profile photo helps your coach connect with you."
      currentStep={4}
      totalSteps={4}
      onBack={() => navigate('/onboarding/step-3')}
      onNext={handleNext}
      nextDisabled={loading}
      isLoading={loading}
      nextLabel="Complete Setup"
    >
      <div className="max-w-md mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardContent className="p-6 sm:p-8 space-y-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <Label className="text-lg font-bold text-gray-800">Profile Photo</Label>
              <p className="text-sm text-gray-500 mb-4">Optional, but highly recommended.</p>
              <AvatarUploadCompressed
                preview={state.contactInfo.avatarPreview}
                onChange={handlePhotoChange}
              />
            </div>

            <div>
              <Label htmlFor="email" className="font-semibold text-gray-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={state.user?.email || 'Loading...'}
                disabled
                className="mt-2 bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-2">
                This is your login email and cannot be changed here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </OnboardingContainer>
  );
};

export default PhotoContactStep;
