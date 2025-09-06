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
} from '@/components/ui/dialog';

// Helper component for the weight scroller
const WeightScroller = ({ onWeightChange, value }) => {
  const weights = Array.from({ length: 201 }, (_, i) => 30 + i); // Weights from 30 to 230
  const decimals = Array.from({ length: 10 }, (_, i) => i); // Decimals from 0 to 9

  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="h-40 overflow-y-scroll w-20 text-center custom-scrollbar">
        {weights.map((w) => (
          <div
            key={w}
            className={`py-2 text-2xl font-bold ${
              w === Math.floor(value) ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {w}
          </div>
        ))}
      </div>
      <span className="text-2xl font-bold">.</span>
      <div className="h-40 overflow-y-scroll w-20 text-center custom-scrollbar">
        {decimals.map((d) => (
          <div
            key={d}
            className={`py-2 text-2xl font-bold ${
              d === (value * 10) % 10 ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {d}
          </div>
        ))}
      </div>
      <span className="text-xl">kg</span>
    </div>
  );
};

// --- UPDATED ACTION ITEMS ---
const actionItems = [
    { label: 'Weigh In', icon: <Weight className="h-5 w-5" />, action: () => null }, // We'll handle this action below
    { label: 'Progression Photo', icon: <Camera className="h-5 w-5" />, action: () => null },
    { label: 'Daily Check in', icon: <ClipboardCheck className="h-5 w-5" />, action: () => alert('Daily Check in') },
];

export default function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
    
    // Example state for previous and new weight
    const [previousWeight, setPreviousWeight] = useState(85.5); 
    const [currentWeight, setCurrentWeight] = useState(85.5);

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const handlePhotoAction = () => {
        setIsOpen(false);
        setIsPhotoModalOpen(true);
    };

    const handleWeighInAction = () => {
      setIsOpen(false);
      setIsWeightModalOpen(true);
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

    // Update actions for the new handlers
    actionItems[0].action = handleWeighInAction;
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

            {/* Photo Modal */}
            <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
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
                        <input
                            type="file"
                            accept="image/*"
                            capture="user"
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

            {/* Weigh In Modal */}
            <Dialog open={isWeightModalOpen} onOpenChange={setIsWeightModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Record Your Weight</DialogTitle>
                        <DialogDescription>
                            Your previous weight was <span className="font-bold">{previousWeight}kg</span>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center py-4">
                        <div className="text-4xl font-extrabold mb-4">
                            {currentWeight.toFixed(1)} <span className="text-base font-normal">kg</span>
                        </div>
                        <WeightScroller value={currentWeight} onWeightChange={setCurrentWeight} />
                        <Button className="mt-6 w-full">Save Weight</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
