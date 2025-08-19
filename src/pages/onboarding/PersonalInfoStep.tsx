// src/pages/onboarding/PersonalInfoStep.tsx

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// --- Validation and Conversion Helpers ---
const validateField = (name, value, allValues = {}) => {
  switch (name) {
    case 'name':
    case 'country':
      return /^[a-zA-Z\s-]*$/.test(value) ? '' : 'Only letters and spaces are allowed.';
    case 'weight_kg':
      return value >= 30 && value <= 300 ? '' : 'Enter a valid weight (30-300 kg).';
    case 'weight_lbs':
      return value >= 66 && value <= 661 ? '' : 'Enter a valid weight (66-661 lbs).';
    case 'height_cm':
      return value >= 100 && value <= 250 ? '' : 'Enter a valid height (100-250 cm).';
    case 'height_ft':
        return value >= 3 && value <= 8 ? '' : 'Invalid feet value.';
    case 'height_in':
        return value >= 0 && value < 12 ? '' : 'Invalid inches value.';
    case 'dob':
        const { year, month, day } = allValues;
        if (!year || !month || !day) return 'Please select a full date.';
        const date = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (date >= today) return 'Date must be in the past.';
        // Check if it's a valid date (e.g., handles Feb 30)
        if (date.getFullYear() !== parseInt(year) || date.getMonth() !== parseInt(month) - 1 || date.getDate() !== parseInt(day)) {
            return 'Please select a valid date.';
        }
        return '';
    default:
      return '';
  }
};

const PersonalInfoStep = () => {
  const { state, updateState, loading } = useOnboarding();
  const navigate = useNavigate();
  const { personalInfo } = state;

  const [units, setUnits] = useState('metric');
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    const newPersonalInfo = { ...personalInfo, [field]: value };
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
    updateState('personalInfo', newPersonalInfo);
  };
  
  const handleUnitBasedChange = (field, value) => {
    const key_metric = field === 'weight' ? 'weight_kg' : 'height_cm';
    const key_imperial = field === 'weight' ? 'weight_lbs' : ''; // Height is handled separately

    let valueToValidate = value;
    let fieldToValidate = units === 'metric' ? key_metric : key_imperial;
    
    // Handle imperial height which has two fields
    if (units === 'imperial' && (field === 'height_ft' || field === 'height_in')) {
        const newFt = field === 'height_ft' ? value : (personalInfo.height_ft || 0);
        const newIn = field === 'height_in' ? value : (personalInfo.height_in || 0);
        const totalCm = Math.round((newFt * 30.48) + (newIn * 2.54));
        
        const ftError = validateField('height_ft', newFt);
        const inError = validateField('height_in', newIn);

        setErrors(prev => ({ ...prev, height_ft: ftError, height_in: inError }));
        updateState('personalInfo', { ...personalInfo, height: totalCm, height_ft: newFt, height_in: newIn });
        return;
    }
    
    // Handle weight and metric height
    const error = validateField(fieldToValidate, valueToValidate);
    setErrors(prev => ({ ...prev, [fieldToValidate]: error }));

    const finalValue = units === 'imperial' && field === 'weight' ? Math.round(value * 0.453592) : value;
    updateState('personalInfo', { ...personalInfo, [field]: finalValue });
  };

  const handleDateChange = (part, value) => {
    const newDobParts = {
        year: personalInfo.year || '',
        month: personalInfo.month || '',
        day: personalInfo.day || '',
        ...{ [part]: value }
    };
    const { year, month, day } = newDobParts;
    const dobError = validateField('dob', null, newDobParts);
    setErrors(prev => ({ ...prev, dob: dobError }));

    const dobString = (year && month && day) ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : '';
    updateState('personalInfo', { ...personalInfo, ...newDobParts, dob: dobString });
  };

  const isFormValid = useMemo(() => {
    const hasNoErrors = Object.values(errors).every(e => e === '');
    const fieldsFilled = personalInfo.name && personalInfo.weight > 0 && personalInfo.height > 0 &&
                         personalInfo.gender && personalInfo.dob && personalInfo.country;
    return hasNoErrors && fieldsFilled;
  }, [personalInfo, errors]);

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
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="font-semibold text-gray-700">Measurements</Label>
                <ToggleGroup type="single" value={units} onValueChange={setUnits} size="sm" className="border rounded-full p-0.5 bg-gray-100">
                  <ToggleGroupItem value="metric" className="rounded-full data-[state=on]:bg-emerald-500 data-[state=on]:text-white">Metric</ToggleGroupItem>
                  <ToggleGroupItem value="imperial" className="rounded-full data-[state=on]:bg-emerald-500 data-[state=on]:text-white">Imperial</ToggleGroupItem>
                </ToggleGroup>
              </div>
              {units === 'metric' ? (
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Height (cm)" htmlFor="height_cm" error={errors.height_cm}>
                    <Input id="height_cm" type="number" placeholder="175" value={personalInfo.height || ''} onChange={(e) => handleUnitBasedChange('height', e.target.value)} />
                  </FormField>
                  <FormField label="Weight (kg)" htmlFor="weight_kg" error={errors.weight_kg}>
                    <Input id="weight_kg" type="number" placeholder="70" value={personalInfo.weight || ''} onChange={(e) => handleUnitBasedChange('weight', e.target.value)} />
                  </FormField>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                   <FormField label="Height (ft & in)" htmlFor="height_ft" error={errors.height_ft || errors.height_in}>
                      <div className="flex gap-2">
                          <Input id="height_ft" type="number" placeholder="ft" value={personalInfo.height_ft || ''} onChange={(e) => handleUnitBasedChange('height_ft', e.target.value)} />
                          <Input id="height_in" type="number" placeholder="in" value={personalInfo.height_in || ''} onChange={(e) => handleUnitBasedChange('height_in', e.target.value)} />
                      </div>
                   </FormField>
                  <FormField label="Weight (lbs)" htmlFor="weight_lbs" error={errors.weight_lbs}>
                    <Input id="weight_lbs" type="number" placeholder="154" value={personalInfo.weight ? Math.round(personalInfo.weight / 0.453592) : ''} onChange={(e) => handleUnitBasedChange('weight', e.target.value)} />
                  </FormField>
                </div>
              )}
            </div>
            
            <FormField label="Date of Birth" htmlFor="dob" error={errors.dob}>
              <DateSelector
                value={{ day: personalInfo.day, month: personalInfo.month, year: personalInfo.year }}
                onChange={handleDateChange}
              />
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

// --- Reusable Components for this page ---

const FormField = ({ label, htmlFor, children, error }) => (
  <div className="space-y-1">
    <Label htmlFor={htmlFor} className="font-semibold text-gray-700">{label}</Label>
    {children}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const DateSelector = ({ value, onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-3 gap-2">
      <Select value={value.day} onValueChange={(val) => onChange('day', val)}>
        <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
        <SelectContent>{days.map(d => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={value.month} onValueChange={(val) => onChange('month', val)}>
        <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
        <SelectContent>{months.map(m => <SelectItem key={m} value={String(m)}>{m}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={value.year} onValueChange={(val) => onChange('year', val)}>
        <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
        <SelectContent>{years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
};

export default PersonalInfoStep;
