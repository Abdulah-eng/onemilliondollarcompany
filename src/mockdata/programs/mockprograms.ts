import { format, addDays, parseISO, startOfWeek } from "date-fns";

// ==================================================================
// TYPES & INTERFACES (Now simplified)
// ==================================================================
export type ProgramTaskType = "fitness" | "nutrition" | "mental";

export interface ProgramTask {
  id: string;
  type: ProgramTaskType;
  title: string;
  // ✅ Content is now ALWAYS a simple string array for this file.
  content: string[];
  status: "pending" | "completed" | "missed" | "in-progress";
  progress: number;
}

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
// CONFIG (No changes needed)
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
// MOCK PROGRAM DATA (Simplified for the overview page)
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
          { dayOfWeek: "Monday", tasks: [{ id: "t1", type: "fitness", title: "Leg Day", content: ["Squats", "Leg Press"], status: "completed", progress: 100 }] },
          { dayOfWeek: "Wednesday", tasks: [{ id: "t3", type: "fitness", title: "Chest & Triceps", content: ["Bench Press", "Tricep Dips"], status: "missed", progress: 0 }] },
        ]
      },
      {
        weekNumber: 2,
        days: [
          { dayOfWeek: "Monday", tasks: [{ id: "t5", type: "fitness", title: "Leg Day Vol. 2", content: ["Leg Press", "Calf Raises"], status: "completed", progress: 100 }] },
        ]
      },
      {
        weekNumber: 3,
        days: [
          { dayOfWeek: "Monday", tasks: [{ id: "t8", type: "fitness", title: "Heavy Legs", content: ["Squats", "Deadlifts"], status: "completed", progress: 100 }] },
          {
            dayOfWeek: "Wednesday",
            tasks: [
              { id: "t9", type: "fitness", title: "Push Day", content: ["Incline Press", "Flyes", "Dips"], status: "in-progress", progress: 50 },
              { id: "t13", type: "nutrition", title: "Healthy Eating", content: ["Breakfast", "Lunch", "Dinner"], status: "pending", progress: 0 },
              { id: "t14", type: "mental", title: "Afternoon Reset", content: ["Meditation", "Journaling"], status: "pending", progress: 0 }
            ],
          },
          { dayOfWeek: "Friday", tasks: [{ id: "t10", type: "fitness", title: "Pull Day", content: ["T-Bar Rows", "Lat Pulldowns"], status: "pending", progress: 0 }] },
        ]
      },
      {
        weekNumber: 4,
        days: [
          { dayOfWeek: "Tuesday", tasks: [{ id: "t11", type: "fitness", title: "Final Chest Day", content: ["Dumbbell Press", "Crossovers"], status: "pending", progress: 0 }] },
        ]
      }
    ],
  },
];

// ==================================================================
// SCHEDULE GENERATOR (No changes needed)
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
