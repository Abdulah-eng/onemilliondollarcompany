// src/components/customer/viewprogram/exercise/FitnessWorkoutView.tsx
import { DetailedFitnessTask, FitnessExercise } from "@/mockdata/viewprograms/mockexerciseprograms";
import { ExerciseCard } from "./ExerciseCard";
import { Button } from "@/components/ui/button";

interface FitnessWorkoutViewProps {
  task: DetailedFitnessTask;
}

export default function FitnessWorkoutView({ task }: FitnessWorkoutViewProps) {
  const exercises = task.content as FitnessExercise[];

  return (
    <div className="space-y-4 pb-32"> {/* give extra padding for fixed button */}
      {exercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          exerciseNumber={index + 1}
        />
      ))}

      {/* ✅ Bottom button aligned to content */}
      <div className="fixed bottom-0 w-full">
        <div className="mx-auto max-w-5xl px-4">
          <Button
            size="lg"
            className="h-12 w-full rounded-xl font-bold shadow-lg"
          >
            Complete Workout
          </Button>
        </div>
      </div>
    </div>
  );
}
