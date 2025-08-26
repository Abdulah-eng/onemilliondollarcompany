import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  format,
  addDays,
  isSameDay,
  isToday,
  startOfWeek,
  parseISO,
  isPast,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  CheckCircle2,
  Dumbbell,
  Apple,
  Brain,
  XCircle,
  CalendarClock,
  BookMarked,
  Info,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// --- TYPESCRIPT INTERFACES ---
interface ProgramTask {
  id: string;
  type: "fitness" | "nutrition" | "mental";
  title: string;
  content: string[];
  status: "pending" | "completed" | "missed" | "in-progress";
  progress: number;
}

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

interface ProgramWeek {
  weekNumber: number;
  days: ProgramDay[];
}

interface Program {
  id: string;
  title: string;
  description: string;
  status: "active" | "scheduled" | "purchased";
  startDate?: string;
  weeks: ProgramWeek[];
}

interface ScheduledTask extends ProgramTask {
  date: Date;
  programId: string;
  programTitle: string;
  weekNumber: number;
}

// --- ENHANCED CONFIGURATION ---
// Added imageUrl, gradient, and emoji for a richer UI
const typeConfig = {
  fitness: {
    Icon: Dumbbell,
    emoji: "🏋️",
    gradient: "from-emerald-500/80 to-green-600/70",
    dot: "bg-emerald-400",
    missedDot: "bg-emerald-200",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  nutrition: {
    Icon: Apple,
    emoji: "🥗",
    gradient: "from-amber-500/80 to-orange-600/70",
    dot: "bg-amber-400",
    missedDot: "bg-amber-200",
    imageUrl:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  mental: {
    Icon: Brain,
    emoji: "🧘",
    gradient: "from-indigo-500/80 to-purple-600/70",
    dot: "bg-indigo-400",
    missedDot: "bg-indigo-200",
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=799&q=80",
  },
};

// --- MOCK DATA --- (No changes needed here)
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
                content: ["Squats: 4x10", "Lunges: 3x12", "Deadlifts: 3x8"],
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
        ],
      },
      {
        weekNumber: 2,
        days: [
          {
            dayOfWeek: "Monday",
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
                title: "Carb Cycling Day",
                content: [
                  "Breakfast: Oatmeal with berries",
                  "Lunch: Brown Rice & Veggies",
                  "Dinner: Sweet Potato with Black Beans",
                ],
                status: "pending",
                progress: 0,
              },
              {
                id: "t8",
                type: "mental",
                title: "Mindfulness Start",
                content: ["10-minute morning meditation", "Evening gratitude journal"],
                status: "pending",
                progress: 0,
              },
            ],
          },
        ],
      },
    ],
  },
];
// --- UTILITY FUNCTION --- (No changes needed here)
const dayNameToIndex: Record<string, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};
const generateDailySchedule = (programs: Program[]): ScheduledTask[] => {
  const dailySchedule: ScheduledTask[] = [];
  programs
    .filter((p) => p.status === "active" || p.status === "scheduled")
    .forEach((program) => {
      if (!program.startDate) return;
      const programStartDate = parseISO(program.startDate);
      program.weeks.forEach((week) => {
        const weekStartDate = addDays(programStartDate, (week.weekNumber - 1) * 7);
        const firstDayOfWeek = startOfWeek(weekStartDate, { weekStartsOn: 1 });
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

// --- NEW & IMPROVED COMPONENTS ---

const HorizontalCalendar = ({ selectedDate, setSelectedDate, schedule }) => {
  // ... (Component remains the same, but you can add more styles if you like)
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
      className="flex space-x-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide scroll-smooth"
    >
      {dates.map((date) => {
        const isSelected = isSameDay(date, selectedDate);
        const dayTasks = schedule.filter((task) => isSameDay(task.date, date));
        const uniqueTypes = [...new Set(dayTasks.map((task) => task.type))] as const;

        return (
          <button
            key={date.toString()}
            id={`date-${format(date, "yyyy-MM-dd")}`}
            onClick={() => setSelectedDate(date)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-2xl w-16 h-24 transition-all duration-300 shrink-0 ",
              isSelected
                ? "bg-indigo-600 text-white shadow-lg scale-105"
                : "bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm",
              isToday(date) && !isSelected && "border-2 border-indigo-500"
            )}
          >
            <span className="text-xs uppercase font-semibold opacity-70">
              {format(date, "EEE")}
            </span>
            <span className="text-2xl font-bold">{format(date, "d")}</span>
            <div className="flex gap-1.5 mt-1.5 h-2">
              {uniqueTypes.map((type) => (
                <div key={type} className={cn("w-2 h-2 rounded-full", typeConfig[type].dot)} />
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
};

const TaskCard = ({ task, onClick }: { task: ScheduledTask; onClick: () => void }) => {
  const config = typeConfig[task.type];
  const isCompleted = task.status === "completed";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative cursor-pointer rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-48 flex flex-col justify-between text-white p-5"
      style={{ backgroundImage: `url(${config.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className={cn("absolute inset-0 z-0", config.gradient)} />
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-2xl drop-shadow-md">{config.emoji} {task.title}</h3>
          <p className="text-sm opacity-90 drop-shadow-md">{task.programTitle}</p>
        </div>
        {isCompleted && <CheckCircle2 className="w-8 h-8 text-white drop-shadow-lg" />}
      </div>
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="text-xs font-semibold uppercase">
          {task.status.replace('-', ' ')}
        </div>
        <div className="flex-1 h-2 bg-white/30 rounded-full">
          <div className="h-2 bg-white rounded-full" style={{ width: `${task.progress}%` }} />
        </div>
        <ChevronRight className="w-6 h-6" />
      </div>
    </motion.div>
  );
};

const TaskDetailView = ({ task, onClose }: { task: ScheduledTask; onClose: () => void }) => {
  const config = typeConfig[task.type];

  const getEmojiForContent = (item: string) => {
    switch(task.type) {
      case 'fitness': return '🏋️';
      case 'nutrition': return '🍴';
      case 'mental': return '✨';
      default: return '✅';
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="relative h-48 md:h-64">
        <img src={config.imageUrl} alt={task.title} className="w-full h-full object-cover" />
        <div className={cn("absolute inset-0", config.gradient)} />
        <div className="absolute top-4 right-4">
          <button onClick={onClose} className="bg-black/30 rounded-full p-2 text-white hover:bg-black/50 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute bottom-5 left-5 text-white">
          <Badge variant="secondary" className="mb-2">{task.programTitle} - Week {task.weekNumber}</Badge>
          <h2 className="text-3xl md:text-4xl font-bold drop-shadow-lg">{config.emoji} {task.title}</h2>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <ul className="space-y-4">
          {task.content.map((item, i) => (
            <li key={i} className="flex items-start p-4 bg-white rounded-xl shadow-sm">
              <span className="text-xl mr-4">{getEmojiForContent(item)}</span>
              <span className="text-slate-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function MyProgramsPage() {
  const [tab, setTab] = useState("active");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null);

  const dailySchedule = useMemo(() => generateDailySchedule(mockPrograms), []);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const tasksForSelectedDate = useMemo(() => {
    return dailySchedule.filter((task) => isSameDay(task.date, selectedDate));
  }, [selectedDate, dailySchedule]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning! ☀️";
    if (hour < 18) return "Good Afternoon! 🌤️";
    return "Good Evening! 🌙";
  };
  
  const renderActiveTab = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">{getGreeting()}</h1>
        <p className="text-slate-500">Here's your plan for the day. Let's do this! 💪</p>
      </div>
      <HorizontalCalendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        schedule={dailySchedule}
      />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">
          Today's Focus ✨
        </h2>
        {tasksForSelectedDate.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl text-slate-500 bg-white shadow-sm">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-semibold text-lg">All Clear!</p>
            <p className="text-sm">Enjoy your well-deserved rest day.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {tasksForSelectedDate.map((task) => (
              <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-6 bg-slate-100 min-h-screen font-sans">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        {/* ... Tabs UI remains the same */}
      </Tabs>

      {renderActiveTab()}
      
      {/* --- Detail View: Drawer for Mobile, Sliding Panel for Desktop --- */}
      {isMobile ? (
        <Drawer open={!!selectedTask} onOpenChange={(isOpen) => !isOpen && setSelectedTask(null)}>
          <DrawerContent className="h-[85%]">
            {selectedTask && <TaskDetailView task={selectedTask} onClose={() => setSelectedTask(null)} />}
          </DrawerContent>
        </Drawer>
      ) : (
        <AnimatePresence>
          {selectedTask && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTask(null)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50"
              >
                <TaskDetailView task={selectedTask} onClose={() => setSelectedTask(null)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
