import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScheduledTask, typeConfig } from "@/mockdata/programs/mockprograms";
// ✅ Import the new data source and types
import { findDetailedTaskById, DetailViewItem } from "@/mockdata/viewprograms/mockdetailedviews";
import { PlayCircle } from "lucide-react";
import { useRef, useMemo } from "react";

// A new, cleaner item component for the list
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

export default function ProgramDetailView({
  task,
  onClose,
}: {
  task: ScheduledTask | null;
  onClose?: () => void;
}) {
  const navigate = useNavigate();
  const touchStartY = useRef<number | null>(null);

  // ✅ Fetch detailed content using the detailedProgramId from the task prop
  const detailedContent = useMemo(() => {
    if (task?.detailedProgramId) {
      return findDetailedTaskById(task.detailedProgramId)?.content;
    }
    // If no detailed content, fall back to the simple string array
    return task?.content.map(name => ({ name, imageUrl: '', details: '' })) || [];
  }, [task]);

  if (!task) return null;
  const config = typeConfig[task.type];

  const handleStartClick = () => {
    if (task.detailedProgramId) {
      navigate(`/program/${task.detailedProgramId}`);
    }
  };
  
  const handleTouchStart = (e: React.TouchEvent) => { /* ... no changes ... */ };
  const handleTouchEnd = (e: React.TouchEvent) => { /* ... no changes ... */ };

  return (
    <div
      className="flex flex-col h-full bg-slate-50 dark:bg-[#1e262e]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* HEADER (No changes) */}
      <div className="relative h-40 md:h-56 flex-shrink-0 pt-6 max-w-md mx-auto w-full">
        <img src={config.imageUrl} alt={task.title} className="w-full h-full object-cover rounded-xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
        <div className="absolute bottom-4 left-4 text-white">
          <Badge variant="secondary" className="mb-2 bg-white/20 backdrop-blur-sm border-0 text-white">
            {task.programTitle} - Week {task.weekNumber}
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold drop-shadow-lg">
            {config.emoji} {task.title}
          </h2>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4 md:p-6 pt-4 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200 mb-4">
            Today's Plan:
          </h3>
          {/* ✅ Render the list using the new detailedContent */}
          {detailedContent && detailedContent.length > 0 ? (
            <ul className="space-y-3">
              {detailedContent.map((item, i) => (
                <TaskListItem key={i} item={item} />
              ))}
            </ul>
          ) : (
            <div className="text-center text-slate-500 dark:text-slate-400 py-8">
              No detailed plan available for this task.
            </div>
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
