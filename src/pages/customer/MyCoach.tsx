// src/pages/customer/MyCoach.tsx
import CoachHeader from '@/components/customer/mycoach/CoachHeader';
import CoachBioCard from '@/components/customer/mycoach/CoachBioCard';
import CoachContactCard from '@/components/customer/mycoach/CoachContactCard';
import FeedbackHistory from '@/components/customer/mycoach/FeedbackHistory';
import FilesShared from '@/components/customer/mycoach/FilesShared';

const MyCoach = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      <CoachHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <CoachBioCard />
        </div>
        <div className="md:col-span-1">
          <CoachContactCard />
        </div>
      </div>
      <FeedbackHistory />
      <FilesShared />
    </div>
  );
};

export default MyCoach;
