// src/components/customer/dashboard/Alerts.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, ArrowRight, Trash2 } from "lucide-react";

// --- Detect device type ---
function useDeviceType() {
  const [device, setDevice] = useState<"desktop" | "ipad" | "mobile">("desktop");

  useEffect(() => {
    const checkDevice = () => {
      if (window.innerWidth <= 768) setDevice("mobile");
      else if (window.innerWidth <= 1024) setDevice("ipad");
      else setDevice("desktop");
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return device;
}

// --- Single Alert Item ---
const AlertItem = ({ emoji, emojiBg, title, description, extra, onDismiss, isFirst, isLast }) => {
  const device = useDeviceType();
  const x = useMotionValue(0);

  const handleProceed = () => {
    console.log(`Proceeding with: ${title}`);
  };

  const handleDragEnd = (_event, info) => {
    if (info.offset.x < -80) {
      onDismiss();
    } else {
      x.set(0);
    }
  };

  const backgroundOpacity = useTransform(x, [-100, 0], [1, 0]);
  const isTouch = device === "ipad" || device === "mobile";

  return (
    <motion.div
      exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
      className={`relative bg-card group w-full ${isFirst ? "rounded-t-2xl" : ""} ${isLast ? "rounded-b-2xl overflow-hidden" : ""}`}
    >
      {/* swipe background */}
      {isTouch && (
        <motion.div
          className="absolute inset-y-0 right-0 flex items-center justify-end bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 px-6"
          style={{ opacity: backgroundOpacity }}
        >
          <Trash2 />
        </motion.div>
      )}

      {/* content */}
      <motion.div
        drag={isTouch ? "x" : false}
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.2}
        style={{ x }}
        onDragEnd={isTouch ? handleDragEnd : undefined}
        onTap={isTouch ? handleProceed : undefined}
        className="relative p-4 px-6 flex items-center gap-4 hover:bg-muted/40 transition-colors cursor-pointer"
      >
        <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg ${emojiBg}`}>
          <span className="text-xl">{emoji}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          {extra && <div className="mt-1 text-xs text-muted-foreground">{extra}</div>}
        </div>

        {device === "desktop" && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleProceed();
              }}
              className="p-2 rounded-full text-muted-foreground hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-500/20 dark:hover:text-orange-400"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// --- Alerts List ---
export default function Alerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      emoji: "⚡️",
      emojiBg: "bg-yellow-100 dark:bg-yellow-500/20",
      title: "New Feature",
      description: "You can now swipe to dismiss on mobile!",
      extra: "Released 2h ago • By system",
    },
    {
      id: 2,
      emoji: "🔥",
      emojiBg: "bg-red-100 dark:bg-red-500/20",
      title: "Streak",
      description: "You've worked out 5 days in a row!",
      extra: "Level: Bronze • XP +30",
    },
    {
      id: 3,
      emoji: "💧",
      emojiBg: "bg-blue-100 dark:bg-blue-500/20",
      title: "Hydration",
      description: "Don’t forget to drink water today.",
      extra: "Goal: 2.5L • Current: 0.8L",
    },
    {
      id: 4,
      emoji: "💡",
      emojiBg: "bg-green-100 dark:bg-green-500/20",
      title: "Coach's Tip",
      description: "Remember to stay hydrated, especially on days with cardio. It's key to reaching your goals!",
      extra: "Tip by Coach • Today",
    },
  ]);

  const handleDismiss = (id: number) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="w-full mx-auto mt-4 shadow-lg rounded-2xl overflow-hidden">
      <AnimatePresence>
        {alerts.map((alert, index) => (
          <AlertItem
            key={alert.id}
            {...alert}
            onDismiss={() => handleDismiss(alert.id)}
            isFirst={index === 0}
            isLast={index === alerts.length - 1}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
