// src/components/customer/viewprogram/exercise/ExerciseDetails.tsx

import { WorkoutExercise, ExerciseSet } from "@/mockdata/viewprograms/mockexerciseprograms";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Timer } from "lucide-react";

interface ExerciseDetailsProps {
  exercise: WorkoutExercise;
  onSetChange: (setIndex: number, updatedSet: Partial<ExerciseSet>) => void;
}

export default function ExerciseDetails({ exercise, onSetChange }: ExerciseDetailsProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 rounded-2xl bg-card border p-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">{exercise.name}</h2>
          <p className="text-sm text-muted-foreground">Last time: {exercise.lastTimeKg ?? "N/A"} kg</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-secondary-foreground">
          <Timer className="h-4 w-4" />
          <span className="font-mono text-sm font-semibold">{formatTime(exercise.restTimeSeconds)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-2 px-2 text-xs font-bold uppercase text-muted-foreground">
        <div className="col-span-2 text-center">Set</div>
        <div className="col-span-4">KG</div>
        <div className="col-span-3 text-center">Reps</div>
        <div className="col-span-3 text-center">Done</div>
      </div>
      
      <div className="space-y-2">
        {exercise.sets.map((set, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center rounded-lg bg-background p-2">
            <div className="col-span-2 text-center font-bold text-lg">{index + 1}</div>
            <div className="col-span-4">
              <Input
                type="number"
                placeholder={String(set.kg ?? "")}
                defaultValue={set.kg ?? ""}
                onChange={(e) => onSetChange(index, { kg: parseFloat(e.target.value) || null })}
                className="w-full h-11 text-center font-semibold text-base"
              />
            </div>
            <div className="col-span-3 text-center font-semibold text-base">{set.reps}</div>
            <div className="col-span-3 flex justify-center">
              <Checkbox
                checked={set.completed}
                onCheckedChange={(checked) => onSetChange(index, { completed: !!checked })}
                className="h-7 w-7"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
