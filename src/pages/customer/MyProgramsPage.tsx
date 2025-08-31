import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCard } from "@/components/customer/programsoverview/TaskCard";
import HorizontalCalendar from "@/components/customer/programsoverview/HorizontalCalendar";
import SlideInDetail from "@/components/customer/programsoverview/SlideInDetail";
import { ScheduledProgramCard } from "@/components/customer/programsoverview/ScheduledProgramCard";
import {
  mockPrograms,
  generateDailySchedule,
  ScheduledTask,
  Program, // Import Program type
} from "@/mockdata/programs/mockprograms";
import { isSameDay, parseISO, addDays } from "date-fns";

type TabType = "active" | "scheduled";

export default function MyProgramsPage() {
  const [tab, setTab] = useState<TabType>("active");
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
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

  // ✅ Filter for scheduled programs
  const scheduledPrograms = useMemo(
    () => mockPrograms.filter((p) => p.status === "scheduled"),
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
  
  // ✅ Handler to create a preview "task" from a scheduled program
  const handleScheduledProgramClick = (program: Program) => {
    const mockTask: ScheduledTask = {
      id: program.id,
      date: parseISO(program.startDate),
      title: program.title,
      programTitle: program.title,
      type: program.type,
      weekNumber: 1, // Placeholder
      dayOfWeek: 1,  // Placeholder
      status: "pending",
      content: ["Program preview..."], // Placeholder
    };
    setSelectedTask(mockTask);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabType)}>
        <TabsList className="grid grid-cols-2 w-full max-w-sm mx-auto rounded-xl bg-white dark:bg-[#1e262e] p-1 shadow-sm">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ✅ Conditionally render content based on the selected tab */}
      {tab === "active" && (
        <>
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
          <div className="space-y-6">
            {todayTasks.length === 0 ? (
              <div className="p-8 text-center border border-dashed rounded-2xl text-gray-500">
                No tasks today!
              </div>
            ) : (
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
        </>
      )}

      {tab === "scheduled" && (
        <div className="space-y-6">
          {scheduledPrograms.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-2xl text-gray-500">
              No scheduled programs.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduledPrograms.map((program) => (
                <ScheduledProgramCard
                  key={program.id}
                  program={program}
                  onClick={() => handleScheduledProgramClick(program)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <SlideInDetail
        task={selectedTask}
        isMobile={isMobile}
        onClose={() => setSelectedTask(null)}
        // ✅ Pass prop to hide footer when viewing scheduled programs
        showFooter={tab === "active"} 
      />
    </div>
  );
}
