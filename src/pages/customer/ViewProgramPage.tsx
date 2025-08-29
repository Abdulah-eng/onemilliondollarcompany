// src/pages/customer/ViewProgramPage.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { mockPrograms, generateDailySchedule, ScheduledTask } from "@/mockdata/programs/mockprograms";
import FitnessWorkoutView from "@/components/customer/viewprogram/FitnessWorkoutView";
import { ArrowLeft } from "lucide-react";

export default function ViewProgramPage() {
  const [task, setTask] = useState<ScheduledTask | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;
    
    // Generate the daily schedule to get ScheduledTask objects
    const dailySchedule = generateDailySchedule(mockPrograms);
    const currentTask = dailySchedule.find((t) => t.id === id);

    if (currentTask) {
      setTask(currentTask);
    }
  }, [id]);

  const renderProgramView = () => {
    if (!task) {
      return <div className="text-center p-8">Loading workout...</div>;
    }

    // You can expand this logic for other program types [cite: 16]
    switch (task.type) {
      case "fitness":
        return <FitnessWorkoutView task={task} />;
      // case "nutrition":
      //   return <NutritionLogView task={task} />;
      // case "mental":
      //   return <MentalHealthSessionView task={task} />;
      default:
        return (
          <div className="text-center p-8">
            This program type is not supported yet.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 shadow-sm">
        <div className="max-w-3xl mx-auto p-4 flex items-center">
          <button
            onClick={() => window.history.back()} // Simple back navigation
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-gray-800 ml-4">
            {task?.title || "Workout"}
          </h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto p-4">{renderProgramView()}</main>
    </div>
  );
}
