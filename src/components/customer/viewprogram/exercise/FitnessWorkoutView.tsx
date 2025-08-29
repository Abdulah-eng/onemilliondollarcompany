// src/components/customer/viewprogram/exercise/FitnessWorkoutView.tsx
import { DetailedFitnessTask, FitnessExercise } from "@/mockdata/viewprograms/mockexerciseprograms";
import { ExerciseCard } from "./ExerciseCard";

interface FitnessWorkoutViewProps {
  task: DetailedFitnessTask;
}

export default function FitnessWorkoutView({ task }: FitnessWorkoutViewProps) {
  const exercises = task.content as FitnessExercise[];

  return (
    <div className="space-y-4">
      {exercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          exerciseNumber={index + 1}
        />
      ))}
    </div>
  );
}
