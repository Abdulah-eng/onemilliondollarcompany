// src/components/customer/progress/FloatingActionButton.tsx
import { useState } from 'react';
import { Plus, Weight, Camera, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const actionItems = [
    { label: 'Log Workout', icon: <Dumbbell className="h-5 w-5" />, action: () => alert('Log Workout') },
    { label: 'Add Photo', icon: <Camera className="h-5 w-5" />, action: () => alert('Add Photo') },
    { label: 'Weigh In', icon: <Weight className="h-5 w-5" />, action: () => alert('Weigh In') },
];

export default function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        // The container now uses flexbox to position the items above the button
        <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end">
            {/* The main button is now rendered first, but appears last due to flex-col-reverse.
                This makes its position stable and unaffected by the items appearing above it. */}
            <Button
                size="icon"
                className="rounded-full w-16 h-16 shadow-2xl z-10" // Added z-10 to ensure it's on top if items overlap
                onClick={() => setIsOpen(!isOpen)}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <Plus className="h-8 w-8" />
                </motion.div>
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="flex flex-col items-end space-y-3 mb-4" // Added a slightly larger margin-bottom
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {actionItems.map((item, index) => (
                            <motion.div
                                key={item.label}
                                className="flex items-center gap-3"
                                // Staggered animation for a more fluid appearance
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
