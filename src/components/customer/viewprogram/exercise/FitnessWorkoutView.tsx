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
    <div className="space-y-4 pb-24">
      {exercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          exerciseNumber={index + 1}
        />
      ))}

      {/* ✅ CORRECTED BUTTON CONTAINER */}
      {/* The outer div is now only for positioning. */}
      {/* The inner div holds the background, border, and max-width. */}
      <div className="fixed bottom-0 left-0 right-0 z-10 lg:left-16">
        <div className="mx-auto max-w-5xl border-t bg-white/80 px-4 py-3 backdrop-blur-sm">
          <Button size="lg" className="h-12 w-full rounded-xl font-bold shadow-lg">
            Complete Workout
          </Button>
        </div>
      </div>
    </div>
  );
}
