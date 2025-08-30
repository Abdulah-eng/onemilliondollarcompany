// src/components/customer/viewprogram/exercise/ExerciseDetails.tsx

import { WorkoutExercise, ExerciseSet } from "@/mockdata/viewprograms/mockexerciseprograms";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Timer, PlusCircle } from "lucide-react";
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

  return (
    <div className="space-y-4 rounded-2xl bg-card border p-4 sm:p-6">
      {/* --- Header --- */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{exercise.name}</h2>
          <p className="text-sm text-muted-foreground">{exercise.targetSets} Sets | Target: {exercise.sets[0]?.targetReps} Reps</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground flex-shrink-0">
          <Timer className="h-4 w-4" />
          <span className="font-mono text-sm font-semibold">{formatTime(exercise.restTimeSeconds)}</span>
        </div>
      </div>
      
      {/* --- Table Header (visible on larger screens) --- */}
      <div className="hidden sm:grid grid-cols-12 gap-4 px-2 text-xs font-bold uppercase text-muted-foreground">
        <div className="col-span-1 text-center">Set</div>
        <div className="col-span-4">Previous</div>
        <div className="col-span-3">KG</div>
        <div className="col-span-2">Reps</div>
        <div className="col-span-2 text-center">Done</div>
      </div>
      
      {/* --- Sets List --- */}
      <div className="space-y-3">
        {exercise.sets.map((set, index) => (
          <div 
            key={index} 
            className={cn(
                "grid grid-cols-12 gap-x-2 sm:gap-x-4 items-center rounded-lg p-3 transition-colors",
                set.completed ? "bg-primary/5 border-l-4 border-primary" : "bg-background"
            )}
          >
            {/* Set Number */}
            <div className="col-span-1 text-center font-bold text-lg text-primary">{index + 1}</div>
            
            {/* Previous Performance */}
            <div className="col-span-6 sm:col-span-4">
              <label className="text-xs font-medium text-muted-foreground sm:hidden">Previous</label>
              <p className="font-mono text-sm sm:text-base text-foreground">{set.previous}</p>
            </div>

            {/* KG Input */}
            <div className="col-span-5 sm:col-span-3">
              <label className="text-xs font-medium text-muted-foreground sm:hidden">KG</label>
              <Input
                type="number"
                placeholder="0"
                value={set.performedKg ?? ""}
                onChange={(e) => onSetChange(index, { performedKg: parseFloat(e.target.value) || null })}
                className="w-full h-11 text-center font-semibold text-base"
              />
            </div>

            {/* Reps Input */}
            <div className="col-span-5 sm:col-span-2">
              {/* ✅ FIXED: Corrected the closing tag from </_label> to </label> */}
              <label className="text-xs font-medium text-muted-foreground sm:hidden">Reps</label>
              <Input
                type="number"
                placeholder="0"
                value={set.performedReps ?? ""}
                onChange={(e) => onSetChange(index, { performedReps: parseFloat(e.target.value) || null })}
                className="w-full h-11 text-center font-semibold text-base"
              />
            </div>

            {/* Checkbox */}
            <div className="col-span-2 flex items-end justify-center h-full">
              <Checkbox
                checked={set.completed}
                onCheckedChange={(checked) => onSetChange(index, { completed: !!checked })}
                className="h-7 w-7"
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
