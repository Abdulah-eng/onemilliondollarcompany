// src/mockdata/programs/mockprograms.ts
import { format, addDays, parseISO, startOfWeek } from "date-fns";

export type ProgramTaskType = "fitness" | "nutrition" | "mental";

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

// MOCK PROGRAMS
export const mockPrograms: Program[] = [
  {
    id: "prog1",
    title: "4-Week Shred",
    description: "Intense 4-week program to shred fat & build muscle.",
    status: "active",
    startDate: format(addDays(new Date(), -8), "yyyy-MM-dd"),
    weeks: [
      {
        weekNumber: 1,
        days: [
          {
            dayOfWeek: "Monday",
            tasks: [
              { id: "t1", type: "fitness", title: "Leg Day", content: ["Squats 4x10", "Lunges 3x12"], status: "completed", progress: 100 },
              { id: "t2", type: "nutrition", title: "High Protein Meals", content: ["Breakfast: Eggs", "Lunch: Chicken Salad", "Dinner: Salmon"], status: "completed", progress: 100 }
            ],
          },
          {
            dayOfWeek: "Wednesday",
            tasks: [
              { id: "t3", type: "fitness", title: "Chest & Triceps", content: ["Bench Press 3x8", "Tricep Dips 3x15"], status: "missed", progress: 0 }
            ],
          }
        ]
      }
    ]
  }
];

// GENERATE DAILY SCHEDULE
export const generateDailySchedule = (programs: Program[]): ScheduledTask[] => {
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
