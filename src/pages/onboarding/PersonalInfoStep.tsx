import { useNavigate } from 'react-router-dom';
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PersonalInfoStep = () => {
  const { state, updatePersonalInfo, saveStep, loading } = useOnboarding();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    const isNumericField = ['height', 'weight', 'age'].includes(field);
    const processedValue = isNumericField ? Number(value) || 0 : value;
    
    updatePersonalInfo({ ...state.personalInfo, [field]: processedValue });
  };

  const handleNext = async () => {
    await saveStep(2);
    navigate('/onboarding/step-3');
  };

  const isFormValid = state.personalInfo.name && state.personalInfo.height > 0 && 
                      state.personalInfo.weight > 0 && state.personalInfo.age > 0 && 
                      state.personalInfo.gender;

  return (
    <OnboardingContainer
      title="Tell us about yourself"
      subtitle="This helps us create a plan that's tailored to your body."
      currentStep={2}
      totalSteps={4}
      onBack={() => navigate('/onboarding/step-1')}
      onNext={handleNext}
      nextDisabled={!isFormValid || loading}
      isLoading={loading}
    >
      <div className="max-w-md mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <FormField label="Full Name" htmlFor="name">
              <Input
                id="name"
                type="text"
                placeholder="e.g., Alex Doe"
                value={state.personalInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </FormField>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Height (cm)" htmlFor="height">
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={state.personalInfo.height || ''}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                />
              </FormField>
              <FormField label="Weight (kg)" htmlFor="weight">
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={state.personalInfo.weight || ''}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Age" htmlFor="age">
                <Input
                  id="age"
                  type="number"
                  placeholder="30"
                  value={state.personalInfo.age || ''}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </FormField>
              <FormField label="Gender" htmlFor="gender">
                 <Select 
                   value={state.personalInfo.gender} 
                   onValueChange={(value) => handleInputChange('gender', value)}
                 >
                   <SelectTrigger>
                     <SelectValue placeholder="Select..." />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="male">Male</SelectItem>
                     <SelectItem value="female">Female</SelectItem>
                     <SelectItem value="non-binary">Non-binary</SelectItem>
                     <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                   </SelectContent>
                 </Select>
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
    <Label htmlFor={htmlFor} className="font-semibold text-gray-700">
      {label}
    </Label>
    {children}
  </div>
);

export default PersonalInfoStep;
