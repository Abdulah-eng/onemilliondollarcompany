import { useState, useEffect, useMemo, useRef } from "react";
import {
  format,
  addDays,
  isSameDay,
  isToday,
  startOfWeek,
  parseISO,
  isFuture,
  isPast,
} from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  CheckCircle2,
  Dumbbell,
  Apple,
  Brain,
  XCircle,
  CalendarClock,
  BookMarked,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// --- TYPESCRIPT INTERFACES ---
// Defines the structure for a single task (e.g., a workout, a meal plan)
interface ProgramTask {
  id: string;
  type: "fitness" | "nutrition" | "mental";
  title: string;
  content: string[];
  status: "pending" | "completed" | "missed" | "in-progress";
  progress: number;
}

// Defines a day's schedule within a week
interface ProgramDay {
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

// Defines a week within a program
interface ProgramWeek {
  weekNumber: number;
  days: ProgramDay[];
}

// Defines the overall program structure
interface Program {
  id: string;
  title: string;
  description: string;
  status: "active" | "scheduled" | "purchased";
  startDate?: string; // ISO string 'YYYY-MM-DD'
  weeks: ProgramWeek[];
}

// Defines the structure for a task that has been scheduled onto a specific date
interface ScheduledTask extends ProgramTask {
  date: Date;
  programId: string;
  programTitle: string;
  weekNumber: number;
}

// --- CONFIGURATION ---
// Centralized configuration for program types for easy styling
const typeConfig = {
  fitness: {
    Icon: Dumbbell,
    color: "bg-emerald-500",
    dot: "bg-emerald-500",
    missedDot: "bg-emerald-200",
  },
  nutrition: {
    Icon: Apple,
    color: "bg-amber-500",
    dot: "bg-amber-500",
    missedDot: "bg-amber-200",
  },
  mental: {
    Icon: Brain,
    color: "bg-indigo-500",
    dot: "bg-indigo-500",
    missedDot: "bg-indigo-200",
  },
};

// --- MOCK DATA ---
// A comprehensive mock data set reflecting your requirements
const mockPrograms: Program[] = [
  {
    id: "prog1",
    title: "4-Week Shred",
    description: "An intense 4-week program to build muscle and reduce fat.",
    status: "active",
    startDate: format(addDays(new Date(), -8), "yyyy-MM-dd"), // Started 8 days ago
    weeks: [
      {
        weekNumber: 1,
        days: [
          {
            dayOfWeek: "Monday",
            tasks: [
              {
                id: "t1",
                type: "fitness",
                title: "Leg Day",
                content: ["Squats: 4x10 (Completed)", "Lunges: 3x12 (Completed)"],
                status: "completed",
                progress: 100,
              },
              {
                id: "t2",
                type: "nutrition",
                title: "High Protein Meals",
                content: [
                  "Breakfast: Scrambled Eggs",
                  "Lunch: Grilled Chicken Salad",
                  "Dinner: Salmon & Asparagus",
                ],
                status: "completed",
                progress: 100,
              },
            ],
          },
          {
            dayOfWeek: "Wednesday",
            tasks: [
              {
                id: "t3",
                type: "fitness",
                title: "Chest & Triceps",
                content: ["Bench Press: 3x8", "Tricep Dips: 3x15"],
                status: "missed",
                progress: 0,
              },
            ],
          },
          {
            dayOfWeek: "Friday",
            tasks: [
              {
                id: "t4",
                type: "fitness",
                title: "Back & Biceps",
                content: ["Pull-ups: 3xAMRAP", "Bicep Curls: 3x12"],
                status: "completed",
                progress: 100,
              },
              {
                id: "t5",
                type: "mental",
                title: "Weekly Reflection",
                content: ["Journal for 15 minutes", "Plan the week ahead"],
                status: "completed",
                progress: 100,
              },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        days: [
          {
            dayOfWeek: "Monday", // This is today in the mock data
            tasks: [
              {
                id: "t6",
                type: "fitness",
                title: "Leg Day Vol. 2",
                content: ["Leg Press: 4x12", "Calf Raises: 3x20"],
                status: "in-progress",
                progress: 50,
              },
              {
                id: "t7",
                type: "nutrition",
                title: "Carb Cycling",
                content: ["Breakfast: Oatmeal", "Lunch: Brown Rice & Veggies"],
                status: "missed", // User missed nutrition today
                progress: 0,
              },
            ],
          },
          {
            dayOfWeek: "Tuesday",
            tasks: [
              {
                id: "t8",
                type: "mental",
                title: "Mindfulness",
                content: ["10-minute meditation", "Mindful walking"],
                status: "pending",
                progress: 0,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "prog2",
    title: "Mindfulness Intro",
    description: "A 1-week introduction to mindfulness and meditation.",
    status: "scheduled",
    startDate: format(addDays(new Date(), 7), "yyyy-MM-dd"), // Starts in 1 week
    weeks: [
      {
        weekNumber: 1,
        days: [
          {
            dayOfWeek: "Monday",
            tasks: [
              {
                id: "t9",
                type: "mental",
                title: "Intro to Breathwork",
                content: ["5-minute box breathing"],
                status: "pending",
                progress: 0,
              },
            ],
          },
          {
            dayOfWeek: "Wednesday",
            tasks: [
              {
                id: "t10",
                type: "mental",
                title: "Body Scan Meditation",
                content: ["15-minute guided body scan"],
                status: "pending",
                progress: 0,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "prog3",
    title: "Lifetime Bulk Program",
    description: "A comprehensive guide to building mass. Re-use anytime.",
    status: "purchased",
    weeks: [
      {
        weekNumber: 1,
        days: [
          {
            dayOfWeek: "Monday",
            tasks: [
              {
                id: "t11",
                type: "fitness",
                title: "Heavy Chest Day",
                content: ["Bench Press: 5x5", "Incline Dumbbell Press: 3x8"],
                status: "pending",
                progress: 0,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "prog4",
    title: "Healthy Eating Habits",
    description: "Learn to build sustainable, healthy eating habits.",
    status: "purchased",
    weeks: [
      /* content omitted for brevity */
    ],
  },
];

// --- UTILITY FUNCTION ---
// Maps day names to a numerical index (0 for Monday)
const dayNameToIndex: Record<string, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

// Processes the structured programs and creates a flat list of tasks scheduled on specific dates
const generateDailySchedule = (programs: Program[]): ScheduledTask[] => {
  const dailySchedule: ScheduledTask[] = [];

  programs
    .filter((p) => p.status === "active" || p.status === "scheduled")
    .forEach((program) => {
      if (!program.startDate) return;
      const programStartDate = parseISO(program.startDate);

      program.weeks.forEach((week) => {
        const weekStartDate = addDays(
          programStartDate,
          (week.weekNumber - 1) * 7
        );
        const firstDayOfWeek = startOfWeek(weekStartDate, { weekStartsOn: 1 }); // week starts on Monday

        week.days.forEach((day) => {
          const dayIndex = dayNameToIndex[day.dayOfWeek];
          const taskDate = addDays(firstDayOfWeek, dayIndex);

          day.tasks.forEach((task) => {
            dailySchedule.push({
              ...task,
              date: taskDate,
              programId: program.id,
              programTitle: program.title,
              weekNumber: week.weekNumber,
            });
          });
        });
      });
    });

  return dailySchedule;
};

// --- COMPONENTS ---

const HorizontalCalendar = ({
  selectedDate,
  setSelectedDate,
  schedule,
}: {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  schedule: ScheduledTask[];
}) => {
  const dateListRef = useRef<HTMLDivElement>(null);
  const dates = useMemo(
    () => Array.from({ length: 60 }, (_, i) => addDays(new Date(), i - 30)),
    []
  );

  useEffect(() => {
    const selectedElement = document.getElementById(
      `date-${format(selectedDate, "yyyy-MM-dd")}`
    );
    if (selectedElement && dateListRef.current) {
      const scrollLeft =
        selectedElement.offsetLeft -
        dateListRef.current.offsetWidth / 2 +
        selectedElement.offsetWidth / 2;
      dateListRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [selectedDate]);

  return (
    <div
      ref={dateListRef}
      className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
    >
      {dates.map((date) => {
        const isSelected = isSameDay(date, selectedDate);
        const dayTasks = schedule.filter((task) => isSameDay(task.date, date));
        const uniqueTypes = [
          ...new Set(dayTasks.map((task) => task.type)),
        ] as const;

        return (
          <button
            key={date.toString()}
            id={`date-${format(date, "yyyy-MM-dd")}`}
            onClick={() => setSelectedDate(date)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-xl w-16 h-24 transition-all duration-200 shrink-0 border-2",
              isSelected
                ? "bg-emerald-500 text-white border-emerald-500 shadow-lg"
                : "bg-white hover:bg-slate-100 border-transparent",
              isToday(date) &&
                !isSelected &&
                "border-emerald-500"
            )}
          >
            <span className="text-xs uppercase font-semibold opacity-70">
              {format(date, "EEE")}
            </span>
            <span className="text-2xl font-bold">{format(date, "d")}</span>
            <div className="flex gap-1 mt-1 h-2">
              {uniqueTypes.map((type) => {
                const tasksOfType = dayTasks.filter((t) => t.type === type);
                const isAnyMissed = tasksOfType.some(
                  (t) => t.status === "missed" && isPast(t.date) && !isToday(t.date)
                );
                return (
                  <div
                    key={type}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isAnyMissed
                        ? typeConfig[type].missedDot
                        : typeConfig[type].dot
                    )}
                  />
                );
              })}
            </div>
          </button>
        );
      })}
    </div>
  );
};

const TaskCard = ({
  task,
  onClick,
}: {
  task: ScheduledTask;
  onClick: () => void;
}) => {
  const { Icon, color } = typeConfig[task.type];
  const isCompleted = task.status === "completed";
  // A task is only considered missed if it's in the past and not completed.
  const isMissed = task.status === "missed" || (isPast(task.date) && !isToday(task.date) && !isCompleted);

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition rounded-2xl border border-slate-200 bg-white overflow-hidden"
    >
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={cn("p-2 rounded-full", color)}>
              <Icon className="w-5 h-5 text-white" />
            </span>
            <h3 className="font-bold text-slate-800">{task.title}</h3>
          </div>
          {isCompleted && (
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          )}
          {isMissed && !isCompleted && <XCircle className="w-6 h-6 text-red-400" />}
        </div>
        <div className="text-sm text-slate-500">
          {task.content.length} {task.content.length > 1 ? "items" : "item"}
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              isMissed && !isCompleted ? "bg-red-400" : color
            )}
            style={{ width: `${isMissed && !isCompleted ? 100 : task.progress}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const ProgramDetailView = ({ program }: { program: ScheduledTask | null }) => {
  if (!program) return null;
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{program.title}</h2>
      <Badge variant="outline" className="mb-4">
        {program.programTitle} - Week {program.weekNumber}
      </Badge>
      <ul className="list-disc pl-5 space-y-2 text-slate-700">
        {program.content.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ul>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function MyProgramsPage() {
  const [tab, setTab] = useState("active");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null);

  // Memoize the generated schedule to avoid recalculating on every render
  const dailySchedule = useMemo(
    () => generateDailySchedule(mockPrograms),
    []
  );

  // Filter programs based on their status
  const scheduledPrograms = mockPrograms.filter((p) => p.status === "scheduled");
  const purchasedPrograms = mockPrograms.filter((p) => p.status === "purchased");

  // Filter tasks for the selected date and group them by their parent program
  const tasksForSelectedDate = useMemo(() => {
    const tasks = dailySchedule.filter((task) =>
      isSameDay(task.date, selectedDate)
    );
    // Group tasks by programId and weekNumber
    return Object.values(
      tasks.reduce(
        (acc, task) => {
          const key = `${task.programId}-W${task.weekNumber}`;
          if (!acc[key]) {
            acc[key] = {
              programTitle: task.programTitle,
              weekNumber: task.weekNumber,
              tasks: [],
            };
          }
          acc[key].tasks.push(task);
          return acc;
        },
        {} as Record<
          string,
          { programTitle: string; weekNumber: number; tasks: ScheduledTask[] }
        >
      )
    );
  }, [selectedDate, dailySchedule]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const renderActiveTab = () => (
    <>
      {/* Scheduled Programs Section */}
      {scheduledPrograms.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-indigo-500" />
            Scheduled For You
          </h2>
          {scheduledPrograms.map((p) => (
            <Card key={p.id} className="bg-white rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-2">{p.description}</p>
                <Badge>Starts on {format(parseISO(p.startDate!), "MMMM do")}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <hr />

      {/* Daily Calendar and Tasks */}
      <div className="space-y-4">
        <h2 className="font-bold text-xl text-slate-800">Your Day</h2>
        <HorizontalCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          schedule={dailySchedule}
        />
        {tasksForSelectedDate.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl text-slate-500 bg-white border border-dashed border-slate-300">
            <p className="font-semibold">No tasks scheduled for this day.</p>
            <p className="text-sm">Enjoy your rest day!</p>
          </div>
        ) : (
          tasksForSelectedDate.map((programGroup) => (
            <div key={programGroup.programTitle + programGroup.weekNumber} className="space-y-3">
              <h3 className="font-semibold text-md text-slate-600 px-2">
                {programGroup.programTitle} -{" "}
                <span className="font-bold text-slate-800">
                  Week {programGroup.weekNumber}
                </span>
              </h3>
              {programGroup.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setSelectedTask(task)}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );

  const renderPurchasedTab = () => (
     <div className="space-y-4">
        <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-amber-500" />
            Your Program Library
        </h2>
        {purchasedPrograms.length === 0 ? (
             <div className="text-center py-12 px-4 rounded-2xl text-slate-500 bg-white border border-dashed border-slate-300">
                <p className="font-semibold">No purchased programs yet.</p>
                <p className="text-sm">Visit the store to find your next program!</p>
          </div>
        ) : (
             purchasedPrograms.map((p) => (
                <Card key={p.id} className="bg-white rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-600 mb-4">{p.description}</p>
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Info className="w-4 h-4" />
                        <span>This program has lifetime access. You can start it whenever you like.</span>
                    </div>
                </CardContent>
                </Card>
            ))
        )}
     </div>
  );

  return (
    <div className="p-4 space-y-6 bg-slate-50 min-h-screen">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-sm mx-auto bg-slate-200 rounded-xl p-1">
          <TabsTrigger
            value="active"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md"
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            value="purchased"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md"
          >
            Purchased
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content based on selected tab */}
      {tab === "active" ? renderActiveTab() : renderPurchasedTab()}

      {/* Drawer/Dialog for task details */}
      {isMobile ? (
        <Drawer
          open={!!selectedTask}
          onOpenChange={(isOpen) => !isOpen && setSelectedTask(null)}
        >
          <DrawerContent>
            <ProgramDetailView program={selectedTask} />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog
          open={!!selectedTask}
          onOpenChange={(isOpen) => !isOpen && setSelectedTask(null)}
        >
          <DialogContent className="sm:max-w-md">
            <ProgramDetailView program={selectedTask} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
