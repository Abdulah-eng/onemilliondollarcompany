// src/components/customer/viewprogram/exercise/ExerciseDetails.tsx

import { WorkoutExercise, ExerciseSet } from "@/mockdata/viewprograms/mockexerciseprograms";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Timer, PlusCircle, History } from "lucide-react"; // ✅ Import History icon
import { cn } from "@/lib/utils";

interface ExerciseDetailsProps {
  exercise: WorkoutExercise;
  onSetChange: (setIndex: number, updatedSet: Partial<ExerciseSet>) => void;
  onAddSet: () => void;
}

export default function ExerciseDetails({ exercise, onSetChange, onAddSet }: ExerciseDetailsProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // ✅ Helper function to extract the previous KG value from a string like "8 reps @ 40 kg"
  const getPreviousKg = (previousString: string) => {
    if (!previousString || !previousString.includes('@')) return "";
    const parts = previousString.split('@')[1];
    return parts?.trim().split(' ')[0] || "";
  };

  // ✅ Get the performance of the first set from last time to display in the header
  const lastTimePerformance = exercise.sets[0]?.previous;

  return (
    <div className="space-y-4 rounded-2xl bg-card border p-4 sm:p-6">
      {/* --- Redesigned Header --- */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{exercise.name}</h2>
          <p className="text-sm font-semibold text-muted-foreground">{exercise.targetSets} Sets | Target: {exercise.sets[0]?.targetReps} Reps</p>
          {/* ✅ "Last Time" performance moved to the header for a cleaner look */}
          {lastTimePerformance && lastTimePerformance !== "New set" && (
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground font-mono">
              <History className="w-3.5 h-3.5" />
              <span>Last time: {lastTimePerformance}</span>
            </div>
          )}
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
                // ✅ Simplified grid layout for a cleaner look
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
                // ✅ Placeholder now shows the previous weight for guidance
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
                // ✅ Placeholder now shows the target reps for guidance
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
