// src/components/customer/progress/FloatingActionButton.tsx
import { useState, useRef } from 'react';
// Import ClipboardCheck for the new item
import { Plus, Weight, Camera, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// --- UPDATED ACTION ITEMS ---
const actionItems = [
    { label: 'Weigh In', icon: <Weight className="h-5 w-5" />, action: () => alert('Weigh In') },
    { label: 'Progression Photo', icon: <Camera className="h-5 w-5" />, action: () => null }, // We'll handle this action below
    { label: 'Daily Check in', icon: <ClipboardCheck className="h-5 w-5" />, action: () => alert('Daily Check in') },
];

export default function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const handlePhotoAction = () => {
        setIsOpen(false);
        setIsModalOpen(true);
    };

    const handleCameraClick = () => {
        if (cameraInputRef.current) {
            cameraInputRef.current.click();
        }
    };

    const handleLibraryClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Replace the Progression Photo action with the new function
    actionItems[1].action = handlePhotoAction;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end">
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

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a Progression Photo</DialogTitle>
                        <DialogDescription>
                            Choose to take a new photo with your camera or select one from your library.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Button onClick={handleCameraClick} className="w-full">
                            📸 Take a Photo
                        </Button>
                        <Button onClick={handleLibraryClick} className="w-full">
                            🖼️ Select from Library
                        </Button>
                        {/* Hidden input elements to trigger file picker and camera */}
                        <input
                            type="file"
                            accept="image/*"
                            capture="user" // 'user' for front camera, 'environment' for back
                            ref={cameraInputRef}
                            style={{ display: 'none' }}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
