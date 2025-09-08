// src/components/customer/mycoach/TodaysMessage.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dailyMessage } from '@/mockdata/mycoach/coachData';

const TodaysMessage = () => {
  return (
    <Card className="shadow-md rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base md:text-lg font-semibold">
          {dailyMessage.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{dailyMessage.content}</p>
      </CardContent>
    </Card>
  );
};

export default TodaysMessage;
