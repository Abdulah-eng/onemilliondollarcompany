import { ScheduledTask, typeConfig } from "@/mockdata/programs/mockprograms";
import { CheckCircle2, XCircle, Dumbbell, Apple, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

// Mapping of type to a Lucide icon component
const iconMap = {
  fitness: Dumbbell,
  nutrition: Apple,
  mental: Brain,
};

export function TaskCard({ task, onClick }: { task: ScheduledTask; onClick: () => void }) {
  // ✅ Now uses the single, shared typeConfig from mockprograms.ts
  const config = typeConfig[task.type];
  const Icon = iconMap[task.type];

  const isCompleted = task.status === "completed";
  const isMissed = task.status === "missed" && !isCompleted;

  // Define color based on status for progress bar and icon
  const colorClass = isMissed ? "bg-red-400" : isCompleted ? "bg-emerald-500" : "bg-blue-500";
  
  return (
    <div 
      onClick={onClick} 
      className="cursor-pointer group bg-white hover:shadow-xl transition-all duration-300 rounded-2xl border border-slate-200 overflow-hidden flex items-center p-4 gap-4"
    >
      <span className={cn("p-3 rounded-full", colorClass)}>
        <Icon className="w-6 h-6 text-white" />
      </span>
      
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-slate-800">{task.title}</h3>
            {isCompleted && <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />}
            {isMissed && <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />}
        </div>
        
        <div className="text-sm text-slate-500 -mt-1">{task.content.length} items</div>
        
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={cn("h-2 rounded-full transition-all duration-500", colorClass)} 
            style={{ width: `${task.progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
}
