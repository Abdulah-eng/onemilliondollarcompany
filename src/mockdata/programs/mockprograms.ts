import { format, addDays, parseISO, startOfWeek } from "date-fns";

// ==================================================================
// TYPES & INTERFACES
// ==================================================================
export type ProgramTaskType = "fitness" | "nutrition" | "mental";

// ✅ This is the new, richer structure for items inside a task's content
export interface ContentItem {
  name: string;
  imageUrl: string;
  details: string; // e.g., "3 sets, 8-10 reps", "Breakfast", "Morning"
}

export interface ProgramTask {
  id: string;
  detailedProgramId?: string;
  type: ProgramTaskType;
  title: string;
  // ✅ The content property now uses the new, richer ContentItem interface
  content: ContentItem[];
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

// ==================================================================
// CONFIG (No changes)
// ==================================================================
export const typeConfig = {
  fitness: {
    emoji: "🏋️‍♂️",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200",
  },
  nutrition: {
    emoji: "🥗",
    imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800",
  },
  mental: {
    emoji: "🧠",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800",
  },
};

// ==================================================================
// MOCK PROGRAM DATA (Updated with new ContentItem structure)
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
        weekNumber: 3, // August 25 - August 31
        days: [
          {
            dayOfWeek: "Wednesday", // Aug 27
            tasks: [
              { 
                id: "t9",
                detailedProgramId: "t9",
                type: "fitness",
                title: "Push Day",
                content: [
                  { name: "Incline Press", imageUrl: "/images/incline-press-thumb.png", details: "3 sets, 8-10 reps" },
                  { name: "Flyes", imageUrl: "/images/flyes-thumb.png", details: "2 sets, 12-15 reps" },
                  { name: "Dips", imageUrl: "/images/dips-thumb.png", details: "2 sets, AMRAP" },
                ],
                status: "completed", progress: 100 
              },
              { 
                id: "t13",
                detailedProgramId: "t13",
                type: "nutrition",
                title: "Healthy Eating",
                content: [
                  { name: "Oatmeal Delight", imageUrl: "/images/oatmeal.jpg", details: "Breakfast" },
                  { name: "Chicken Salad", imageUrl: "/images/salad.jpg", details: "Lunch" },
                  { name: "Salmon & Veggies", imageUrl: "/images/salmon.jpg", details: "Dinner" },
                ],
                status: "completed", progress: 100
              },
              { 
                id: "t14",
                detailedProgramId: "t14",
                type: "mental",
                title: "Afternoon Reset",
                content: [
                   { name: "Guided Meditation", imageUrl: "/images/meditation.jpg", details: "Afternoon" },
                   { name: "Gratitude Journaling", imageUrl: "/images/journaling.jpg", details: "Afternoon" },
                ],
                status: "missed", progress: 0
              }
            ],
          },
          // Today is Sunday, August 31st. This is a future task.
          { dayOfWeek: "Sunday", tasks: [{ id: "tsun", detailedProgramId: "tsun", type: "fitness", title: "Active Recovery", content: [{name: "Light Cardio", imageUrl: "/images/cardio.jpg", details: "30 minutes"}], status: "pending", progress: 0 }] },
        ]
      },
      // ... other weeks
    ],
  },
];

// ==================================================================
// SCHEDULE GENERATOR (No changes)
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
