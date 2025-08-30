// src/components/customer/viewprogram/exercise/ExerciseDetails.tsx

import { useMemo } from "react";
import { WorkoutExercise, ExerciseSet } from "@/mockdata/viewprograms/mockexerciseprograms";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
// ✅ Import Trash2 icon
import { Timer, PlusCircle, TrendingUp, TrendingDown, Minus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseDetailsProps {
  exercise: WorkoutExercise;
  onSetChange: (setIndex: number, updatedSet: Partial<ExerciseSet>) => void;
  onAddSet: () => void;
  // ✅ Add the new prop to the interface
  onRemoveSet: (setIndex: number) => void;
}

const PerformanceInsight = ({ sets }: { sets: ExerciseSet[] }) => {
  const completedSets = sets.filter(set => set.completed).length;
  const totalSets = sets.length;
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  if (completedSets === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span>{completedSets}/{totalSets} sets completed</span>
        {progress === 100 && <span className="text-green-600 font-semibold">✓ Complete</span>}
      </div>
    </div>
  );
};


// ✅ Update the function signature to accept onRemoveSet
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
      
      {/* --- Table Header --- */}
      <div className="hidden sm:grid grid-cols-12 gap-4 px-2 text-xs font-bold uppercase text-muted-foreground">
        <div className="col-span-1 text-center">Set</div>
        <div className="col-span-4">KG</div>
        <div className="col-span-4">Reps</div>
        <div className="col-span-3 text-center">Done</div>
      </div>
      
      {/* --- Sets List --- */}
      <div className="space-y-3">
        {exercise.sets.map((set, index) => (
          <div 
            key={index} 
            className="grid grid-cols-12 gap-x-2 sm:gap-x-4 items-center rounded-lg p-2 pr-1 sm:p-3 sm:pr-2 transition-colors group bg-background"
          >
            {/* Set Number */}
            <div className="col-span-1 text-center font-bold text-lg text-primary">{index + 1}</div>
            
            {/* KG Input */}
            <div className="col-span-4">
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

            {/* ✅ Checkbox & Remove Button Container */}
            <div className="col-span-3 flex items-center justify-center h-full gap-1 sm:gap-2">
              <Checkbox
                checked={set.completed}
                onCheckedChange={(checked) => onSetChange(index, { completed: !!checked })}
                className="h-8 w-8"
              />
              {/* ✅ Show remove button only if there's more than 1 set */}
              {exercise.sets.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:bg-red-500/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveSet(index)}
                >
                  <Trash2 className="h-4 w-4" />
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
            className="w-full h-11"
          >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Set
          </Button>
      </div>
    </div>
  );
}
