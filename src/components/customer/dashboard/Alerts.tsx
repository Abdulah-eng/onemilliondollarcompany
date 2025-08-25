// src/components/customer/dashboard/Alerts.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ArrowRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

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
    // This check is more reliable than just checking window properties
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(isTouchDevice);
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
  const x = useMotionValue(0); // Tracks the swipe distance

  const handleProceed = () => {
    console.log(`Proceeding with: ${title}`);
    // Add navigation logic here
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -80) { // If swiped far enough to the left
      onDismiss();
    }
  };

  // The red background fades in as the user swipes
  const backgroundOpacity = useTransform(x, [-100, 0], [1, 0]);

  return (
    <motion.div
      exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
      className="relative bg-white group"
    >
      {/* Red "Delete" background for swipe gesture (TOUCH ONLY) */}
      {isTouchDevice && (
        <motion.div 
          className="absolute inset-y-0 right-0 flex items-center justify-end bg-red-100 text-red-600 px-6"
          style={{ opacity: backgroundOpacity }}
        >
          <Trash2 />
        </motion.div>
      )}

      {/* Main Alert Content */}
      <motion.div
        drag={isTouchDevice ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        style={{ x }}
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
