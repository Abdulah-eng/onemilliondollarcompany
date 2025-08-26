import { Card, CardContent } from "@/components/ui/card";
import { ScheduledTask } from "@/pages/customer/MyProgramsPage";
import { cn } from "@/lib/utils";
import { Dumbbell, Apple, Brain } from "lucide-react";
import { isPast, isToday } from "date-fns";

export const typeConfig = {
  fitness: { Icon: Dumbbell, emoji: "🏋️", color: "bg-emerald-500", image: "/images/fitness-bg.jpg", dot: "bg-emerald-500", missedDot: "bg-emerald-200" },
  nutrition: { Icon: Apple, emoji: "🥗", color: "bg-amber-500", image: "/images/nutrition-bg.jpg", dot: "bg-amber-500", missedDot: "bg-amber-200" },
  mental: { Icon: Brain, emoji: "🧘", color: "bg-indigo-500", image: "/images/mental-bg.jpg", dot: "bg-indigo-500", missedDot: "bg-indigo-200" },
};

export const TaskCard = ({ task, onClick }: { task: ScheduledTask; onClick: () => void }) => {
  const { Icon, color, emoji, image } = typeConfig[task.type];
  const isCompleted = task.status === "completed";
  const isMissed = task.status === "missed" || (isPast(task.date) && !isToday(task.date) && !isCompleted);

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all"
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      <div className="absolute inset-0 bg-black/40" />

      <CardContent className="relative z-10 p-4 flex flex-col gap-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={cn("p-2 rounded-full shadow-md", color)}>
              <Icon className="w-5 h-5 text-white" />
            </span>
            <h3 className="font-bold text-lg">{emoji} {task.title}</h3>
          </div>
          {isCompleted && <span className="text-2xl">✅</span>}
          {isMissed && !isCompleted && <span className="text-2xl">❌</span>}
        </div>

        <p className="text-sm opacity-90">{task.content.length} items</p>

        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className={cn("h-2 rounded-full transition-all duration-500", isMissed ? "bg-red-400" : color)}
            style={{ width: `${isMissed ? 100 : task.progress}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
