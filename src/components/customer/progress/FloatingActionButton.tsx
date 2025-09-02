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
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="flex flex-col items-end space-y-3 mb-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {actionItems.map((item, index) => (
                            <motion.div
                                key={item.label}
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (actionItems.length - index) * 0.05 }}
                            >
                                <span className="text-sm bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-border/50">{item.label}</span>
                                <Button size="icon" className="rounded-full w-12 h-12 shadow-lg" onClick={item.action}>
                                    {item.icon}
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            
            <Button
                size="icon"
                className="rounded-full w-16 h-16 shadow-2xl"
                onClick={() => setIsOpen(!isOpen)}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Plus className="h-8 w-8" />
                </motion.div>
            </Button>
        </div>
    );
}
