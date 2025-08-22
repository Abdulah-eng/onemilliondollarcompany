// src/components/customer/dashboard/TodaysFocus.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, UtensilsCrossed, BrainCircuit, CheckCircle2 } from 'lucide-react';

const mockData = {
  workout: { title: 'Full Body Strength A', completed: true, requiresGym: true },
  nutrition: { title: 'High-Protein Meal Plan', completed: false, shoppingListAvailable: true },
  mental: { title: '5-Minute Mindful Breathing', completed: false }
};

const TodaysFocus = () => {
  const { workout, nutrition, mental } = mockData;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-4">Today's Focus</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FocusCard icon={<Dumbbell />} title="Workout" task={workout.title} completed={workout.completed} tags={workout.requiresGym ? [{ text: 'Gym' }] : []} />
        <FocusCard icon={<UtensilsCrossed />} title="Nutrition" task={nutrition.title} completed={nutrition.completed} tags={nutrition.shoppingListAvailable ? [{ text: 'Shopping List' }] : []} />
        <FocusCard icon={<BrainCircuit />} title="Mental Wellness" task={mental.title} completed={mental.completed} />
      </div>
    </div>
  );
};

const FocusCard = ({ icon, title, task, completed, tags = [] }) => (
  <Card className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-base font-semibold text-gray-700">{title}</CardTitle>
      <div className="text-orange-500">{icon}</div>
    </CardHeader>
    <CardContent>
      {/* --- SIZE ADJUSTMENT --- */}
      <p className="text-lg font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors">{task}</p>
      <div className="flex items-center text-sm text-gray-500 mt-2">
        {completed ? <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" /> : <div className="w-4 h-4 mr-2 border-2 border-gray-300 rounded-full" />}
        <span>{completed ? 'Completed' : 'Pending'}</span>
        <div className="ml-auto">{tags.map(tag => <span key={tag.text} className="text-xs font-semibold bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{tag.text}</span>)}</div>
      </div>
    </CardContent>
  </Card>
);

export default TodaysFocus;
