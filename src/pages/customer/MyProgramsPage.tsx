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
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  // Detect resize to update mobile/tablet mode dynamically
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dailySchedule = useMemo(() => generateDailySchedule(mockPrograms), []);

  // --- Active program & date calculations ---
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
    <div className="w-full max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabType)}>
        <TabsList className="grid grid-cols-3 w-full max-w-sm mx-auto rounded-xl bg-white p-1 shadow-sm">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="purchased">Purchased</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Calendar */}
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

      {/* Tasks for selected day */}
      <div className="space-y-4">
        {todayTasks.length === 0 ? (
          <div className="p-8 text-center border border-dashed rounded-2xl text-gray-500">
            No tasks today!
          </div>
        ) : (
          todayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => setSelectedTask(task)}
            />
          ))
        )}
      </div>

      {/* Slide-in detail panel */}
      <SlideInDetail
        task={selectedTask}
        isMobile={isMobile}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}
