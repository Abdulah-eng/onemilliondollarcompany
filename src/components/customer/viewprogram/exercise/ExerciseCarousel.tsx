// src/components/customer/viewprogram/exercise/ExerciseCarousel.tsx

import { WorkoutExercise } from "@/mockdata/viewprograms/mockexerciseprograms";
import ItemCarousel, { CarouselItem } from '../shared/ItemCarousel';

interface ExerciseCarouselProps {
  exercises: WorkoutExercise[];
  selectedExerciseId: string;
  onSelectExercise: (id: string) => void;
}

export default function ExerciseCarousel({ exercises, selectedExerciseId, onSelectExercise }: ExerciseCarouselProps) {
  // Transform specific exercise data into the generic format
  const carouselItems: CarouselItem[] = exercises.map(exercise => ({
    id: exercise.id,
    imageUrl: exercise.imageUrl,
    label: exercise.name,
    isCompleted: exercise.sets.every(set => set.completed),
  }));

  return (
    <ItemCarousel 
      items={carouselItems}
      selectedItemId={selectedExerciseId}
      onSelectItem={onSelectExercise}
    />
  );
}
