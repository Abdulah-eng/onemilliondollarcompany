import { useNavigate } from 'react-router-dom';
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { MultiSelectButton } from '@/components/onboarding/MultiSelectButton';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const allergiesOptions = ['Dairy', 'Gluten', 'Nuts', 'Eggs', 'Soy', 'Fish', 'Shellfish'];
const meditationOptions = [
  { value: 'never', label: 'Never tried it', emoji: '🤔' },
  { value: 'beginner', label: 'Just started', emoji: '🌱' },
  { value: 'sometimes', label: 'Practice sometimes', emoji: '🧘' },
  { value: 'regular', label: 'Regular practice', emoji: '🧠' },
];

const PreferencesStep = () => {
  const { state, updatePreferences, saveStep, loading } = useOnboarding();
  const navigate = useNavigate();

  const handleAllergyToggle = (allergy: string) => {
    const newAllergies = state.preferences.allergies.includes(allergy)
      ? state.preferences.allergies.filter(a => a !== allergy)
      : [...state.preferences.allergies, allergy];
    updatePreferences({ ...state.preferences, allergies: newAllergies });
  };
  
  const handlePreferenceChange = (field, value) => {
    updatePreferences({ ...state.preferences, [field]: value });
  };

  const handleNext = async () => {
    await saveStep(3);
    navigate('/onboarding/step-4');
  };

  return (
    <OnboardingContainer
      title="Your preferences & history"
      subtitle="This information helps us fine-tune your plan."
      currentStep={3}
      totalSteps={4}
      onBack={() => navigate('/onboarding/step-2')}
      onNext={handleNext}
      nextDisabled={loading}
      isLoading={loading}
    >
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardContent className="p-6 sm:p-8 space-y-8">
            <div>
              <Label className="text-lg font-bold text-gray-800">Food Allergies or Intolerances</Label>
              <p className="text-sm text-gray-500 mb-4">Select any that apply.</p>
              <div className="flex flex-wrap gap-3">
                {allergiesOptions.map(allergy => (
                  <MultiSelectButton
                    key={allergy}
                    selected={state.preferences.allergies.includes(allergy)}
                    onClick={() => handleAllergyToggle(allergy)}
                  >
                    {allergy}
                  </MultiSelectButton>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-lg font-bold text-gray-800">Meditation Experience</Label>
              <p className="text-sm text-gray-500 mb-4">How familiar are you with mindfulness?</p>
              <RadioGroup 
                value={state.preferences.meditationExperience} 
                onValueChange={(value) => handlePreferenceChange('meditationExperience', value)}
                className="grid grid-cols-2 gap-4"
              >
                {meditationOptions.map(option => (
                  <Label key={option.value} className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-400">
                    <RadioGroupItem value={option.value} />
                    <span className="text-lg">{option.emoji}</span>
                    <span className="font-semibold">{option.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
            
            <div>
               <Label className="text-lg font-bold text-gray-800">Training Preferences</Label>
               <p className="text-sm text-gray-500 mb-4">Tell us what you like and dislike in a workout.</p>
               <div className="grid sm:grid-cols-2 gap-6">
                 <Textarea
                   placeholder="I enjoy things like..."
                   value={state.preferences.trainingLikes}
                   onChange={(e) => handlePreferenceChange('trainingLikes', e.target.value)}
                   className="min-h-[120px]"
                 />
                 <Textarea
                   placeholder="I'd like to avoid..."
                   value={state.preferences.trainingDislikes}
                   onChange={(e) => handlePreferenceChange('trainingDislikes', e.target.value)}
                   className="min-h-[120px]"
                 />
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </OnboardingContainer>
  );
};

export default PreferencesStep;
