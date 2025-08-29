// src/pages/customer/ViewProgramPage.tsx
import { useParams } from "react-router-dom";
import { mockPrograms, generateDailySchedule, ScheduledTask } from "@/mockdata/programs/mockprograms";
import FitnessWorkoutView from "@/components/customer/viewprogram/FitnessWorkoutView";
import WorkoutHeader from "@/components/customer/viewprogram/WorkoutHeader";
import CoachMessage from "@/components/customer/viewprogram/CoachMessage";

// Helper to find the task
const findTaskById = (id: string): ScheduledTask | undefined => {
  const dailySchedule = generateDailySchedule(mockPrograms);
  return dailySchedule.find((t) => t.id === id);
};

export default function ViewProgramPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const task = taskId ? findTaskById(taskId) : null;

  if (!task) {
    return <div className="text-center p-8">Workout not found or loading...</div>;
  }

  const renderProgramView = () => {
    switch (task.type) {
      case "fitness":
        return <FitnessWorkoutView task={task} />;
      // ... other cases
      default:
        return <div className="p-8 text-center">This workout type is not yet supported.</div>;
    }
  };

  return (
    // ✅ Use the same centered layout as MyProgramsPage
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      <WorkoutHeader task={task} />
      <CoachMessage />
      <main>{renderProgramView()}</main>
    </div>
  );
}
