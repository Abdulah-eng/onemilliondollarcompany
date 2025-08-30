// src/mockdata/viewprograms/mockexerciseprograms.ts

export interface ExerciseSet {
  reps: number | null;
  kg: number | null;
  rir?: number | null;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  libraryExerciseId: string;
  name: string;
  imageUrl: string;
  restTimeSeconds: number;
  lastTimeKg: number | null;
  sets: ExerciseSet[];
}

export interface DetailedFitnessTask {
  id: string; // This ID will now match the IDs from mockprograms.ts (e.g., 't1', 't3')
  title: string;
  coachNotes: string;
  exercises: WorkoutExercise[];
  duration?: string;
  equipment?: string[];
}

// ✅ FIXED: This array now contains detailed data for the tasks in your schedule.
const mockDetailedPrograms: DetailedFitnessTask[] = [
  {
    id: "t1", // Matches "Leg Day" from mockprograms.ts
    title: "Leg Day",
    duration: "60 min",
    equipment: ["Barbell", "Machine"],
    coachNotes: "Focus on deep squats and controlled movements on the leg press.",
    exercises: [
      {
        id: "ex_sq_t1", libraryExerciseId: "lib-sq", name: "Squats", imageUrl: "/images/squat-thumb.png", restTimeSeconds: 180, lastTimeKg: 80,
        sets: [
          { reps: 8, kg: 82.5, rir: 2, completed: true },
          { reps: 8, kg: 82.5, rir: 2, completed: true },
          { reps: 8, kg: 82.5, rir: 1, completed: true },
        ],
      },
      {
        id: "ex_lp_t1", libraryExerciseId: "lib-lp", name: "Leg Press", imageUrl: "/images/leg-press-thumb.png", restTimeSeconds: 120, lastTimeKg: 150,
        sets: [
          { reps: 12, kg: 155, rir: 2, completed: true },
          { reps: 12, kg: 155, rir: 1, completed: true },
        ],
      },
    ],
  },
  {
    id: "t3", // Matches "Chest & Triceps" from mockprograms.ts
    title: "Chest & Triceps",
    duration: "45 min",
    equipment: ["Barbell", "Bodyweight"],
    coachNotes: "Make sure to keep your elbows tucked during the bench press for shoulder safety.",
    exercises: [
        {
            id: "ex_bp_t3", libraryExerciseId: "lib-bp", name: "Bench Press", imageUrl: "/images/bench-press-thumb.png", restTimeSeconds: 120, lastTimeKg: 70,
            sets: [
                { reps: 10, kg: 70, rir: 2, completed: false },
                { reps: 10, kg: 70, rir: 2, completed: false },
                { reps: 9, kg: 70, rir: 1, completed: false },
            ]
        },
        {
            id: "ex_td_t3", libraryExerciseId: "lib-td", name: "Tricep Dips", imageUrl: "/images/tricep-dips-thumb.png", restTimeSeconds: 90, lastTimeKg: null,
            sets: [
                { reps: 15, kg: null, rir: 1, completed: false },
                { reps: 15, kg: null, rir: 1, completed: false },
            ]
        }
    ]
  },
  {
    id: "t9", // Matches "Push Day" from mockprograms.ts
    title: "Push Day",
    duration: "75 min",
    equipment: ["Dumbbell", "Bodyweight"],
    coachNotes: "Great session today! Focus on chest contraction and full extension on the dips.",
    exercises: [
        {
            id: "ex_ip_t9", libraryExerciseId: "lib-ip", name: "Incline Press", imageUrl: "/images/incline-press-thumb.png", restTimeSeconds: 120, lastTimeKg: 40,
            sets: [
                { reps: 10, kg: 42.5, rir: 2, completed: true },
                { reps: 9, kg: 42.5, rir: 1, completed: true },
                { reps: 8, kg: 42.5, rir: 1, completed: false },
            ]
        },
        {
            id: "ex_fly_t9", libraryExerciseId: "lib-lp", name: "Flyes", imageUrl: "/images/flyes-thumb.png", restTimeSeconds: 90, lastTimeKg: 12,
            sets: [ { reps: 15, kg: 12, rir: 1, completed: false } ]
        },
        {
            id: "ex_dips_t9", libraryExerciseId: "lib-td", name: "Dips", imageUrl: "/images/dips-thumb.png", restTimeSeconds: 90, lastTimeKg: 0,
            sets: [ { reps: 12, kg: 0, rir: 2, completed: false } ]
        }
    ]
  },
  // Add entries for t5, t8, t10, and t11 to make them all clickable
];

export const findExerciseProgramById = (id: string): DetailedFitnessTask | undefined => {
  // ✅ FIXED: Now searches the correct array with matching IDs.
  return mockDetailedPrograms.find((p) => p.id === id);
};
