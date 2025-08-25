// src/components/customer/dashboard/Alerts.tsx
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ArrowRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';

/*
TODO: Backend Integration Notes for Alerts
- The initial list of alerts should be generated based on the user's real-time data.
- When an alert is dismissed, its ID should be stored to prevent it from reappearing.
*/
const mockData = {
  plan: 'standard',
  needsCheckIn: true,
};

// Robust device detector (avoids iPad false negatives)
type DeviceType = 'desktop' | 'ipad' | 'mobile' | 'unknown';

const useDeviceType = (): DeviceType => {
  const [device, setDevice] = useState<DeviceType>('unknown');

  useEffect(() => {
    const compute = () => {
      const hasTouch =
        ('ontouchstart' in window) ||
        (navigator as any).msMaxTouchPoints > 0 ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia?.('(any-pointer: coarse)').matches ||
        window.matchMedia?.('(pointer: coarse)').matches;

      const width = window.innerWidth;

      if (!hasTouch) {
        setDevice('desktop');
      } else if (width >= 768) {
        setDevice('ipad');
      } else {
        setDevice('mobile');
      }
    };

    compute(); // initial
    window.addEventListener('resize', compute);
    window.addEventListener('orientationchange', compute);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('orientationchange', compute);
    };
  }, []);

  return device;
};

const Alerts = () => {
  const getInitialAlerts = () => {
    const alerts = [];
    if (mockData.needsCheckIn) {
      alerts.push({
        id: 'check-in',
        emoji: '🗓️',
        emojiBg: 'bg-blue-100',
        title: 'Daily Check-in Pending',
        description: 'Log your progress for today.',
      });
    }
    if (mockData.plan === 'standard') {
      alerts.push({
        id: 'upgrade-premium',
        emoji: '⭐',
        emojiBg: 'bg-orange-100',
        title: 'Unlock Premium Features',
        description: 'Get advanced analytics and more.',
      });
    }
    return alerts;
  };

  const [visibleAlerts, setVisibleAlerts] = useState(getInitialAlerts);

  const handleDismiss = (alertId: string) => {
    setVisibleAlerts((current) => current.filter((a) => a.id !== alertId));
  };

  if (visibleAlerts.length === 0) return null;

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
  const device = useDeviceType();
  const isTouch = device === 'ipad' || device === 'mobile';

  // Motion
  const x = useMotionValue(0);
  const controls = useAnimation();
  const bgOpacity = useTransform(x, [-120, 0], [1, 0]);

  // For reliable tap detection on iOS (works alongside drag)
  const downRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const handleProceed = () => {
    console.log(`Proceeding with: ${title}`);
    // Add navigation logic here
  };

  // Dismiss with animated slide-out, then remove
  const animateDismiss = async () => {
    await controls.start({
      x: -window.innerWidth, // slide fully left
      opacity: 0,
      transition: { duration: 0.22, ease: 'easeOut' },
    });
    onDismiss();
  };

  const handleDragEnd = (_event, info) => {
    if (info.offset.x < -80) {
      // Sufficient swipe → animate out then remove
      animateDismiss();
    } else {
      // Not far enough → snap back
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 500, damping: 35 } });
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!isTouch) return;
    downRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isTouch) return;
    const start = downRef.current;
    downRef.current = null;
    if (!start) return;

    const dx = Math.abs(e.clientX - start.x);
    const dy = Math.abs(e.clientY - start.y);
    const dt = performance.now() - start.t;

    // Heuristics for "tap": short, minimal movement
    if (dx < 8 && dy < 8 && dt < 250) {
      handleProceed();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1, height: 'auto' }}
      exit={{ x: -140, opacity: 0, height: 0, transition: { duration: 0.2 } }}
      className="relative bg-white group"
    >
      {/* Right-side delete background (touch only) */}
      {isTouch && (
        <motion.div
          className="absolute inset-y-0 right-0 flex items-center justify-end bg-red-100 text-red-600 px-6"
          style={{ opacity: bgOpacity }}
          aria-hidden="true"
        >
          <Trash2 />
        </motion.div>
      )}

      {/* Draggable row */}
      <motion.div
        drag={isTouch ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        animate={controls}
        style={{
          x,
          touchAction: isTouch ? 'pan-y' : 'auto', // allow horizontal pan while keeping vertical scroll
          WebkitTapHighlightColor: 'transparent',
        }}
        onDragEnd={isTouch ? handleDragEnd : undefined}
        onPointerDown={isTouch ? onPointerDown : undefined}
        onPointerUp={isTouch ? onPointerUp : undefined}
        className="relative p-4 px-6 flex items-center gap-4 hover:bg-slate-50/50 transition-colors select-none"
      >
        {/* Tap zone (fills the row) */}
        <div className="flex flex-1 items-center gap-4 cursor-pointer active:bg-slate-100">
          <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg ${emojiBg}`}>
            <span className="text-xl">{emoji}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-700">{title}</h3>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>

        {/* Desktop-only buttons (never render while device is unknown to avoid flash) */}
        {device === 'desktop' && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleProceed();
              }}
              className="p-2 rounded-full text-slate-500 hover:bg-orange-100 hover:text-orange-600"
              aria-label="Proceed"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Alerts;
