import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, ArrowRight, Trash2 } from "lucide-react";

// Detect device type
function useDeviceType() {
  const [device, setDevice] = useState<"desktop" | "ipad" | "mobile">("desktop");

  useEffect(() => {
    const checkDevice = () => {
      if (window.innerWidth <= 768) {
        setDevice("mobile");
      } else if (window.innerWidth <= 1024) {
        setDevice("ipad");
      } else {
        setDevice("desktop");
      }
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return device;
}

const AlertItem = ({ emoji, emojiBg, title, description, onDismiss, isFirst, isLast }) => {
  const device = useDeviceType();
  const x = useMotionValue(0);

  const handleProceed = () => {
    console.log(`Proceeding with: ${title}`);
  };

  const handleDragEnd = (_event, info) => {
    if (info.offset.x < -80) {
      // swipe left = dismiss
      onDismiss();
    } else {
      // reset if not far enough
      x.set(0);
    }
  };

  const backgroundOpacity = useTransform(x, [-100, 0], [1, 0]);
  const isTouch = device === "ipad" || device === "mobile";

  return (
    <motion.div
      exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
      className={`relative bg-white group ${
        isFirst ? "rounded-t-2xl" : ""
      } ${isLast ? "rounded-b-2xl overflow-hidden" : ""}`}
    >
      {/* red swipe background */}
      {isTouch && (
        <motion.div
          className="absolute inset-y-0 right-0 flex items-center justify-end bg-red-100 text-red-600 px-6"
          style={{ opacity: backgroundOpacity }}
        >
          <Trash2 />
        </motion.div>
      )}

      {/* main content */}
      <motion.div
        drag={isTouch ? "x" : false}
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.2}
        style={{ x }}
        onDragEnd={isTouch ? handleDragEnd : undefined}
        onTap={isTouch ? handleProceed : undefined}
        className="relative p-4 px-6 flex items-center gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
      >
        {/* emoji */}
        <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg ${emojiBg}`}>
          <span className="text-xl">{emoji}</span>
        </div>

        {/* text */}
        <div className="flex-1">
          <h3 className="font-semibold text-slate-700">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>

        {/* desktop buttons */}
        {device === "desktop" && (
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleProceed();
              }}
              className="p-2 rounded-full text-slate-500 hover:bg-orange-100 hover:text-orange-600"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default function AlertList() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      emoji: "⚡️",
      emojiBg: "bg-yellow-100",
      title: "New Feature",
      description: "You can now swipe to dismiss on mobile!",
    },
    {
      id: 2,
      emoji: "🔥",
      emojiBg: "bg-red-100",
      title: "Streak",
      description: "You've worked out 5 days in a row!",
    },
    {
      id: 3,
      emoji: "💧",
      emojiBg: "bg-blue-100",
      title: "Hydration",
      description: "Don’t forget to drink water today.",
    },
  ]);

  const handleDismiss = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="max-w-md mx-auto mt-12 shadow-lg rounded-2xl overflow-hidden">
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
