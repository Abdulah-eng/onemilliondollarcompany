// src/components/customer/viewprogram/ExerciseCard.tsx

import { useState } from "react";
import { FitnessExercise } from "@/mockdata/programs/mockprograms";
import { ExerciseSetLogger } from "./ExerciseSetLogger";
import { Dumbbell } from "lucide-react";

interface ExerciseCardProps {
  exercise: FitnessExercise;
  exerciseNumber: number;
}

export function ExerciseCard({ exercise, exerciseNumber }: ExerciseCardProps) {
  const [exerciseData, setExerciseData] = useState(exercise);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border">
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
            <span className="text-gray-500 font-bold">{exerciseNumber}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{exerciseData.name}</h3>
            <p className="text-sm text-gray-500">
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
