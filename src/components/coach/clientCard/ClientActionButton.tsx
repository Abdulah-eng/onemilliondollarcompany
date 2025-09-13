// src/components/coach/clientCard/ClientActionButton.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageCircle, ClipboardCheck, Plus } from 'lucide-react';

const actionItems = [
  { label: 'Feedback', icon: <MessageCircle className="h-5 w-5" />, action: () => console.log("Feedback clicked") },
  { label: 'Check In', icon: <ClipboardCheck className="h-5 w-5" />, action: () => console.log("Check In clicked") },
];

export default function ClientActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end">
      {/* Main Toggle Button */}
      <Button
        size="icon"
        className="rounded-full w-16 h-16 shadow-2xl z-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Plus className="h-8 w-8" />
        </motion.div>
      </Button>

      {/* Action Buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="flex flex-col items-end space-y-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {actionItems.map((item, index) => (
              <motion.div
                key={item.label}
                className="flex items-center gap-3"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08, type: "spring", stiffness: 300, damping: 20 }}
              >
                <span className="text-sm bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-border/50">
                  {item.label}
                </span>
                <Button size="icon" className="rounded-full w-12 h-12 shadow-lg" onClick={item.action}>
                  {item.icon}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
