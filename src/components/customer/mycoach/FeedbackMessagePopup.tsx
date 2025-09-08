// src/components/customer/mycoach/FeedbackMessagePopup.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

const FeedbackMessagePopup = ({ message, isVisible, onDismiss }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-[60] p-4 bg-background text-foreground rounded-lg shadow-2xl border-2 border-green-500 w-11/12 sm:w-80"
                >
                    <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        <span className="ml-3 text-sm font-medium flex-grow">
                            {message}
                        </span>
                        <button onClick={onDismiss} className="ml-4 p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FeedbackMessagePopup;
