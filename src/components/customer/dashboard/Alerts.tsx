// src/components/customer/dashboard/Alerts.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CalendarCheck2, Star, Zap, Clock, ArrowRight } from 'lucide-react';

/*
TODO: Backend Integration Notes for Alerts
- This component should receive the user's state (plan, needsCheckIn, etc.) as props from the main dashboard page.
*/
const mockData = {
  plan: 'standard', // 'none', 'trial', 'otp', 'standard', 'expiring'
  needsCheckIn: true,
};

const Alerts = () => {
  const { plan, needsCheckIn } = mockData;
  const alerts = [];

  // Build the list of alerts based on user state
  if (needsCheckIn) {
    alerts.push({
      icon: <CalendarCheck2 className="text-blue-500" />,
      title: "Daily Check-in Pending",
      description: "Log your progress for today.",
      buttonText: "Check In"
    });
  }
  if (plan === 'standard') {
    alerts.push({
      icon: <Star className="text-orange-500" />,
      title: "Unlock Premium Features",
      description: "Get advanced analytics and more.",
      buttonText: "Go Premium"
    });
  }
  // Add other plan-based alerts here...

  if (alerts.length === 0) return null;

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">For You</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert, index) => (
          <AlertItem key={index} {...alert} />
        ))}
      </CardContent>
    </Card>
  );
};

const AlertItem = ({ icon, title, description, buttonText }) => (
  <div className="flex items-center gap-4">
    <div className="bg-slate-100 p-2 rounded-lg">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-slate-700">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
    <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
        {buttonText} <ArrowRight className="w-4 h-4 ml-1" />
    </Button>
  </div>
);

export default Alerts;
