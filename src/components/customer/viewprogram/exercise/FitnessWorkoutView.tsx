// src/components/customer/viewprogram/exercise/FitnessWorkoutView.tsx
import { DetailedFitnessTask, FitnessExercise } from "@/mockdata/viewprograms/mockexerciseprograms";
// ✅ Corrected import path
import { ExerciseCard } from "./ExerciseCard";
import { Button } from "@/components/ui/button";

interface FitnessWorkoutViewProps {
  task: DetailedFitnessTask;
}

export default function FitnessWorkoutView({ task }: FitnessWorkoutViewProps) {
  const exercises = task.content as FitnessExercise[];

  return (
    <div className="space-y-4 pb-24">
      {exercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          exerciseNumber={index + 1}
        />
      ))}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 py-3 bg-white/80 backdrop-blur-sm border-t z-10">
        <Button size="lg" className="w-full h-12 font-bold rounded-xl shadow-lg">
          Complete Workout
        </Button>
      </div>
    </div>
  );
}
