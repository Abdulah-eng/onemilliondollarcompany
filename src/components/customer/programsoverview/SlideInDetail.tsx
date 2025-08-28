import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import ProgramDetailView from "./ProgramDetailView";
import { ScheduledTask } from '@/mockdata/programs/mockprograms';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export default function SlideInDetail({ 
  task, 
  isMobile, 
  onClose 
}: { 
  task: ScheduledTask | null, 
  isMobile: boolean, 
  onClose: () => void 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (task) {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [task]);

  if (!task) return null;

  // For mobile, the Drawer component handles its own layout correctly.
  if (isMobile) {
    return (
      <Drawer open={!!task} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="h-[90%] rounded-t-3xl">
          <ProgramDetailView task={task} />
        </DrawerContent>
      </Drawer>
    );
  }

  // ✅ For desktop, we render the backdrop and panel as separate fixed elements
  // This prevents any parent layout from creating a gap.
  const desktopSlideIn = (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />
      
      {/* Sliding Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-md bg-card shadow-2xl transition-transform duration-300 ease-in-out",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
      >
        <ProgramDetailView task={task} />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </>
  );

  return createPortal(desktopSlideIn, document.body);
}
