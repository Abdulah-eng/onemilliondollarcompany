import { useNavigate } from 'react-router-dom';
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer';
import { GoalCard } from '@/components/onboarding/GoalCard';
import { useOnboarding } from '@/contexts/OnboardingContext';

const goals = [
  { id: 'get-fit', emoji: '💪', title: 'Get Fit', subtitle: 'Improve overall fitness', category: 'fitness' },
  { id: 'build-muscle', emoji: '🏋️', title: 'Build Muscle', subtitle: 'Gain lean muscle mass', category: 'fitness' },
  { id: 'get-stronger', emoji: '💥', title: 'Get Stronger', subtitle: 'Increase strength levels', category: 'fitness' },
  { id: 'burn-fat', emoji: '🔥', title: 'Burn Fat', subtitle: 'Lose body fat effectively', category: 'fitness' },
  { id: 'eat-healthier', emoji: '🥗', title: 'Eat Healthier', subtitle: 'Improve food choices', category: 'nutrition' },
  { id: 'weight-loss', emoji: '⚖️', title: 'Weight Loss', subtitle: 'Achieve healthy weight', category: 'nutrition' },
  { id: 'more-energy', emoji: '⚡', title: 'More Energy', subtitle: 'Feel energized daily', category: 'nutrition' },
  { id: 'reduce-stress', emoji: '🧘', title: 'Reduce Stress', subtitle: 'Find inner calm', category: 'mental' },
  { id: 'improve-sleep', emoji: '😴', title: 'Improve Sleep', subtitle: 'Better rest quality', category: 'mental' },
  { id: 'build-mindfulness', emoji: '🌸', title: 'Build Mindfulness', subtitle: 'Stay present & aware', category: 'mental' },
];

const GoalSelectionStep = () => {
  const { state, updateGoals, saveStep, loading } = useOnboarding();
  const navigate = useNavigate();

  const handleGoalToggle = (goalId: string) => {
    const newGoals = state.goals.includes(goalId) 
      ? state.goals.filter(id => id !== goalId)
      : [...state.goals, goalId];
    updateGoals(newGoals);
  };

  const handleNext = async () => {
    await saveStep(1);
    navigate('/onboarding/step-2');
  };

  const filterGoals = (category: string) => goals.filter(goal => goal.category === category);

  return (
    <OnboardingContainer
      title="What's your main focus?"
      subtitle="Select one or more goals. We'll build your plan around them."
      currentStep={1}
      totalSteps={4}
      showBack={false}
      onNext={handleNext}
      nextDisabled={state.goals.length === 0 || loading}
      isLoading={loading}
    >
      <div className="space-y-8 max-w-2xl mx-auto">
        <GoalSection title="Fitness" emoji="🏋️" goals={filterGoals('fitness')} onToggle={handleGoalToggle} selectedGoals={state.goals} />
        <GoalSection title="Nutrition" emoji="🥗" goals={filterGoals('nutrition')} onToggle={handleGoalToggle} selectedGoals={state.goals} />
        <GoalSection title="Mental Wellness" emoji="🧠" goals={filterGoals('mental')} onToggle={handleGoalToggle} selectedGoals={state.goals} />
      </div>
    </OnboardingContainer>
  );
};

const GoalSection = ({ title, emoji, goals, onToggle, selectedGoals }) => (
  <div>
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
      <span className="text-2xl mr-3">{emoji}</span> {title}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {goals.map(goal => (
        <GoalCard
          key={goal.id}
          emoji={goal.emoji}
          title={goal.title}
          subtitle={goal.subtitle}
          selected={selectedGoals.includes(goal.id)}
          onClick={() => onToggle(goal.id)}
        />
      ))}
    </div>
  </div>
);

export default GoalSelectionStep;
