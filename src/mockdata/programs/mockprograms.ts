import { format, addDays, parseISO, startOfWeek } from "date-fns";

// ==================================================================
// 1. ADD NEW TYPES FOR DETAILED FITNESS EXERCISES
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

// ==================================================================
// 2. UPDATE THE ProgramTask INTERFACE
//    The `content` property is now a union type.
// ==================================================================
export type ProgramTaskType = "fitness" | "nutrition" | "mental";

export interface ProgramTask {
  id: string;
  type: ProgramTaskType;
  title: string;
  // ✅ This is the key change: content can be a simple string array
  // OR our new detailed fitness exercise array.
  content: string[] | FitnessExercise[];
  status: "pending" | "completed" | "missed" | "in-progress";
  progress: number;
}

// ==================================================================
// NO CHANGES NEEDED FOR THE REST OF THE INTERFACES
// ==================================================================
export interface ProgramDay {
  dayOfWeek:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  tasks: ProgramTask[];
}

export interface ProgramWeek {
  weekNumber: number;
  days: ProgramDay[];
}

export interface Program {
  id: string;
  title: string;
  description: string;
  status: "active" | "scheduled" | "purchased";
  startDate?: string;
  weeks: ProgramWeek[];
}

export interface ScheduledTask extends ProgramTask {
  date: Date;
  programId: string;
  programTitle: string;
  weekNumber: number;
}

// ==================================================================
// NO CHANGES NEEDED FOR THE CONFIG
// ==================================================================
export const typeConfig = {
  fitness: {
    dot: "bg-emerald-500",
    missedDot: "bg-red-400",
    emoji: "🏋️‍♂️",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200",
  },
  nutrition: {
    dot: "bg-amber-500",
    missedDot: "bg-red-400",
    emoji: "🥗",
    imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800",
  },
  mental: {
    dot: "bg-indigo-500",
    missedDot: "bg-red-400",
    emoji: "🧠",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800",
  },
};

// ==================================================================
// 3. UPDATE THE MOCK DATA FOR A SINGLE FITNESS TASK
// ==================================================================
export const mockPrograms: Program[] = [
  {
    id: "prog1",
    title: "4-Week Wellness Plan",
    description: "A holistic 4-week plan for body and mind.",
    status: "active",
    startDate: "2025-08-11",
    weeks: [
      {
        weekNumber: 1,
        days: [
          { dayOfWeek: "Monday", tasks: [{ id: "t1", type: "fitness", title: "Leg Day", content: ["Squats 4x10", "Leg Press 3x12"], status: "completed", progress: 100 }] },
          { dayOfWeek: "Wednesday", tasks: [{ id: "t3", type: "fitness", title: "Chest & Triceps", content: ["Bench Press 3x8", "Tricep Dips 4x10"], status: "missed", progress: 0 }] },
        ]
      },
      {
        weekNumber: 2,
        days: [
          { dayOfWeek: "Monday", tasks: [{ id: "t5", type: "fitness", title: "Leg Day Vol. 2", content: ["Leg Press 4x12", "Calf Raises 5x15"], status: "completed", progress: 100 }] },
        ]
      },
      {
        weekNumber: 3,
        days: [
          { dayOfWeek: "Monday", tasks: [{ id: "t8", type: "fitness", title: "Heavy Legs", content: ["Squats 5x5", "Romanian Deadlifts 3x8"], status: "completed", progress: 100 }] },
          {
            dayOfWeek: "Wednesday",
            tasks: [
              // ✅ THIS TASK IS NOW UPDATED to the new detailed format.
              {
                id: "t9",
                type: "fitness",
                title: "Push Day",
                status: "in-progress",
                progress: 50,
                content: [
                  {
                    id: "ex1",
                    name: "Incline Press",
                    targetSets: 3,
                    targetReps: "8-10",
                    sets: [{ id: 1, reps: null, weight: null, isCompleted: false }],
                  },
                  {
                    id: "ex2",
                    name: "Dumbbell Flyes",
                    targetSets: 3,
                    targetReps: "12-15",
                    sets: [{ id: 1, reps: null, weight: null, isCompleted: false }],
                  },
                ] as FitnessExercise[], // Use type assertion here
              },
              // ✅ ALL OTHER TASKS REMAIN UNCHANGED.
              { id: "t13", type: "nutrition", title: "Healthy Eating", content: ["Breakfast: Oatmeal & Berries", "Lunch: Quinoa Salad", "Dinner: Baked Salmon"], status: "pending", progress: 0 },
              { id: "t14", type: "mental", title: "Afternoon Reset", content: ["10-minute mindfulness meditation", "Evening gratitude journal"], status: "pending", progress: 0 }
            ],
          },
          { dayOfWeek: "Friday", tasks: [
            {
              id: "t10",
              type: "fitness",
              title: "Pull Day",
              status: "pending",
              progress: 0,
              content: [
                {
                  id: "ex3",
                  name: "T-Bar Rows",
                  targetSets: 4,
                  targetReps: "8",
                  sets: [{ id: 1, reps: null, weight: null, isCompleted: false }],
                },
                {
                  id: "ex4", 
                  name: "Lat Pulldowns",
                  targetSets: 4,
                  targetReps: "10",
                  sets: [{ id: 1, reps: null, weight: null, isCompleted: false }],
                },
              ] as FitnessExercise[],
            }
          ] },
        ]
      },
      {
        weekNumber: 4,
        days: [
          { dayOfWeek: "Tuesday", tasks: [{ id: "t11", type: "fitness", title: "Final Chest Day", content: ["Dumbbell Press 4x12", "Cable Crossovers 3x15"], status: "pending", progress: 0 }] },
        ]
      }
    ],
  },
];

// ==================================================================
// NO CHANGES NEEDED FOR THE SCHEDULE GENERATOR
// ==================================================================
export const generateDailySchedule = (programs: Program[]): ScheduledTask[] => {
  const dailySchedule: ScheduledTask[] = [];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  programs.filter(p => p.status === "active" || p.status === "scheduled").forEach(program => {
    if (!program.startDate) return;
    const programStartDate = parseISO(program.startDate);
    program.weeks.forEach(week => {
      const weekStart = addDays(programStartDate, (week.weekNumber - 1) * 7);
      const firstDayOfWeek = startOfWeek(weekStart, { weekStartsOn: 1 });
      week.days.forEach(day => {
        const dayIndex = daysOfWeek.indexOf(day.dayOfWeek);
        const taskDate = addDays(firstDayOfWeek, dayIndex);
        day.tasks.forEach(task => {
          dailySchedule.push({ ...task, date: taskDate, programId: program.id, programTitle: program.title, weekNumber: week.weekNumber });
        });
      });
    });
  });
  return dailySchedule;
};
