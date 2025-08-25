// src/components/customer/dashboard/Alerts.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/*
TODO: Backend Integration Notes for Alerts
- The initial list of alerts should be generated based on the user's real-time data.
- When an alert is dismissed, its ID should be stored to prevent it from reappearing.
*/
const mockData = {
  plan: 'standard',
  needsCheckIn: true,
};

// A simple hook to check if the device is touch-capable
const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const onResize = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    window.addEventListener('resize', onResize);
    onResize(); // Initial check
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isTouch;
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
      });
    }
    if (mockData.plan === 'standard') {
      alerts.push({
        id: 'upgrade-premium',
        emoji: '⭐',
        emojiBg: 'bg-orange-100',
        title: "Unlock Premium Features",
        description: "Get advanced analytics and more.",
      });
    }
    return alerts;
  };

  const [visibleAlerts, setVisibleAlerts] = useState(getInitialAlerts);

  const handleDismiss = (alertId: string) => {
    setVisibleAlerts(currentAlerts => currentAlerts.filter(alert => alert.id !== alertId));
  };

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">For You</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          <AnimatePresence initial={false}>
            {visibleAlerts.map((alert) => (
              <AlertItem key={alert.id} {...alert} onDismiss={() => handleDismiss(alert.id)} />
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

const AlertItem = ({ emoji, emojiBg, title, description, onDismiss }) => {
  const isTouchDevice = useIsTouchDevice();

  const handleProceed = () => {
    console.log(`Proceeding with: ${title}`);
    // Add navigation logic here
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -80) { // Swipe threshold
      onDismiss();
    }
  };

  return (
    <motion.div
      exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
      className="relative bg-white group"
    >
      {/* Red "Delete" background for swipe gesture (TOUCH ONLY) */}
      {isTouchDevice && (
          <div className="absolute inset-y-0 right-0 flex items-center justify-end bg-red-100 text-red-600 px-6">
              <X />
          </div>
      )}

      {/* Main Alert Content */}
      <motion.div
        drag={isTouchDevice ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        onTap={isTouchDevice ? handleProceed : undefined}
        className="relative p-4 px-6 flex items-center gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
      >
        <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg ${emojiBg}`}>
          <span className="text-xl">{emoji}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-700">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        
        {/* Desktop-only buttons */}
        {!isTouchDevice && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); onDismiss(); }} className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600">
                    <X className="w-5 h-5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleProceed(); }} className="p-2 rounded-full text-slate-500 hover:bg-orange-100 hover:text-orange-600">
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Alerts;
