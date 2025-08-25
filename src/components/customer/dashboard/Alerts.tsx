// src/components/customer/dashboard/Alerts.tsx
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ArrowRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
          {visibleAlerts.map((alert) => (
            <AlertItem key={alert.id} {...alert} onDismiss={() => handleDismiss(alert.id)} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AlertItem = ({ emoji, emojiBg, title, description, onDismiss }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const handleProceed = () => {
    console.log(`Proceeding with: ${title}`);
    // Add navigation logic here
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - dragStartX;
    // Only allow swiping left
    if (deltaX < 0) {
      setDragOffset(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (dragOffset < -80) { // Dismiss threshold
      // Animate out
      if (itemRef.current) {
        itemRef.current.style.transition = 'transform 0.2s ease-out';
        itemRef.current.style.transform = 'translateX(-100%)';
      }
      setTimeout(onDismiss, 200);
    } else {
      // Snap back
      if (itemRef.current) {
        itemRef.current.style.transition = 'transform 0.2s ease-out';
        itemRef.current.style.transform = 'translateX(0)';
      }
    }
    setIsDragging(false);
    setDragStartX(0);
    setDragOffset(0);
  };

  return (
    <div className="relative bg-white group overflow-hidden">
      {/* Red "Delete" background for swipe gesture */}
      <div className="absolute inset-y-0 right-0 flex items-center justify-end bg-red-500 text-white px-6" style={{ width: `${-dragOffset}px` }}>
        <Trash2 />
      </div>

      {/* Main Alert Content */}
      <div
        ref={itemRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleProceed}
        style={{ transform: `translateX(${dragOffset}px)`, transition: isDragging ? 'none' : 'transform 0.2s ease-out' }}
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
        <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onDismiss(); }} className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600">
              <X className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleProceed(); }} className="p-2 rounded-full text-slate-500 hover:bg-orange-100 hover:text-orange-600">
              <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
