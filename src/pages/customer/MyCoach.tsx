// src/pages/customer/MyCoach.tsx
import CoachHeaderCard from '@/components/customer/mycoach/CoachHeaderCard';
import CoachMessageCard from '@/components/customer/mycoach/CoachMessageCard';
import FilesShared from '@/components/customer/mycoach/FilesShared';

const MyCoach = () => {
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
          <CoachHeaderCard />
          <FilesShared />
        </div>

        {/* Right Column (1/3 width on desktop) */}
        <div className="md:col-span-1 space-y-6">
          <CoachMessageCard />
        </div>
      </div>
    </div>
  );
};

export default MyCoach;
