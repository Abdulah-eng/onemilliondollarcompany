import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCard } from "@/components/customer/programsoverview/TaskCard";
import HorizontalCalendar from "@/components/customer/programsoverview/HorizontalCalendar";
import SlideInDetail from "@/components/customer/programsoverview/SlideInDetail";
import {
  mockPrograms,
  generateDailySchedule,
  ScheduledTask,
} from "@/mockdata/programs/mockprograms";
import { isSameDay, parseISO, addDays } from "date-fns";

type TabType = "active" | "scheduled" | "purchased";

export default function MyProgramsPage() {
  const [tab, setTab] = useState<TabType>("active");
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false // Changed breakpoint to iPad size
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dailySchedule = useMemo(() => generateDailySchedule(mockPrograms), []);

  const activeProgram = useMemo(
    () => mockPrograms.find((p) => p.status === "active"),
    []
  );

  const programStartDate = useMemo(
    () => (activeProgram?.startDate ? parseISO(activeProgram.startDate) : undefined),
    [activeProgram]
  );

  const programEndDate = useMemo(
    () =>
      programStartDate && activeProgram?.weeks
        ? addDays(programStartDate, activeProgram.weeks.length * 7 - 1)
        : undefined,
    [programStartDate, activeProgram]
  );

  const todayTasks = dailySchedule.filter((t) =>
    isSameDay(t.date, selectedDate)
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabType)}>
        <TabsList className="grid grid-cols-3 w-full max-w-sm mx-auto rounded-xl bg-white p-1 shadow-sm">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="purchased">Purchased</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeProgram && programStartDate && programEndDate ? (
        <HorizontalCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          schedule={dailySchedule}
          programStartDate={programStartDate}
          programEndDate={programEndDate}
        />
      ) : (
        <div className="p-4 text-center border border-dashed rounded-2xl text-gray-400">
          No active program schedule found.
        </div>
      )}

      {/* ✅ UPDATED GRID LAYOUT FOR TASK CARDS */}
      <div className="space-y-6">
        {todayTasks.length === 0 ? (
          <div className="p-8 text-center border border-dashed rounded-2xl text-gray-500">
            No tasks today!
          </div>
        ) : (
          // Grid for desktop, stacks on mobile
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => setSelectedTask(task)}
              />
            ))}
          </div>
        )}
      </div>

      <SlideInDetail
        task={selectedTask}
        isMobile={isMobile}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}
