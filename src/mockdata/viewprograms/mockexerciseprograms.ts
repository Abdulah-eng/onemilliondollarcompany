// src/mockdata/viewprograms/mockexerciseprograms.ts

// A single set within an exercise
export interface ExerciseSet {
  reps: number | null;
  kg: number | null;
  rir?: number | null; // RIR (Reps in Reserve) is optional
  completed: boolean;
}

// A single exercise within a workout
export interface WorkoutExercise {
  id: string; // Unique ID for this exercise in this specific workout
  libraryExerciseId: string; // ID to link to the exercise guide library
  name: string;
  imageUrl: string; // Thumbnail for the carousel
  restTimeSeconds: number;
  lastTimeKg: number | null;
  sets: ExerciseSet[];
}

// The main workout structure
export interface DetailedFitnessTask {
  id: string;
  title: string;
  coachNotes: string;
  // Change 'content' to a strongly-typed 'exercises' array
  exercises: WorkoutExercise[];
  duration?: string;
  equipment?: string[];
}

const mockPrograms: DetailedFitnessTask[] = [
  {
    id: "program1",
    title: "Full Body Strength - Day A",
    duration: "60-75 min",
    equipment: ["Barbell", "Machine"],
    coachNotes: "Focus on form and control today. Don't rush the movements. Let's build a solid foundation!",
    exercises: [
      {
        id: "ex1",
        libraryExerciseId: "lib-sr",
        name: "Rudern enger neutraler Griff",
        imageUrl: "/images/seated-row-thumb.png", // Replace with a real path
        restTimeSeconds: 150,
        lastTimeKg: 60,
        sets: [
          { reps: 10, kg: 62.5, rir: 2, completed: false },
          { reps: 10, kg: 62.5, rir: 2, completed: false },
          { reps: 11, kg: 62.5, rir: 2, completed: false },
          { reps: 11, kg: 62.5, rir: 1, completed: false },
        ],
      },
      {
        id: "ex2",
        libraryExerciseId: "lib-bc",
        name: "Barbell Curl",
        imageUrl: "/images/barbell-curl-thumb.png", // Replace with a real path
        restTimeSeconds: 90,
        lastTimeKg: 25,
        sets: [
          { reps: 12, kg: 27.5, rir: 3, completed: false },
          { reps: 12, kg: 27.5, rir: 3, completed: false },
          { reps: 12, kg: 27.5, rir: 2, completed: false },
        ],
      },
      {
        id: "ex3",
        libraryExerciseId: "lib-sq",
        name: "Barbell Squat",
        imageUrl: "/images/squat-thumb.png", // Replace with a real path
        restTimeSeconds: 180,
        lastTimeKg: 100,
        sets: [
          { reps: 8, kg: 102.5, rir: 2, completed: false },
          { reps: 8, kg: 102.5, rir: 2, completed: false },
          { reps: 8, kg: 102.5, rir: 1, completed: false },
        ],
      },
    ],
  },
];

export const findExerciseProgramById = (id: string): DetailedFitnessTask | undefined => {
  return mockPrograms.find((p) => p.id === id);
};
