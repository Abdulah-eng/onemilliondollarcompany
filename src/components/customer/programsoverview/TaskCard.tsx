import { ScheduledTask, typeConfig } from "@/mockdata/programs/mockprograms";
import { CheckCircle2, PlayCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function TaskCard({ task, onClick }: { task: ScheduledTask; onClick: () => void }) {
  const config = typeConfig[task.type];
  const isCompleted = task.status === "completed";
  const isPending = task.status === "pending" || task.status === "in-progress";

  const handleButtonClick = (e: React.MouseEvent) => {
    // Prevent the card's main onClick from firing when the button is clicked
    e.stopPropagation();
    console.log(`Navigating to start task: ${task.title}`);
    // You would add your navigation logic here, e.g., router.push('/start-task/' + task.id)
  };

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer w-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-3xl group min-h-[240px]"
    >
      {/* Background Image */}
      <img
        src={config.imageUrl}
        alt={task.title}
        className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="relative flex flex-col justify-between h-full p-6 text-white">
        {/* Top Section: Category & Status */}
        <div className="flex justify-between items-center">
          <Badge
            variant="secondary"
            className="bg-white/10 backdrop-blur-sm border-0 text-white font-semibold"
          >
            {config.emoji} {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
          </Badge>
          {isCompleted && <CheckCircle2 className="w-6 h-6 text-emerald-300" />}
        </div>
        
        {/* Bottom Section: Title, Details, and Button */}
        <div className="space-y-4">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-md">
              {task.title}
            </h3>
            <p className="text-sm font-medium opacity-80">{task.programTitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
             <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{task.content.length} Items</span>
             </div>
             {/* You could add a duration field to your task data to display here */}
             {/* <div className="flex items-center gap-1.5"><Flame className="w-4 h-4" /><span>Est. 30 min</span></div> */}
          </div>
          
          {isPending && (
            <div className="pt-2">
                <Button 
                    onClick={handleButtonClick}
                    className="font-semibold text-slate-900 rounded-full bg-white hover:bg-slate-200 h-11 px-6 shadow-lg"
                >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    {task.status === "in-progress" ? "Resume" : "Start"}
                </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
