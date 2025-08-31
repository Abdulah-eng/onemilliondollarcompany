import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScheduledTask, typeConfig } from "@/mockdata/programs/mockprograms";
import { findDetailedTaskById, DetailViewItem } from "@/mockdata/viewprograms/mockdetailedviews";
import { PlayCircle } from "lucide-react";
import { useRef, useMemo } from "react";

const TaskListItem = ({ item }: { item: DetailViewItem }) => {
  return (
    <li className="flex items-center gap-4 p-3 bg-white dark:bg-[#0d1218] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
      <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
      <div className="flex-1">
        <p className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{item.details}</p>
      </div>
    </li>
  );
};

// A fallback component for simple string content
const SimpleTaskListItem = ({ name }: { name: string }) => {
    return (
        <li className="flex items-center gap-4 p-3 bg-white dark:bg-[#0d1218] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
             <div className="h-16 w-16 rounded-lg bg-muted dark:bg-slate-700" />
            <p className="font-semibold text-slate-800 dark:text-slate-200">{name}</p>
        </li>
    )
}

export default function ProgramDetailView({
  task,
  onClose,
}: {
  task: ScheduledTask | null;
  onClose?: () => void;
}) {
  const navigate = useNavigate();
  const touchStartY = useRef<number | null>(null);

  const detailedContent = useMemo(() => {
    if (task?.detailedProgramId) {
      return findDetailedTaskById(task.detailedProgramId)?.content;
    }
    return null; // Return null if no detailed view exists
  }, [task]);

  if (!task) return null;
  const config = typeConfig[task.type];

  const handleStartClick = () => {
    if (task.detailedProgramId) {
      // ✅ FIXED: Navigation now points to the correct route format
      navigate(`/program/${task.detailedProgramId}`);
    }
  };
  
  const handleTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current !== null) {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (deltaY > 80 && onClose) {
        onClose();
      }
    }
    touchStartY.current = null;
  };

  return (
    <div
      className="flex flex-col h-full bg-slate-50 dark:bg-[#1e262e]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* HEADER (No changes) */}
      <div className="relative h-40 md:h-56 flex-shrink-0 pt-6 max-w-md mx-auto w-full">
        {/* ... header content ... */}
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4 md:p-6 pt-4 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200 mb-4">
            Today's Plan:
          </h3>
          {/* ✅ FIXED: Logic now correctly displays detailed content OR falls back to simple content */}
          {detailedContent ? (
            <ul className="space-y-3">
              {detailedContent.map((item, i) => (
                <TaskListItem key={i} item={item} />
              ))}
            </ul>
          ) : (
            <ul className="space-y-3">
                {task.content.map((name, i) => (
                    <SimpleTaskListItem key={i} name={name} />
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* FOOTER (No changes) */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#1e262e]/50 backdrop-blur-sm flex-shrink-0">
        <div className="max-w-md w-full mx-auto">
          <Button
            onClick={handleStartClick}
            size="lg"
            className="w-full h-12 font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg flex items-center justify-center"
            disabled={!task.detailedProgramId}
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Start Task
          </Button>
        </div>
      </div>
    </div>
  );
}
