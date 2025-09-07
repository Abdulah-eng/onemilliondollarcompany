// src/pages/customer/MyCoach.tsx
import CoachCard from '@/components/customer/mycoach/CoachCard';
import FeedbackHistory from '@/components/customer/mycoach/FeedbackHistory';
import ChatBox from '@/components/customer/mycoach/ChatBox';
import FilesShared from '@/components/customer/mycoach/FilesShared';

const MyCoach = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Page Title */}
      <div className="px-2">
        <h1 className="text-3xl font-bold text-foreground">My Coach 🤝</h1>
        <p className="mt-1 text-lg text-muted-foreground">Everything you need to connect with your coach.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <CoachCard />
          <FeedbackHistory />
        </div>
        <div className="md:col-span-1 space-y-6">
          <ChatBox />
          <FilesShared />
        </div>
      </div>
    </div>
  );
};

export default MyCoach;
