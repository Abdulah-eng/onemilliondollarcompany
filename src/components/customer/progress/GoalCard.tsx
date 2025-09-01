import { Goal } from '@/mockdata/progress/mockProgressData';
import { Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function GoalCard({ goal }: { goal: Goal }) {
  const progress = (goal.current / goal.target) * 100;

  return (
    <div className="bg-card dark:bg-[#0d1218] p-4 rounded-2xl border border-border/50">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
            <Target className="h-5 w-5" />
        </div>
        <p className="font-semibold">{goal.title}</p>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>{goal.current.toFixed(1)} {goal.unit}</span>
        <span>{goal.target} {goal.unit}</span>
      </div>
    </div>
  );
}
