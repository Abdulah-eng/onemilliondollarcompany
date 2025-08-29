// src/components/customer/viewprogram/exercise/ExerciseCard.tsx
import { useState } from "react";
import { FitnessExercise } from "@/mockdata/viewprograms/mockexerciseprograms";
// ✅ Corrected import path
import { ExerciseSetLogger } from "./ExerciseSetLogger";

interface ExerciseCardProps {
  exercise: FitnessExercise;
  exerciseNumber: number;
}

export function ExerciseCard({ exercise, exerciseNumber }: ExerciseCardProps) {
  const [exerciseData, setExerciseData] = useState(exercise);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200/80">
      <div className="p-4 bg-slate-50/70 border-b border-slate-200/80">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-200">
            <span className="text-slate-600 font-bold">{exerciseNumber}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{exerciseData.name}</h3>
            <p className="text-sm text-slate-500">
              Target: {exerciseData.targetSets} sets of {exerciseData.targetReps} reps
            </p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <ExerciseSetLogger
          exerciseData={exerciseData}
          setExerciseData={setExerciseData}
        />
      </div>
    </div>
  );
}
