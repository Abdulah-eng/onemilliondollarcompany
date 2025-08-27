import { useEffect, useState } from 'react';
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

  if (isMobile) {
    return (
      <Drawer open={!!task} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="h-[90%] rounded-t-3xl">
          <ProgramDetailView task={task} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      />
      
      <div
        className={cn(
          "absolute top-0 right-0 h-full w-full max-w-md bg-slate-50 shadow-2xl transition-transform duration-300 ease-in-out",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
      >
        <ProgramDetailView task={task} />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/20 text-white hover:bg-slate-800/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
