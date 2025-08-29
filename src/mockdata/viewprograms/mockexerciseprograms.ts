// src/mockdata/viewprograms/mockexerciseprograms.ts

// ==================================================================
// TYPES & INTERFACES for the detailed workout view
// ==================================================================
export interface ExerciseSet {
  id: number;
  reps: number | null;
  weight: number | null;
  isCompleted: boolean;
}

export interface FitnessExercise {
  id: string;
  name: string;
  targetSets: number;
  targetReps: string;
  videoUrl?: string;
  sets: ExerciseSet[];
}

export interface DetailedFitnessTask {
  id: string;
  title: string;
  duration: string;
  equipment: string[];
  content: FitnessExercise[];
}

// ==================================================================
// MOCK DATA for individual fitness tasks, keyed by their ID
// ==================================================================
export const mockExercisePrograms: Record<string, DetailedFitnessTask> = {
  't9': {
    id: "t9",
    title: "Push Day",
    duration: "Approx. 60 mins",
    equipment: ["Dumbbells", "Bench"],
    content: [
      { id: "ex1", name: "Incline Press", targetSets: 3, targetReps: "8-10", sets: [{ id: 1, reps: 8, weight: 20, isCompleted: true }, { id: 2, reps: null, weight: null, isCompleted: false }] },
      { id: "ex2", name: "Dumbbell Flyes", targetSets: 3, targetReps: "12-15", sets: [{ id: 1, reps: 12, weight: 10, isCompleted: true }, { id: 2, reps: null, weight: null, isCompleted: false }] },
      { id: "ex3", name: "Tricep Dips", targetSets: 4, targetReps: "10-12", sets: [{ id: 1, reps: null, weight: null, isCompleted: false }] },
    ]
  },
  't10': {
    id: "t10",
    title: "Pull Day",
    duration: "Approx. 55 mins",
    equipment: ["T-Bar", "Lat Machine"],
    content: [
      { id: "ex4", name: "T-Bar Rows", targetSets: 4, targetReps: "8", sets: [{ id: 1, reps: null, weight: null, isCompleted: false }] },
      { id: "ex5", name: "Lat Pulldowns", targetSets: 4, targetReps: "10", sets: [{ id: 1, reps: null, weight: null, isCompleted: false }] },
    ]
  },
  // You can add other fitness task IDs here as needed
  't1': {
    id: "t1",
    title: "Leg Day",
    duration: "Approx. 45 mins",
    equipment: ["Barbell", "Leg Press Machine"],
     content: [
      { id: "ex6", name: "Barbell Squats", targetSets: 4, targetReps: "10", sets: [{ id: 1, reps: null, weight: null, isCompleted: false }] },
      { id: "ex7", name: "Leg Press", targetSets: 3, targetReps: "12", sets: [{ id: 1, reps: null, weight: null, isCompleted: false }] },
    ]
  }
};

// ==================================================================
// HELPER FUNCTION to find a detailed program by ID
// ==================================================================
export const findExerciseProgramById = (id: string): DetailedFitnessTask | undefined => {
  return mockExercisePrograms[id];
};
