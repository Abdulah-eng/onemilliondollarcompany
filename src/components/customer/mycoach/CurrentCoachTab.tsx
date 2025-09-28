// src/components/customer/mycoach/CurrentCoachTab.tsx
import CoachMainHeader from './CoachMainHeader';
import TodaysMessage from './TodaysMessage';
import CoachUpdates from './CoachUpdates';
import SharedFilesCard from './SharedFilesCard';
import RequestFeedbackFab from './RequestFeedbackFab';

interface CurrentCoachTabProps {
    isMobile: boolean;
    onViewBio: () => void;
    onRequestFeedback: () => void;
}

const CurrentCoachTab: React.FC<CurrentCoachTabProps> = ({ isMobile, onViewBio, onRequestFeedback }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
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

export default CurrentCoachTab;
