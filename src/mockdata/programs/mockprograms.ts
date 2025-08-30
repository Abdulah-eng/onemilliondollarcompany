import { format, addDays, parseISO, startOfWeek } from "date-fns";

// ==================================================================
// TYPES & INTERFACES
// ==================================================================
export type ProgramTaskType = "fitness" | "nutrition" | "mental";

export interface ProgramTask {
  id: string;
  /**
   * Optional ID to link to a detailed program view, 
   * e.g., for navigation to `/programs/fitness/t9`.
   */
  detailedProgramId?: string;
  type: ProgramTaskType;
  title: string;
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
// CONFIG (No changes)
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
// MOCK PROGRAM DATA (Updated for realism)
// ==================================================================
export const mockPrograms: Program[] = [
  {
    id: "prog1",
    title: "4-Week Wellness Plan",
    description: "A holistic 4-week plan for body and mind.",
    status: "active",
    // Start date is in the past to simulate an ongoing program
    startDate: "2025-08-11", 
    weeks: [
      {
        weekNumber: 1, // August 11 - August 17
        days: [
          { dayOfWeek: "Monday", tasks: [{ id: "t1", type: "fitness", title: "Leg Day", content: ["Squats", "Leg Press"], status: "completed", progress: 100 }] },
          { dayOfWeek: "Wednesday", tasks: [{ id: "t3", type: "fitness", title: "Chest & Triceps", content: ["Bench Press", "Tricep Dips"], status: "missed", progress: 0 }] },
        ]
      },
      {
        weekNumber: 2, // August 18 - August 24
        days: [
          { dayOfWeek: "Monday", tasks: [{ id: "t5", type: "fitness", title: "Leg Day Vol. 2", content: ["Leg Press", "Calf Raises"], status: "completed", progress: 100 }] },
        ]
      },
      {
        weekNumber: 3, // August 25 - August 31
        days: [
          { dayOfWeek: "Monday", tasks: [{ id: "t8", type: "fitness", title: "Heavy Legs", content: ["Squats", "Deadlifts"], status: "completed", progress: 100 }] },
          {
            dayOfWeek: "Wednesday",
            tasks: [
              // ✅ UPDATED: Status changed from "in-progress" to "completed" for this past task.
              // ✅ ADDED: `detailedProgramId` to link to the specific workout page.
              { id: "t9", detailedProgramId: "t9", type: "fitness", title: "Push Day", content: ["Incline Press", "Flyes", "Dips"], status: "completed", progress: 100 },
              // ✅ UPDATED: Status changed from "pending" to "completed".
              // ✅ ADDED: `detailedProgramId` for navigation.
              { id: "t13", detailedProgramId: "n-1", type: "nutrition", title: "Lean Gain Meal Plan", content: ["Breakfast", "Lunch", "Dinner"], status: "completed", progress: 100 },
              // ✅ UPDATED: Status changed from "pending" to "missed" for this past task.
              { id: "t14", detailedProgramId: "t14", type: "mental", title: "Afternoon Reset", content: ["Meditation", "Journaling"], status: "missed", progress: 0 }
            ],
          },
          // ✅ UPDATED: Status changed from "pending" to "missed" as this task was for yesterday.
          { dayOfWeek: "Friday", tasks: [{ id: "t10", type: "fitness", title: "Pull Day", content: ["T-Bar Rows", "Lat Pulldowns"], status: "missed", progress: 0 }] },
        ]
      },
      {
        weekNumber: 4, // September 1 - September 7
        days: [
          // This task is in the future, so "pending" is the correct status.
          { dayOfWeek: "Tuesday", tasks: [{ id: "t11", type: "fitness", title: "Final Chest Day", content: ["Dumbbell Press", "Crossovers"], status: "pending", progress: 0 }] },
        ]
      }
    ],
  },
];

// ==================================================================
// SCHEDULE GENERATOR (No changes needed, it works perfectly)
// ==================================================================
export const generateDailySchedule = (programs: Program[]): ScheduledTask[] => {
  const dailySchedule: ScheduledTask[] = [];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  programs
    .filter(p => p.status === "active" || p.status === "scheduled")
    .forEach(program => {
      if (!program.startDate) return;

      const programStartDate = parseISO(program.startDate);

      program.weeks.forEach(week => {
        // Calculate the start date of the current week in the program
        const weekStartOffset = (week.weekNumber - 1) * 7;
        const weekContextDate = addDays(programStartDate, weekStartOffset);
        const firstDayOfCalendarWeek = startOfWeek(weekContextDate, { weekStartsOn: 1 }); // Starts on Monday

        week.days.forEach(day => {
          const dayIndex = daysOfWeek.indexOf(day.dayOfWeek);
          const taskDate = addDays(firstDayOfCalendarWeek, dayIndex);
        
          day.tasks.forEach(task => {
            dailySchedule.push({ 
              ...task, 
              date: taskDate, 
              programId: program.id, 
              programTitle: program.title, 
              weekNumber: week.weekNumber 
            });
          });
        });
      });
    });

  return dailySchedule;
};
