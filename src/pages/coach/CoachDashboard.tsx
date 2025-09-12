// src/pages/coach/CoachDashboard.tsx
import CoachHeader from '@/components/coach/dashboard/CoachHeader';
import ActionShortcuts from '@/components/coach/dashboard/ActionShortcuts';
import ClientOverview from '@/components/coach/dashboard/ClientOverview';
import TaskBoard from '@/components/coach/dashboard/TaskBoard';

const CoachDashboard = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Header with Welcome and key metrics */}
      <CoachHeader />

      {/* Primary Call-to-Actions and Shortcuts */}
      <ActionShortcuts />

      {/* Main content area with a two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column (Task Board) */}
        <div className="md:col-span-2 space-y-8">
          <TaskBoard />
        </div>

        {/* Right Column (Client Overview and Statuses) */}
        <div className="md:col-span-1">
          <ClientOverview />
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;
