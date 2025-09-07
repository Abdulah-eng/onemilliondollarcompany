// src/components/customer/mycoach/CoachHeaderCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { coachInfo } from '@/mockdata/mycoach/coachData';
import { CircleUserRound } from 'lucide-react';

const CoachHeaderCard = () => {
  return (
    <Card className="relative w-full overflow-hidden border-0 shadow-lg rounded-3xl animate-fade-in-down">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 opacity-80 rounded-3xl" />
      <CardContent className="relative p-6 text-white flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-2 border-white overflow-hidden">
            {coachInfo.profileImageUrl ? (
              <img src={coachInfo.profileImageUrl} alt={coachInfo.name} className="object-cover w-full h-full" />
            ) : (
              <CircleUserRound className="w-12 h-12 text-white" />
            )}
          </div>
          <div>
            <p className="text-sm text-white/80 font-medium">Your Coach</p>
            <h2 className="text-2xl font-bold">{coachInfo.name}</h2>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachHeaderCard;
