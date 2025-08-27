import { format, addDays, parseISO, startOfWeek } from "date-fns";

export type ProgramTaskType = "fitness" | "nutrition" | "mental";

// ... (Interfaces remain the same)
export interface ProgramTask {
  id: string;
  type: ProgramTaskType;
  title: string;
  content: string[];
  status: "pending" | "completed" | "missed" | "in-progress";
  progress: number;
}
export interface ProgramDay {
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
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


// SHARED CONFIGURATION FOR STYLING
export const typeConfig = {
  fitness: { dot: "bg-emerald-500", missedDot: "bg-red-400" },
  nutrition: { dot: "bg-amber-500", missedDot: "bg-red-400" },
  mental: { dot: "bg-indigo-500", missedDot: "bg-red-400" },
};

// MOCK PROGRAMS - EXPANDED TO 4 WEEKS FOR REALISTIC TESTING
export const mockPrograms: Program[] = [
  {
    id: "prog1",
    title: "4-Week Summer Shred",
    description: "Intense 4-week program to shred fat & build muscle.",
    status: "active",
    // Starts on Monday, August 11, 2025, so today (Aug 27) is in Week 3
    startDate: "2025-08-11", 
    weeks: [
      { // Week 1: Aug 11 - Aug 17
        weekNumber: 1,
        days: [
          { dayOfWeek: "Monday", tasks: [{ id: "t1", type: "fitness", title: "Leg Day", content: ["Squats 4x10"], status: "completed", progress: 100 }] },
          { dayOfWeek: "Wednesday", tasks: [{ id: "t3", type: "fitness", title: "Chest & Triceps", content: ["Bench Press 3x8"], status: "missed", progress: 0 }] },
          { dayOfWeek: "Friday", tasks: [{ id: "t4", type: "fitness", title: "Back & Biceps", content: ["Pull-ups 3xAMRAP"], status: "completed", progress: 100 }] }
        ]
      },
      { // Week 2: Aug 18 - Aug 24
        weekNumber: 2,
        days: [
          { dayOfWeek: "Monday", tasks: [{ id: "t5", type: "fitness", title: "Leg Day Vol. 2", content: ["Leg Press 4x12"], status: "completed", progress: 100 }] },
          { dayOfWeek: "Tuesday", tasks: [{ id: "t6", type: "mental", title: "Mindfulness", content: ["10-min meditation"], status: "completed", progress: 100 }] },
          { dayOfWeek: "Thursday", tasks: [{ id: "t7", type: "fitness", title: "Shoulders", content: ["Shoulder Press 4x10"], status: "completed", progress: 100 }] }
        ]
      },
      { // Week 3: Aug 25 - Aug 31 (This is the current week)
        weekNumber: 3,
        days: [
          { dayOfWeek: "Monday", tasks: [{ id: "t8", type: "fitness", title: "Heavy Legs", content: ["Squats 5x5"], status: "completed", progress: 100 }] },
          // Today (Wednesday, Aug 27) has a pending task
          { dayOfWeek: "Wednesday", tasks: [{ id: "t9", type: "fitness", title: "Push Day", content: ["Incline Press 3x8"], status: "pending", progress: 0 }] },
          { dayOfWeek: "Friday", tasks: [{ id: "t10", type: "fitness", title: "Pull Day", content: ["T-Bar Rows 4x8"], status: "pending", progress: 0 }] }
        ]
      },
      { // Week 4: Sep 1 - Sep 7
        weekNumber: 4,
        days: [
          { dayOfWeek: "Tuesday", tasks: [{ id: "t11", type: "fitness", title: "Final Chest Day", content: ["Dumbbell Press 4x12"], status: "pending", progress: 0 }] },
          { dayOfWeek: "Thursday", tasks: [{ id: "t12", type: "mental", title: "Final Reflection", content: ["Journal about progress"], status: "pending", progress: 0 }] }
        ]
      }
    ]
  }
];

// GENERATE DAILY SCHEDULE (no changes needed here)
export const generateDailySchedule = (programs: Program[]): ScheduledTask[] => {
  // ... function remains the same
  const dailySchedule: ScheduledTask[] = [];
  const daysOfWeek = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
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
