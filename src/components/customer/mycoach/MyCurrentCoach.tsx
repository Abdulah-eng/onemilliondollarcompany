// src/components/customer/mycoach/MyCurrentCoach.tsx
import CoachMainHeader from '@/components/customer/mycoach/CoachMainHeader';
import TodaysMessage from '@/components/customer/mycoach/TodaysMessage';
import CoachUpdates from '@/components/customer/mycoach/CoachUpdates';
import SharedFilesCard from '@/components/customer/mycoach/SharedFilesCard';
import RequestFeedbackFab from '@/components/customer/mycoach/RequestFeedbackFab';

interface MyCurrentCoachProps {
    isMobile: boolean;
    onViewBio: () => void;
    onRequestFeedback: () => void;
}

const MyCurrentCoach: React.FC<MyCurrentCoachProps> = ({ isMobile, onViewBio, onRequestFeedback }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header triggers the Bio Drawer */}
                    <CoachMainHeader onClick={onViewBio} /> 
                    <TodaysMessage />
                    <CoachUpdates />
                </div>

                {/* Shared Files Column (Desktop/Tablet) */}
                <div className="lg:col-span-1 space-y-6">
                    <SharedFilesCard />
                </div>
            </div>

            {/* Floating Action Button - Only visible on this tab */}
            <RequestFeedbackFab isMobile={isMobile} onRequestFeedback={onRequestFeedback} />
        </div>
    );
};

export default MyCurrentCoach;
