// src/components/customer/viewprogram/exercise/ExerciseDetails.tsx

import { useMemo } from "react";
import { WorkoutExercise, ExerciseSet } from "@/mockdata/viewprograms/mockexerciseprograms";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Timer, PlusCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseDetailsProps {
  exercise: WorkoutExercise;
  onSetChange: (setIndex: number, updatedSet: Partial<ExerciseSet>) => void;
  onAddSet: () => void;
}

// ✅ New component to display the calculated performance insight
const PerformanceInsight = ({ sets }: { sets: ExerciseSet[] }) => {
  const stats = useMemo(() => {
    let previousTotalKg = 0;
    let previousSetsCount = 0;
    let currentTotalKg = 0;
    let currentSetsCount = 0;

    sets.forEach(set => {
      // Calculate previous performance
      if (set.previous && set.previous.includes('@')) {
        const parts = set.previous.split('@')[1];
        const kg = parseFloat(parts);
        if (!isNaN(kg)) {
          previousTotalKg += kg;
          previousSetsCount++;
        }
      }
      // Calculate current performance
      if (set.performedKg !== null && set.performedKg > 0) {
        currentTotalKg += set.performedKg;
        currentSetsCount++;
      }
    });

    if (previousSetsCount === 0) return null; // No previous data to compare to

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
      return {
        text: `Up ${trend.toFixed(0)}% from last time!`,
        Icon: TrendingUp,
        color: "text-emerald-500",
      };
    } else if (trend < -1) {
      return {
        text: `Down ${Math.abs(trend).toFixed(0)}% from last time.`,
        Icon: TrendingDown,
        color: "text-red-500",
      };
    } else {
      return {
        text: "Maintaining your strength. Solid work!",
        Icon: Minus,
        color: "text-blue-500",
      };
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


export default function ExerciseDetails({ exercise, onSetChange, onAddSet }: ExerciseDetailsProps) {
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
      {/* --- Header --- */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{exercise.name}</h2>
          <p className="text-sm font-semibold text-muted-foreground">{exercise.targetSets} Sets | Target: {exercise.sets[0]?.targetReps} Reps</p>
          {/* ✅ "Last Time" text is now the dynamic PerformanceInsight component */}
          <PerformanceInsight sets={exercise.sets} />
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground flex-shrink-0">
          <Timer className="h-4 w-4" />
          <span className="font-mono text-sm font-semibold">{formatTime(exercise.restTimeSeconds)}</span>
        </div>
      </div>
      
      {/* --- Table Header (visible on larger screens) --- */}
      <div className="hidden sm:grid grid-cols-12 gap-4 px-2 text-xs font-bold uppercase text-muted-foreground">
        <div className="col-span-1 text-center">Set</div>
        <div className="col-span-5">KG</div>
        <div className="col-span-4">Reps</div>
        <div className="col-span-2 text-center">Done</div>
      </div>
      
      {/* --- Sets List --- */}
      <div className="space-y-3">
        {exercise.sets.map((set, index) => (
          <div 
            key={index} 
            className={cn(
                "grid grid-cols-12 gap-x-3 sm:gap-x-4 items-center rounded-lg p-3 transition-colors",
                set.completed ? "bg-primary/5 border-l-4 border-primary" : "bg-background"
            )}
          >
            {/* Set Number */}
            <div className="col-span-1 text-center font-bold text-lg text-primary">{index + 1}</div>
            
            {/* KG Input */}
            <div className="col-span-5">
              <Input
                type="number"
                placeholder={getPreviousKg(set.previous)}
                value={set.performedKg ?? ""}
                onChange={(e) => onSetChange(index, { performedKg: parseFloat(e.target.value) || null })}
                className="w-full h-12 text-center font-semibold text-base"
              />
            </div>

            {/* Reps Input */}
            <div className="col-span-4">
              <Input
                type="number"
                placeholder={set.targetReps}
                value={set.performedReps ?? ""}
                onChange={(e) => onSetChange(index, { performedReps: parseFloat(e.target.value) || null })}
                className="w-full h-12 text-center font-semibold text-base"
              />
            </div>

            {/* Checkbox */}
            <div className="col-span-2 flex items-center justify-center h-full">
              <Checkbox
                checked={set.completed}
                onCheckedChange={(checked) => onSetChange(index, { completed: !!checked })}
                className="h-8 w-8"
              />
            </div>
          </div>
        ))}
      </div>

      {/* --- Add Set Button --- */}
      <div className="pt-2">
          <Button
            onClick={onAddSet}
            variant="outline"
            className="w-full h-11"
          >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Set
          </Button>
      </div>
    </div>
  );
}
