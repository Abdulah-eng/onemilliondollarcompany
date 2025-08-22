// src/components/customer/dashboard/WelcomeHeader.tsx
import { Card, CardContent } from '@/components/ui/card';

const mockData = {
  userName: 'Alex',
  quote: "The journey of a thousand miles begins with a single step.",
};

const WelcomeHeader = () => {
  const { userName, quote } = mockData;
  const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening';

  return (
    <Card className="border-none bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg animate-fade-in-down">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            {/* --- SIZE ADJUSTMENT --- */}
            <h1 className="text-2xl font-bold">Good {timeOfDay}, {userName}</h1>
            <p className="opacity-80 mt-1">Ready to make today count?</p>
          </div>
          <span className="text-3xl transform -rotate-12 opacity-50">☀️</span>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm italic opacity-90">"{quote}"</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeHeader;
