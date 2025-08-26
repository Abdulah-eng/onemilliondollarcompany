// src/components/customer/programsoverview/TaskCard.tsx
import { ScheduledTask } from "@/mockdata/programs/mockprograms";
import { CheckCircle2, XCircle, Dumbbell, Apple, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const typeConfig = {
  fitness: { Icon: Dumbbell, color: "bg-emerald-500", dot: "bg-emerald-500", missedDot: "bg-emerald-200", emoji: "🏋️‍♂️" },
  nutrition: { Icon: Apple, color: "bg-amber-500", dot: "bg-amber-500", missedDot: "bg-amber-200", emoji: "🥗" },
  mental: { Icon: Brain, color: "bg-indigo-500", dot: "bg-indigo-500", missedDot: "bg-indigo-200", emoji: "🧠" },
};

export function TaskCard({ task, onClick }: { task: ScheduledTask; onClick: () => void }) {
  const { Icon, color, emoji } = typeConfig[task.type];
  const isCompleted = task.status === "completed";
  const isMissed = task.status === "missed" && !isCompleted;

  return (
    <div onClick={onClick} className="cursor-pointer hover:shadow-xl transition-shadow rounded-2xl border border-gray-200 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-2 text-xl">{emoji}</div>
      <div className="p-4 flex flex-col gap-2 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={cn("p-2 rounded-full", color)}><Icon className="w-5 h-5 text-white" /></span>
            <h3 className="font-bold text-gray-800">{task.title}</h3>
          </div>
          {isCompleted && <CheckCircle2 className="w-6 h-6 text-green-500" />}
          {isMissed && <XCircle className="w-6 h-6 text-red-400" />}
        </div>
        <div className="text-sm text-gray-500">{task.content.length} items</div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className={cn("h-2 rounded-full transition-all", isMissed ? "bg-red-400" : color)} style={{ width: `${task.progress}%` }} />
        </div>
      </div>
    </div>
  );
}
