// src/components/customer/dashboard/WelcomeHeader.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';

/*
TODO: Backend Integration Notes
- `userName`: Fetch from `profiles.full_name`.
- `quote`: Fetch a random quote from a `motivational_quotes` table.
- `streak`: Calculate from `activity_logs`.
*/
const mockData = {
  userName: 'Alex',
  quote: "The secret of getting ahead is getting started.",
  streak: 7,
};

const WelcomeHeader = () => {
  const { userName, quote, streak } = mockData;
  const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening';

  return (
    <Card className="relative border-none bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg animate-fade-in-down overflow-hidden">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold">Good {timeOfDay}, {userName} 👋</h1>
        <p className="opacity-80 mt-1 text-sm italic">"{quote}"</p>
        
        {/* Streak Badge in top right corner */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
          <Flame size={16} className="text-white" />
          <span className="font-bold text-sm">{streak}</span>
          <span className="text-xs opacity-80">Day Streak</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeHeader;
