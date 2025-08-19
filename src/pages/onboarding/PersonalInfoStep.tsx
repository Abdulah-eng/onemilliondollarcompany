// src/pages/onboarding/PersonalInfoStep.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// --- Validation and Conversion Helpers ---
const validateField = (name, value) => {
  switch (name) {
    case 'name':
    case 'country':
      return /^[a-zA-Z\s-]*$/.test(value) ? '' : 'Only letters and spaces are allowed.';
    case 'weight_kg':
      return value >= 30 && value <= 300 ? '' : 'Please enter a valid weight (30-300 kg).';
    case 'weight_lbs':
      return value >= 66 && value <= 661 ? '' : 'Please enter a valid weight (66-661 lbs).';
    case 'height_cm':
      return value >= 100 && value <= 250 ? '' : 'Please enter a valid height (100-250 cm).';
    case 'dob':
        const date = new Date(value);
        const today = new Date();
        today.setHours(0,0,0,0);
        return date < today ? '' : 'Date of birth cannot be in the future.';
    default:
      return '';
  }
};

const PersonalInfoStep = () => {
  const { state, updateState, loading } = useOnboarding();
  const navigate = useNavigate();
  const { personalInfo } = state;

  const [units, setUnits] = useState('metric'); // 'metric' or 'imperial'
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));

    // Convert and update state
    let finalValue = value;
    if (units === 'imperial') {
        if (field === 'weight_lbs') finalValue = Math.round(value * 0.453592); // lbs to kg
        if (field === 'height_ft' || field === 'height_in') {
            const feet = field === 'height_ft' ? value : personalInfo.height_ft || 0;
            const inches = field === 'height_in' ? value : personalInfo.height_in || 0;
            finalValue = Math.round((feet * 30.48) + (inches * 2.54)); // ft/in to cm
            updateState('personalInfo', { ...personalInfo, height: finalValue, [field]: value });
            return;
        }
    }
    
    // For metric or non-unit fields
    const fieldName = field.replace('_kg', '').replace('_cm', '');
    updateState('personalInfo', { ...personalInfo, [fieldName]: finalValue });
  };
  
  const isFormValid = Object.values(errors).every(e => e === '') &&
                      personalInfo.name && personalInfo.weight > 0 && personalInfo.height > 0 &&
                      personalInfo.gender && personalInfo.dob && personalInfo.country;

  return (
    <OnboardingContainer
      title="About You"
      subtitle="This baseline information helps us tailor your experience."
      currentStep={2} totalSteps={5}
      onBack={() => navigate('/onboarding/step-1')}
      onNext={() => navigate('/onboarding/step-3')}
      nextDisabled={!isFormValid || loading} isLoading={loading}
    >
      <div className="max-w-md mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <FormField label="Full Name" htmlFor="name" error={errors.name}>
              <Input id="name" type="text" placeholder="e.g., Alex Doe" value={personalInfo.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} />
            </FormField>

            <div className="flex justify-end">
              <ToggleGroup type="single" value={units} onValueChange={setUnits} size="sm">
                <ToggleGroupItem value="metric">Metric (kg, cm)</ToggleGroupItem>
                <ToggleGroupItem value="imperial">Imperial (lbs, ft)</ToggleGroupItem>
              </ToggleGroup>
            </div>

            {units === 'metric' ? (
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Height (cm)" htmlFor="height_cm" error={errors.height_cm}>
                  <Input id="height_cm" type="number" placeholder="175" value={personalInfo.height || ''} onChange={(e) => handleInputChange('height_cm', e.target.value)} />
                </FormField>
                <FormField label="Weight (kg)" htmlFor="weight_kg" error={errors.weight_kg}>
                  <Input id="weight_kg" type="number" placeholder="70" value={personalInfo.weight || ''} onChange={(e) => handleInputChange('weight_kg', e.target.value)} />
                </FormField>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                 <FormField label="Height (ft & in)" htmlFor="height_ft">
                    <div className="flex gap-2">
                        <Input id="height_ft" type="number" placeholder="5" value={personalInfo.height_ft || ''} onChange={(e) => handleInputChange('height_ft', e.target.value)} />
                        <Input id="height_in" type="number" placeholder="9" value={personalInfo.height_in || ''} onChange={(e) => handleInputChange('height_in', e.target.value)} />
                    </div>
                 </FormField>
                <FormField label="Weight (lbs)" htmlFor="weight_lbs" error={errors.weight_lbs}>
                  <Input id="weight_lbs" type="number" placeholder="154" value={Math.round(personalInfo.weight / 0.453592) || ''} onChange={(e) => handleInputChange('weight_lbs', e.target.value)} />
                </FormField>
              </div>
            )}
            
            <FormField label="Date of Birth" htmlFor="dob" error={errors.dob}>
              <Input id="dob" type="date" value={personalInfo.dob} onChange={(e) => handleInputChange('dob', e.target.value)} className="block appearance-none w-full"/>
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
              <FormField label="Country" htmlFor="country" error={errors.country}>
                <Input id="country" type="text" placeholder="e.g. Norway" value={personalInfo.country || ''} onChange={(e) => handleInputChange('country', e.target.value)} />
              </FormField>
            </div>
          </CardContent>
        </Card>
      </div>
    </OnboardingContainer>
  );
};

const FormField = ({ label, htmlFor, children, error }) => (
  <div className="space-y-2">
    <Label htmlFor={htmlFor} className="font-semibold text-gray-700">{label}</Label>
    {children}
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export default PersonalInfoStep;
