// src/components/customer/dashboard/Alerts.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';

/*
TODO: Backend Integration Notes for Alerts
- The initial list of alerts should be generated based on the user's real-time data.
- When an alert is dismissed, its ID should be stored to prevent it from reappearing.
*/
const mockData = {
  plan: 'standard',
  needsCheckIn: true,
};

const Alerts = () => {
  const getInitialAlerts = () => {
    const alerts = [];
    if (mockData.needsCheckIn) {
      alerts.push({
        id: 'check-in',
        emoji: '🗓️',
        emojiBg: 'bg-blue-100',
        title: "Daily Check-in Pending",
        description: "Log your progress for today.",
        buttonText: "Check In"
      });
    }
    if (mockData.plan === 'standard') {
      alerts.push({
        id: 'upgrade-premium',
        emoji: '⭐',
        emojiBg: 'bg-orange-100',
        title: "Unlock Premium Features",
        description: "Get advanced analytics and more.",
        buttonText: "Go Premium"
      });
    }
    return alerts;
  };

  const [visibleAlerts, setVisibleAlerts] = useState(getInitialAlerts);

  const handleDismiss = (alertId: string) => {
    setVisibleAlerts(currentAlerts => currentAlerts.filter(alert => alert.id !== alertId));
  };

  if (visibleAlerts.length === 0) {
    return null; // Don't render the card if there are no alerts
  }

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">For You</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {visibleAlerts.map((alert) => (
            <AlertItem key={alert.id} {...alert} onDismiss={() => handleDismiss(alert.id)} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AlertItem = ({ emoji, emojiBg, title, description, buttonText, onDismiss }) => (
  <div className="p-4 px-6 flex items-center gap-4 group hover:bg-slate-50/50 transition-colors cursor-pointer">
    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg ${emojiBg}`}>
      <span className="text-xl">{emoji}</span>
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-slate-700">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
    <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-semibold hidden sm:flex">
        {buttonText} <ArrowRight className="w-4 h-4 ml-1" />
    </Button>
    <button onClick={onDismiss} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
    </button>
  </div>
);

export default Alerts;
