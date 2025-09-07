// src/pages/customer/MyCoach.tsx
import { useState } from 'react';
import useMediaQuery from '@/hooks/use-media-query'; // Assuming you have or will create this hook
import CoachMainHeader from '@/components/customer/mycoach/CoachMainHeader';
import TodaysMessage from '@/components/customer/mycoach/TodaysMessage';
import CoachUpdates from '@/components/customer/mycoach/CoachUpdates';
import SharedFilesCard from '@/components/customer/mycoach/SharedFilesCard';
import RequestFeedbackFab from '@/components/customer/mycoach/RequestFeedbackFab';
import SlideInDetail from '@/components/customer/programsoverview/SlideInDetail'; // Reusing your existing component
import CoachBioDrawer from '@/components/customer/mycoach/CoachBioDrawer';

const MyCoach = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)'); // Example breakpoint

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="px-2">
        <h1 className="text-3xl font-bold text-foreground">My Coach 🤝</h1>
        <p className="mt-1 text-lg text-muted-foreground">Everything you need to connect with your coach.</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2/3 width on desktop) */}
        <div className="md:col-span-2 space-y-6">
          <CoachMainHeader onClick={handleOpenDrawer} />
          <TodaysMessage />
          <CoachUpdates />
        </div>

        {/* Right Column (1/3 width on desktop) */}
        <div className="md:col-span-1 space-y-6">
          <SharedFilesCard />
        </div>
      </div>

      {/* Conditional Rendering for Drawer/Side Menu */}
      <SlideInDetail
        isMobile={isMobile}
        task={isDrawerOpen ? { id: 'coach-bio', type: 'bio' } : null} // Simple task object to trigger SlideInDetail
        onClose={handleCloseDrawer}
      >
        <CoachBioDrawer />
      </SlideInDetail>

      {/* Floating Action Button for Mobile */}
      <RequestFeedbackFab />
    </div>
  );
};

export default MyCoach;
