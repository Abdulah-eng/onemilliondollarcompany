
// src/components/customer/dashboard/TodaysFocus.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, UtensilsCrossed, BrainCircuit, CheckCircle2 } from 'lucide-react';

/*
TODO: Backend Integration Notes for TodaysFocus
- Fetch today's assigned tasks for the user. This will likely involve querying tables like `assigned_workouts`, `assigned_nutrition`, and `assigned_mindfulness` where the `date` is today.
- The `completed` status for each task should come from a `daily_logs` or `check_ins` table, linked to the user and the specific task.
- The `requiresGym` and `shoppingListAvailable` flags should be properties of the workout/nutrition plan itself.
*/
const mockData = {
  workout: {
    title: 'Full Body Strength A',
    completed: true,
    requiresGym: true,
  },
  nutrition: {
    title: 'High-Protein Meal Plan',
    completed: false,
    shoppingListAvailable: true,
  },
  mental: {
    title: '5-Minute Mindful Breathing',
    completed: false,
  }
};

const TodaysFocus = () => {
  const { workout, nutrition, mental } = mockData;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-4">Today's Focus</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FocusCard
          icon={<Dumbbell className="w-6 h-6 text-emerald-500" />}
          title="Workout"
          task={workout.title}
          completed={workout.completed}
          tags={workout.requiresGym ? [{ text: 'Gym Required', color: 'gray' }] : []}
        />
        <FocusCard
          icon={<UtensilsCrossed className="w-6 h-6 text-emerald-500" />}
          title="Nutrition"
          task={nutrition.title}
          completed={nutrition.completed}
          tags={nutrition.shoppingListAvailable ? [{ text: 'Shopping List', color: 'blue' }] : []}
        />
        <FocusCard
          icon={<BrainCircuit className="w-6 h-6 text-emerald-500" />}
          title="Mental Wellness"
          task={mental.title}
          completed={mental.completed}
        />
      </div>
    </div>
  );
};

const FocusCard = ({ icon, title, task, completed, tags = [] }) => (
  <Card className="transform hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-lg font-bold">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold text-gray-800 truncate">{task}</p>
      <div className="flex items-center text-sm text-gray-500 mt-2">
        {completed ? <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" /> : <div className="w-4 h-4 mr-2 border-2 border-gray-300 rounded-full" />}
        <span>{completed ? 'Completed' : 'Pending'}</span>
        <div className="ml-auto flex gap-2">
          {tags.map(tag => (
            <span key={tag.text} className={`text-xs font-semibold bg-${tag.color}-100 text-${tag.color}-800 px-2 py-1 rounded-full`}>
              {tag.text}
            </span>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default TodaysFocus;
