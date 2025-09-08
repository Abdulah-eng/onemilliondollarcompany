import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface FeedbackMessagePopupProps {
    message: string;
    isVisible: boolean;
    onDismiss: () => void;
}

const FeedbackMessagePopup: React.FC<FeedbackMessagePopupProps> = ({ message, isVisible, onDismiss }) => {
    return createPortal(
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed inset-x-0 z-[70] mx-auto w-[calc(100%-2rem)] max-w-sm p-4 bg-background text-foreground rounded-lg shadow-2xl border-2 border-green-500"
                    style={{ 
                        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' 
                    }}
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
        </AnimatePresence>,
        document.body
    );
};

export default FeedbackMessagePopup;
