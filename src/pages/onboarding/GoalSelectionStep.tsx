// src/pages/onboarding/GoalSelectionStep.tsx
import { useNavigate } from 'react-router-dom';
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer';
import { GoalCard } from '@/components/onboarding/GoalCard';
import { useOnboarding } from '@/contexts/OnboardingContext';

const goals = [
  { id: 'get-fit', emoji: '💪', title: 'Get Fit', category: 'fitness' },
  { id: 'build-muscle', emoji: '🏋️', title: 'Build Muscle', category: 'fitness' },
  { id: 'get-stronger', emoji: '💥', title: 'Get Stronger', category: 'fitness' },
  { id: 'burn-fat', emoji: '🔥', title: 'Burn Fat', category: 'fitness' },
  { id: 'get-toned', emoji: '✨', title: 'Get Toned', category: 'fitness' },
  { id: 'eat-healthier', emoji: '🥗', title: 'Eat Healthier', category: 'nutrition' },
  { id: 'weight-loss', emoji: '⚖️', title: 'Weight Loss', category: 'nutrition' },
  { id: 'improve-habits', emoji: '🎯', title: 'Improve Habits', category: 'nutrition' },
  { id: 'more-energy', emoji: '⚡', title: 'More Energy', category: 'nutrition' },
  { id: 'reduce-cravings', emoji: '🍃', title: 'Reduce Cravings', category: 'nutrition' },
  { id: 'reduce-stress', emoji: '🧘', title: 'Reduce Stress', category: 'mental' },
  { id: 'improve-sleep', emoji: '😴', title: 'Improve Sleep', category: 'mental' },
  { id: 'build-mindfulness', emoji: '🌸', title: 'Build Mindfulness', category: 'mental' },
  { id: 'emotional-balance', emoji: '🌈', title: 'Emotional Balance', category: 'mental' },
  { id: 'boost-focus', emoji: '🎯', title: 'Boost Focus', category: 'mental' }
];

const GoalSelectionStep = () => {
  const { state, updateState, loading } = useOnboarding();
  const navigate = useNavigate();

  const handleGoalToggle = (goalId) => {
    const currentGoals = state.goals;
    const newGoals = currentGoals.includes(goalId)
      ? currentGoals.filter(id => id !== goalId)
      : [...currentGoals, goalId];
    updateState('goals', newGoals);
  };

  return (
    <OnboardingContainer
      title="What brings you to TrainWise?"
      subtitle="Select your top goals. This helps us personalize your journey from day one."
      currentStep={1}
      totalSteps={5}
      showBack={false}
      onNext={() => navigate('/onboarding/step-2')}
      nextDisabled={state.goals.length === 0 || loading}
      isLoading={loading}
    >
      <div className="space-y-8 max-w-3xl mx-auto">
        <GoalSection title="Fitness" emoji="🏋️" goals={goals.filter(g => g.category === 'fitness')} onToggle={handleGoalToggle} selectedGoals={state.goals} />
        <GoalSection title="Nutrition" emoji="🥗" goals={goals.filter(g => g.category === 'nutrition')} onToggle={handleGoalToggle} selectedGoals={state.goals} />
        <GoalSection title="Mental Wellness" emoji="🧠" goals={goals.filter(g => g.category === 'mental')} onToggle={handleGoalToggle} selectedGoals={state.goals} />
      </div>
    </OnboardingContainer>
  );
};

const GoalSection = ({ title, emoji, goals, onToggle, selectedGoals }) => (
  <div>
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><span className="text-2xl mr-3">{emoji}</span>{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {goals.map(goal => (
        <GoalCard key={goal.id} emoji={goal.emoji} title={goal.title} selected={selectedGoals.includes(goal.id)} onClick={() => onToggle(goal.id)} />
      ))}
    </div>
  </div>
);

export default GoalSelectionStep;
