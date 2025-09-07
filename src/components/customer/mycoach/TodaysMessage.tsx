// src/components/customer/mycoach/TodaysMessage.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { dailyMessage } from "@/mockdata/mycoach/coachData";

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

const TodaysMessage = () => {
  const [visible, setVisible] = useState(true);
  const device = useDeviceType();
  const x = useMotionValue(0);

  const handleDismiss = () => setVisible(false);

  const handleDragEnd = (_event: any, info: any) => {
    if (info.offset.x < -80) {
      handleDismiss();
    } else {
      x.set(0);
    }
  };

  const backgroundOpacity = useTransform(x, [-100, 0], [1, 0]);
  const isTouch = device === "ipad" || device === "mobile";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.25 } }}
          className="relative w-full shadow-lg rounded-2xl overflow-hidden bg-card"
        >
          {/* Swipe background */}
          {isTouch && (
            <motion.div
              className="absolute inset-y-0 right-0 flex items-center justify-end bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 px-6"
              style={{ opacity: backgroundOpacity }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            drag={isTouch ? "x" : false}
            dragConstraints={{ left: -100, right: 0 }}
            dragElastic={0.2}
            style={{ x }}
            onDragEnd={isTouch ? handleDragEnd : undefined}
            className="relative p-6 flex items-start gap-4 hover:bg-muted/40 transition-colors cursor-pointer group"
          >
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/20">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground">{dailyMessage.title}</h4>
              <p className="text-sm text-muted-foreground">{dailyMessage.content}</p>
            </div>

            {/* Desktop dismiss button only */}
            {device === "desktop" && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismiss();
                  }}
                  className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TodaysMessage;
