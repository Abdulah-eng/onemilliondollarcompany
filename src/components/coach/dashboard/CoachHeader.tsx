// src/components/coach/dashboard/CoachHeader.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Users, BookOpenCheck } from 'lucide-react';

/*
TODO: Backend Integration Notes
- `coachName`: This is a static value ("Train Wise") as there is only one coach[cite: 167].
- `totalClients`: Fetch count of 'customer' roles from `profiles` table.
- `activePrograms`: Fetch count of 'Tailored' and 'Scheduled' programs from `program_assignments` table.
*/
const mockData = {
  coachName: 'Train Wise',
  totalClients: 48,
  activePrograms: 32,
};

const CoachHeader = () => {
  const { coachName, totalClients, activePrograms } = mockData;
  const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening';

  return (
    <Card className="relative border-none bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-lg animate-fade-in-down overflow-hidden">
      <CardContent className="p-6">
        <div className="pr-28">
          <h1 className="text-2xl font-bold">Good {timeOfDay}, {coachName} 👋</h1>
          <p className="opacity-80 mt-1 text-sm italic">"Ready to make an impact today?"</p>
        </div>
        
        {/* Stats Badge in top right corner */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 text-right">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Users size={16} className="text-white" />
            <span className="font-bold text-sm">{totalClients}</span>
            <span className="text-xs opacity-80">Clients</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
            <BookOpenCheck size={16} className="text-white" />
            <span className="font-bold text-sm">{activePrograms}</span>
            <span className="text-xs opacity-80">Active Programs</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachHeader;
