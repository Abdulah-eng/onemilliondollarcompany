import { useMemo } from "react";
import { WorkoutExercise, ExerciseSet } from "@/mockdata/viewprograms/mockexerciseprograms";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Timer, PlusCircle, TrendingUp, TrendingDown, Minus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseDetailsProps {
  exercise: WorkoutExercise;
  onSetChange: (setIndex: number, updatedSet: Partial<ExerciseSet>) => void;
  onAddSet: () => void;
  onRemoveSet: (setIndex: number) => void;
}

const PerformanceInsight = ({ sets }: { sets: ExerciseSet[] }) => {
  const stats = useMemo(() => {
    let previousTotalKg = 0;
    let previousSetsCount = 0;
    let currentTotalKg = 0;
    let currentSetsCount = 0;

    sets.forEach(set => {
      if (set.previous && set.previous.includes('@')) {
        const parts = set.previous.split('@')[1];
        const kg = parseFloat(parts);
        if (!isNaN(kg)) {
          previousTotalKg += kg;
          previousSetsCount++;
        }
      }
      if (set.performedKg !== null && set.performedKg > 0) {
        currentTotalKg += set.performedKg;
        currentSetsCount++;
      }
    });

    if (previousSetsCount === 0) return null;

    const previousAvgKg = previousTotalKg / previousSetsCount;
    
    if (currentSetsCount === 0) {
      return {
        text: `Last time you averaged ${previousAvgKg.toFixed(1)} kg.`,
        Icon: Minus,
        color: "text-muted-foreground",
      };
    }

    const currentAvgKg = currentTotalKg / currentSetsCount;
    const trend = ((currentAvgKg - previousAvgKg) / previousAvgKg) * 100;

    if (trend > 1) {
      return { text: `Up ${trend.toFixed(0)}% from last time!`, Icon: TrendingUp, color: "text-emerald-500" };
    } else if (trend < -1) {
      return { text: `Down ${Math.abs(trend).toFixed(0)}% from last time.`, Icon: TrendingDown, color: "text-red-500" };
    } else {
      return { text: "Maintaining your strength. Solid work!", Icon: Minus, color: "text-blue-500" };
    }
  }, [sets]);

  if (!stats) return null;
  const { text, Icon, color } = stats;

  return (
    <div className={cn("flex items-center gap-2 mt-2 text-xs font-semibold font-sans", color)}>
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </div>
  );
};

export default function ExerciseDetails({ exercise, onSetChange, onAddSet, onRemoveSet }: ExerciseDetailsProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getPreviousKg = (previousString: string) => {
    if (!previousString || !previousString.includes('@')) return "";
    const parts = previousString.split('@')[1];
    return parts?.trim().split(' ')[0] || "";
  };

  return (
    <div className="space-y-4 rounded-2xl bg-card border p-4 sm:p-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{exercise.name}</h2>
          <p className="text-sm font-semibold text-muted-foreground">{exercise.targetSets} Sets | Target: {exercise.sets[0]?.targetReps} Reps</p>
          <PerformanceInsight sets={exercise.sets} />
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground flex-shrink-0">
          <Timer className="h-4 w-4" />
          <span className="font-mono text-sm font-semibold">{formatTime(exercise.restTimeSeconds)}</span>
        </div>
      </div>
      
      {/* --- Table Header (visible on larger screens) --- */}
      <div className="hidden sm:grid grid-cols-12 gap-4 px-4 text-xs font-bold uppercase text-muted-foreground">
        <div className="col-span-1 text-center">Set</div>
        <div className="col-span-8">Performance</div>
        <div className="col-span-3 text-center">Actions</div>
      </div>
      
      {/* --- Sets List --- */}
      <div className="space-y-3">
        {exercise.sets.map((set, index) => (
          <div 
            key={index} 
            // ✅ Mobile-first classes: flexbox for mobile, grid for sm screens and up
            className="flex sm:grid sm:grid-cols-12 gap-3 sm:gap-4 items-center rounded-2xl p-3 transition-colors group bg-background"
          >
            {/* Set Number */}
            <div className="flex-shrink-0 sm:col-span-1 text-center font-bold text-lg text-primary">{index + 1}</div>
            
            {/* ✅ Performance inputs grouped for better mobile layout */}
            <div className="flex-1 sm:col-span-8 grid grid-cols-2 gap-3">
              <div>
                 <label className="text-xs font-medium text-muted-foreground sm:hidden mb-1.5 block">KG</label>
                 <Input
                  type="number"
                  placeholder={getPreviousKg(set.previous)}
                  value={set.performedKg ?? ""}
                  onChange={(e) => onSetChange(index, { performedKg: parseFloat(e.target.value) || null })}
                  className="w-full h-12 text-center font-semibold text-base"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground sm:hidden mb-1.5 block">Reps</label>
                <Input
                  type="number"
                  placeholder={set.targetReps}
                  value={set.performedReps ?? ""}
                  onChange={(e) => onSetChange(index, { performedReps: parseFloat(e.target.value) || null })}
                  className="w-full h-12 text-center font-semibold text-base"
                />
              </div>
            </div>

            {/* Actions (Checkbox & Remove) */}
            <div className="flex-shrink-0 sm:col-span-3 flex items-center justify-center h-full gap-2">
              <Checkbox
                checked={set.completed}
                onCheckedChange={(checked) => onSetChange(index, { completed: !!checked })}
                className={cn(
                    "h-12 w-12 transition-all",
                    set.completed && "bg-primary border-primary text-primary-foreground"
                )}
              />
              {exercise.sets.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                  onClick={() => onRemoveSet(index)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Button
          onClick={onAddSet}
          variant="outline"
          className="w-full h-12 text-base rounded-xl"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Set
        </Button>
      </div>
    </div>
  );
}
