// src/pages/onboarding/PreferencesStep.tsx
import { useNavigate } from 'react-router-dom';
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { MultiSelectButton } from '@/components/onboarding/MultiSelectButton';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const allergies = ['Dairy', 'Gluten', 'Nuts', 'Eggs', 'Soy', 'Fish', 'Shellfish', 'Lactose'];
const trainingOptions = ['Strength', 'Cardio', 'Endurance', 'Weights', 'Calisthenics', 'HIIT', 'Outdoor', 'Running'];
const injuries = ['Lower back', 'Neck', 'Knee', 'Shoulder', 'Wrist/Elbow'];
const meditationOptions = [
  { value: 'never', label: 'Never tried it', emoji: '🤔' },
  { value: 'beginner', label: 'Just started', emoji: '🌱' },
  { value: 'sometimes', label: 'Practice sometimes', emoji: '🧘' },
  { value: 'regular', label: 'Regular practice', emoji: '🧠' },
  { value: 'experienced', label: 'Very experienced', emoji: '🕉️' },
];

const PreferencesStep = () => {
  const { state, updateState, loading } = useOnboarding();
  const navigate = useNavigate();
  const { preferences } = state;

  const handleMultiSelect = (field, value) => {
    const currentValues = preferences[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    updateState('preferences', { ...preferences, [field]: newValues });
  };

  return (
    <OnboardingContainer
      title="Customize Your Experience"
      subtitle="Your preferences help us build a plan you'll love."
      currentStep={3}
      totalSteps={5}
      onBack={() => navigate('/onboarding/step-2')}
      onNext={() => navigate('/onboarding/step-4')}
      isLoading={loading}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        <PreferenceSection title="Food Allergies"><MultiSelectGrid items={allergies} selected={preferences.allergies} onSelect={(item) => handleMultiSelect('allergies', item)} /></PreferenceSection>
        <PreferenceSection title="What do you like to train?"><MultiSelectGrid items={trainingOptions} selected={preferences.trainingLikes} onSelect={(item) => handleMultiSelect('trainingLikes', item)} /></PreferenceSection>
        <PreferenceSection title="What do you dislike?"><MultiSelectGrid items={trainingOptions} selected={preferences.trainingDislikes} onSelect={(item) => handleMultiSelect('trainingDislikes', item)} /></PreferenceSection>
        <PreferenceSection title="Past Injuries"><MultiSelectGrid items={injuries} selected={preferences.injuries} onSelect={(item) => handleMultiSelect('injuries', item)} /></PreferenceSection>
        <PreferenceSection title="Meditation Experience">
          <RadioGroup value={preferences.meditationExperience} onValueChange={(val) => updateState('preferences', {...preferences, meditationExperience: val})} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {meditationOptions.map(opt => (
              <Label key={opt.value} className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-400">
                <RadioGroupItem value={opt.value} />
                <span className="text-lg">{opt.emoji}</span><span className="font-semibold">{opt.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </PreferenceSection>
      </div>
    </OnboardingContainer>
  );
};

const PreferenceSection = ({ title, children }) => (
  <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg"><CardContent className="p-6">
    <Label className="text-lg font-bold text-gray-800">{title}</Label>
    <div className="mt-4">{children}</div>
  </CardContent></Card>
);

const MultiSelectGrid = ({ items, selected, onSelect }) => (
  <div className="flex flex-wrap gap-3">
    {items.map(item => <MultiSelectButton key={item} selected={selected.includes(item)} onClick={() => onSelect(item)}>{item}</MultiSelectButton>)}
  </div>
);

export default PreferencesStep;
