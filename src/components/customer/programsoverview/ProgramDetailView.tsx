// ✅ 1. IMPORT useNavigate
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScheduledTask, typeConfig } from "@/mockdata/programs/mockprograms";
import { PlayCircle } from "lucide-react";
import { useRef } from "react";

const getEmojiForItem = (item: any, type: ScheduledTask["type"]) => {
  if (!item) return "✅";
  const itemName = typeof item === "object" && item.name ? item.name : String(item);
  const lowerItem = itemName.toLowerCase();

  if (type === "fitness") {
    if (lowerItem.includes("squat") || lowerItem.includes("lunge")) return "🦵";
    if (lowerItem.includes("bench") || lowerItem.includes("press")) return "💪";
    if (lowerItem.includes("row") || lowerItem.includes("pull")) return "🏋️";
    return "🔥";
  }
  if (type === "nutrition") {
    if (lowerItem.includes("breakfast")) return "🥞";
    if (lowerItem.includes("lunch")) return "🥪";
    if (lowerItem.includes("dinner")) return "🍲";
    return "🍴";
  }
  if (type === "mental") {
    if (lowerItem.includes("meditat")) return "🧘";
    if (lowerItem.includes("journal")) return "✍️";
    return "✨";
  }
  return "✅";
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

  if (!task) return null;
  const config = typeConfig[task.type];

  const handleStartClick = () => {
    if (task.type === "fitness") {
      navigate(`/program/${task.id}`);
    }
  };

  // ✅ Touch handlers for swipe up close
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current !== null) {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (deltaY > 80 && onClose) {
        // user swiped up more than 80px
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
      {/* HEADER */}
      <div className="relative h-40 md:h-56 flex-shrink-0 pt-6 max-w-md mx-auto w-full">
        <img
          src={config.imageUrl}
          alt={task.title}
          className="w-full h-full object-cover rounded-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
        <div className="absolute bottom-4 left-4 text-white">
          <Badge
            variant="secondary"
            className="mb-2 bg-white/20 backdrop-blur-sm border-0 text-white"
          >
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
          <ul className="space-y-3">
            {task.content
              .filter((item): item is NonNullable<typeof item> => item != null)
              .map((item, i) => {
                const isObject = typeof item === "object" && item !== null;
                const contentText = isObject ? (item as any).name : String(item);
                const sets = isObject ? (item as any).sets : null;
                const reps = isObject ? (item as any).reps : null;

                return (
                  <li
                    key={i}
                    className="flex items-center justify-between p-4 bg-white dark:bg-[#0d1218] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-4">
                        {getEmojiForItem(item, task.type)}
                      </span>
                      <div>
                        <span className="text-slate-800 dark:text-slate-200 font-medium">
                          {contentText}
                        </span>
                      </div>
                    </div>
                    {sets && reps && (
                      <span className="font-mono text-sm text-slate-500 dark:text-slate-400 font-semibold">
                        {sets}x{reps}
                      </span>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#1e262e]/50 backdrop-blur-sm flex-shrink-0">
        <div className="max-w-md w-full mx-auto">
          <Button
            onClick={handleStartClick}
            size="lg"
            className="w-full h-12 font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Start Task
          </Button>
        </div>
      </div>
    </div>
  );
}
