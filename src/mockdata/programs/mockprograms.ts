import { format, addDays, parseISO, startOfWeek } from "date-fns";

// --- TYPES --- (you can copy from TaskCard.tsx)
export interface ProgramTask {
  id: string;
  type: "fitness" | "nutrition" | "mental";
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

// --- MOCK DATA ---
export const mockPrograms: Program[] = [
  {
    id: "prog1",
    title: "4-Week Shred",
    description: "An intense 4-week program to build muscle and reduce fat.",
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
            ],
          },
        ],
      },
    ],
  },
  // Add other mock programs if needed
];

// --- UTILITY FUNCTION ---
export const generateDailySchedule = (programs: Program[]): ScheduledTask[] => {
  const dailySchedule: ScheduledTask[] = [];
  programs.filter(p => p.status === "active" || p.status === "scheduled").forEach(program => {
    if (!program.startDate) return;
    const programStartDate = parseISO(program.startDate);
    program.weeks.forEach(week => {
      const weekStartDate = addDays(programStartDate, (week.weekNumber - 1) * 7);
      const firstDayOfWeek = startOfWeek(weekStartDate, { weekStartsOn: 1 });
      week.days.forEach(day => {
        const dayIndex = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].indexOf(day.dayOfWeek);
        const taskDate = addDays(firstDayOfWeek, dayIndex);
        day.tasks.forEach(task => {
          dailySchedule.push({ ...task, date: taskDate, programId: program.id, programTitle: program.title, weekNumber: week.weekNumber });
        });
      });
    });
  });
  return dailySchedule;
};
