// src/components/customer/mycoach/TodaysMessage.tsx
import { Card, CardContent } from '@/components/ui/card';
import { dailyMessage } from '@/mockdata/mycoach/coachData';
import { Sparkles } from 'lucide-react';

const TodaysMessage = () => {
  return (
    <Card className="relative w-full overflow-hidden border-0 shadow-lg rounded-2xl animate-fade-in">
      <CardContent className="relative p-6 space-y-2">
        <div className="flex items-center space-x-2 text-purple-600">
          <Sparkles className="w-5 h-5" />
          <h4 className="text-sm font-semibold">{dailyMessage.title}</h4>
        </div>
        <p className="text-lg font-medium text-foreground">{dailyMessage.content}</p>
      </CardContent>
    </Card>
  );
};

export default TodaysMessage;
