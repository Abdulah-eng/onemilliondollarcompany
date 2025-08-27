import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScheduledTask, typeConfig } from "@/mockdata/programs/mockprograms";
import { PlayCircle } from "lucide-react";
import { memo } from "react";

// Emoji helper
const getEmojiForItem = (item: string, type: ScheduledTask["type"]) => {
  const lowerItem = item.toLowerCase();
  if (type === "fitness") {
    if (lowerItem.includes("squat") || lowerItem.includes("lunge")) return "🦵";
    if (lowerItem.includes("bench") || lowerItem.includes("press")) return "💪";
    return "🔥";
  }
  if (type === "nutrition") {
    if (lowerItem.includes("breakfast")) return "🥞";
    if (lowerItem.includes("lunch")) return "🥪";
    return "🍲";
  }
  if (type === "mental") {
    if (lowerItem.includes("meditat")) return "🧘";
    if (lowerItem.includes("journal")) return "✍️";
    return "✨";
  }
  return "✅";
};

const ProgramDetailView = memo(function ProgramDetailView({ task }: { task: ScheduledTask | null }) {
  if (!task) return null;

  const config = typeConfig[task.type];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* HEADER */}
      <div className="relative h-48 md:h-64 flex-shrink-0">
        <img
          src={config.imageUrl}
          alt={task.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <Badge variant="secondary" className="mb-2 bg-white/20 backdrop-blur-sm border-0 text-white">
            {task.programTitle} - Week {task.weekNumber}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
            {config.emoji} {task.title}
          </h2>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
        <h3 className="font-semibold text-lg text-slate-700">Today's Plan:</h3>
        <ul className="space-y-3">
          {task.content.map((item, i) => (
            <li
              key={i}
              className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 transition-transform hover:scale-[1.02]"
            >
              <span className="text-2xl mr-4">{getEmojiForItem(item, task.type)}</span>
              <span className="text-slate-800 font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-200 bg-white/50 backdrop-blur-sm flex-shrink-0">
        <Button
          size="lg"
          className="w-full h-12 font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center"
        >
          <PlayCircle className="w-5 h-5 mr-2" />
          Start Task
        </Button>
      </div>
    </div>
  );
});

export default ProgramDetailView;
