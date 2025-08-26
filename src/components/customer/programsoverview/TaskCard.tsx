// src/components/customer/programsoverview/TaskCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Dumbbell, Apple, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { isPast, isToday } from "date-fns";

export const typeConfig = {
  fitness: { Icon: Dumbbell, color: "bg-emerald-500", dot: "bg-emerald-500", missedDot: "bg-emerald-200" },
  nutrition: { Icon: Apple, color: "bg-amber-500", dot: "bg-amber-500", missedDot: "bg-amber-200" },
  mental: { Icon: Brain, color: "bg-indigo-500", dot: "bg-indigo-500", missedDot: "bg-indigo-200" },
};

export interface ScheduledTask {
  id: string;
  type: "fitness" | "nutrition" | "mental";
  title: string;
  content: string[];
  status: "pending" | "completed" | "missed" | "in-progress";
  progress: number;
  date: Date;
  programId: string;
  programTitle: string;
  weekNumber: number;
}

export default function TaskCard({ task, onClick }: { task: ScheduledTask; onClick: () => void }) {
  const { Icon, color } = typeConfig[task.type];
  const isCompleted = task.status === "completed";
  const isMissed = task.status === "missed" || (isPast(task.date) && !isToday(task.date) && !isCompleted);

  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-lg transition rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={cn("p-2 rounded-full", color)}>
              <Icon className="w-5 h-5 text-white" />
            </span>
            <h3 className="font-bold text-slate-800">{task.title}</h3>
          </div>
          {isCompleted && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
          {isMissed && !isCompleted && <XCircle className="w-6 h-6 text-red-400" />}
        </div>
        <div className="text-sm text-slate-500">{task.content.length} {task.content.length > 1 ? "items" : "item"}</div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={cn("h-2 rounded-full transition-all duration-500", isMissed && !isCompleted ? "bg-red-400" : color)}
            style={{ width: `${isMissed && !isCompleted ? 100 : task.progress}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
