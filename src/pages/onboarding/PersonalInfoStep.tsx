// src/pages/onboarding/PersonalInfoStep.tsx
import { useNavigate } from 'react-router-dom';
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PersonalInfoStep = () => {
  const { state, updateState, loading } = useOnboarding();
  const navigate = useNavigate();
  const { personalInfo } = state;

  const handleInputChange = (field, value) => {
    updateState('personalInfo', { ...personalInfo, [field]: value });
  };

  const isFormValid = personalInfo.weight > 0 && personalInfo.height > 0 && personalInfo.gender && personalInfo.dob && personalInfo.country;

  return (
    <OnboardingContainer
      title="About You"
      subtitle="This baseline information helps us tailor your experience."
      currentStep={2}
      totalSteps={5}
      onBack={() => navigate('/onboarding/step-1')}
      onNext={() => navigate('/onboarding/step-3')}
      nextDisabled={!isFormValid || loading}
      isLoading={loading}
    >
      <div className="max-w-md mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Height (cm)" htmlFor="height">
                <Input id="height" type="number" placeholder="175" value={personalInfo.height || ''} onChange={(e) => handleInputChange('height', e.target.value)} />
              </FormField>
              <FormField label="Weight (kg)" htmlFor="weight">
                <Input id="weight" type="number" placeholder="70" value={personalInfo.weight || ''} onChange={(e) => handleInputChange('weight', e.target.value)} />
              </FormField>
            </div>
            <FormField label="Date of Birth" htmlFor="dob">
              <Input id="dob" type="date" value={personalInfo.dob} onChange={(e) => handleInputChange('dob', e.target.value)} />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Gender" htmlFor="gender">
                 <Select value={personalInfo.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                   <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="male">Male</SelectItem>
                     <SelectItem value="female">Female</SelectItem>
                     <SelectItem value="non-binary">Non-binary</SelectItem>
                     <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                   </SelectContent>
                 </Select>
              </FormField>
              <FormField label="Country" htmlFor="country">
                <Input id="country" type="text" placeholder="e.g. Norway" value={personalInfo.country} onChange={(e) => handleInputChange('country', e.target.value)} />
              </FormField>
            </div>
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

export default PersonalInfoStep;
