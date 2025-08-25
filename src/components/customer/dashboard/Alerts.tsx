// src/components/customer/dashboard/Alerts.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CalendarCheck2, Star, Zap, Clock, X, ArrowRight } from 'lucide-react';

/*
TODO: Backend Integration Notes for Alerts
- The initial list of alerts should be generated based on the user's real-time data (plan, check-in status, etc.).
- When an alert is dismissed, its ID should be stored in localStorage or the user's profile in Supabase to prevent it from reappearing on the next visit.
*/
const mockData = {
  plan: 'standard', // 'none', 'trial', 'otp', 'standard', 'expiring'
  needsCheckIn: true,
};

const Alerts = () => {
  // Generate the initial list of alerts
  const getInitialAlerts = () => {
    const alerts = [];
    if (mockData.needsCheckIn) {
      alerts.push({
        id: 'check-in',
        icon: <CalendarCheck2 className="text-blue-500" />,
        title: "Daily Check-in Pending",
        description: "Log your progress for today.",
        buttonText: "Check In"
      });
    }
    if (mockData.plan === 'standard') {
      alerts.push({
        id: 'upgrade-premium',
        icon: <Star className="text-orange-500" />,
        title: "Unlock Premium Features",
        description: "Get advanced analytics and more.",
        buttonText: "Go Premium"
      });
    }
    // Add other plan-based alerts here...
    return alerts;
  };

  const [visibleAlerts, setVisibleAlerts] = useState(getInitialAlerts);

  const handleDismiss = (alertId: string) => {
    setVisibleAlerts(currentAlerts => currentAlerts.filter(alert => alert.id !== alertId));
  };

  if (visibleAlerts.length === 0) {
    return (
        <Card className="bg-white shadow-md">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800">For You</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-slate-500 text-center py-4">No new notifications. You're all caught up!</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">For You</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-slate-100 -mx-6 px-0">
        {visibleAlerts.map((alert) => (
          <AlertItem key={alert.id} {...alert} onDismiss={() => handleDismiss(alert.id)} />
        ))}
      </CardContent>
    </Card>
  );
};

const AlertItem = ({ icon, title, description, buttonText, onDismiss }) => (
  <div className="p-4 px-6 flex items-center gap-4 group">
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
    <button onClick={onDismiss} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
    </button>
  </div>
);

export default Alerts;
