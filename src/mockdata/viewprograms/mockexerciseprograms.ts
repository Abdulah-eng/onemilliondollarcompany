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
    id: "t5", // Matches "Leg Day Vol. 2"
    title: "Leg Day Vol. 2",
    duration: "50 min",
    equipment: ["Machine"],
    coachNotes: "Isolate the muscles and focus on the mind-muscle connection.",
    exercises: [
      {
        id: "ex_lp_t5", libraryExerciseId: "lib-lp", name: "Leg Press", imageUrl: "/images/leg-press-thumb.png", restTimeSeconds: 120, lastTimeKg: 155,
        sets: [
            { reps: 10, kg: 160, rir: 2, completed: true },
            { reps: 10, kg: 160, rir: 2, completed: true },
            { reps: 10, kg: 160, rir: 1, completed: true },
        ]
      },
      {
        id: "ex_cr_t5", libraryExerciseId: "lib-cr", name: "Calf Raises", imageUrl: "/images/calf-raises-thumb.png", restTimeSeconds: 60, lastTimeKg: 50,
        sets: [
            { reps: 20, kg: 50, rir: 1, completed: true },
            { reps: 20, kg: 50, rir: 1, completed: true },
        ]
      },
    ],
  },
  {
    id: "t8", // Matches "Heavy Legs"
    title: "Heavy Legs",
    duration: "70 min",
    equipment: ["Barbell"],
    coachNotes: "Power day! Keep your core braced and your form strict, especially on the deadlifts.",
    exercises: [
      {
        id: "ex_sq_t8", libraryExerciseId: "lib-sq", name: "Squats", imageUrl: "/images/squat-thumb.png", restTimeSeconds: 180, lastTimeKg: 85,
        sets: [
            { reps: 5, kg: 90, rir: 2, completed: true },
            { reps: 5, kg: 90, rir: 2, completed: true },
            { reps: 5, kg: 90, rir: 1, completed: true },
        ]
      },
      {
        id: "ex_dl_t8", libraryExerciseId: "lib-dl", name: "Deadlifts", imageUrl: "/images/deadlift-thumb.png", restTimeSeconds: 180, lastTimeKg: 100,
        sets: [
            { reps: 5, kg: 105, rir: 2, completed: true },
            { reps: 5, kg: 105, rir: 1, completed: true },
        ]
      },
    ],
  },
  {
    id: "t9", // Matches "Push Day"
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
            id: "ex_fly_t9", libraryExerciseId: "lib-fly", name: "Flyes", imageUrl: "/images/flyes-thumb.png", restTimeSeconds: 90, lastTimeKg: 12,
            sets: [ { reps: 15, kg: 12, rir: 1, completed: false } ]
        },
        {
            id: "ex_dips_t9", libraryExerciseId: "lib-td", name: "Dips", imageUrl: "/images/dips-thumb.png", restTimeSeconds: 90, lastTimeKg: 0,
            sets: [ { reps: 12, kg: 0, rir: 2, completed: false } ]
        }
    ]
  },
  {
    id: "t10", // Matches "Pull Day"
    title: "Pull Day",
    duration: "60 min",
    equipment: ["Machine"],
    coachNotes: "Focus on squeezing your back muscles. Imagine pulling with your elbows, not your hands.",
    exercises: [
      {
        id: "ex_tbar_t10", libraryExerciseId: "lib-tbar", name: "T-Bar Rows", imageUrl: "/images/t-bar-row-thumb.png", restTimeSeconds: 120, lastTimeKg: 50,
        sets: [
            { reps: 10, kg: 55, rir: 2, completed: false },
            { reps: 10, kg: 55, rir: 1, completed: false },
        ]
      },
      {
        id: "ex_lat_t10", libraryExerciseId: "lib-lat", name: "Lat Pulldowns", imageUrl: "/images/lat-pulldown-thumb.png", restTimeSeconds: 90, lastTimeKg: 60,
        sets: [
            { reps: 12, kg: 60, rir: 2, completed: false },
            { reps: 12, kg: 60, rir: 1, completed: false },
        ]
      },
    ],
  },
  {
    id: "t11", // Matches "Final Chest Day"
    title: "Final Chest Day",
    duration: "65 min",
    equipment: ["Dumbbell", "Cable"],
    coachNotes: "Let's finish the week strong! Get a good stretch on the crossovers.",
    exercises: [
      {
        id: "ex_dp_t11", libraryExerciseId: "lib-dp", name: "Dumbbell Press", imageUrl: "/images/dumbbell-press-thumb.png", restTimeSeconds: 120, lastTimeKg: 30,
        sets: [
            { reps: 10, kg: 32.5, rir: 2, completed: false },
            { reps: 10, kg: 32.5, rir: 2, completed: false },
            { reps: 9, kg: 32.5, rir: 1, completed: false },
        ]
      },
      {
        id: "ex_co_t11", libraryExerciseId: "lib-co", name: "Crossovers", imageUrl: "/images/crossovers-thumb.png", restTimeSeconds: 90, lastTimeKg: 15,
        sets: [
            { reps: 15, kg: 15, rir: 1, completed: false },
            { reps: 15, kg: 15, rir: 0, completed: false },
        ]
      },
    ],
  },
];

export const findExerciseProgramById = (id: string): DetailedFitnessTask | undefined => {
  return mockDetailedPrograms.find((p) => p.id === id);
};
