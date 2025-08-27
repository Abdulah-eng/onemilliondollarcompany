import { ScheduledTask, typeConfig } from "@/mockdata/programs/mockprograms";
import { CheckCircle2, PlayCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function TaskCard({ task, onClick }: { task: ScheduledTask; onClick: () => void }) {
  const config = typeConfig[task.type];
  const isCompleted = task.status === "completed";
  const isPending = task.status === "pending" || task.status === "in-progress";

  const handleButtonClick = (e: React.MouseEvent) => {
    // Stop the card's own onClick event from firing when the button is clicked
    e.stopPropagation(); 
    // For now, this can navigate to a blank page or just log to the console
    console.log(`Starting task: ${task.title}`);
    // Example navigation (if using a router like Next.js or React Router)
    // router.push('/program/start'); 
  };

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer w-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-3xl group min-h-[220px]"
    >
      {/* Background Image */}
      <img
        src={config.imageUrl}
        alt={task.title}
        className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      
      <div className="relative flex flex-col justify-between h-full p-6 text-white">
        {/* Top Section with Status */}
        <div className="flex justify-between items-center">
          <Badge
            variant="secondary"
            className="bg-white/10 backdrop-blur-sm border-0 text-white font-semibold"
          >
            {config.emoji} {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
          </Badge>
          {isCompleted && <CheckCircle2 className="w-6 h-6 text-emerald-300" />}
        </div>
        
        {/* Bottom Section with Title and Button */}
        <div className="space-y-3">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
            {task.title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium opacity-80">{task.content.length} items</p>
            {isPending && (
              <Button 
                onClick={handleButtonClick}
                size="sm" 
                className="font-semibold text-slate-900 rounded-full bg-white hover:bg-slate-200 h-9 px-5"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                {task.status === "in-progress" ? "Resume" : "Start"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
