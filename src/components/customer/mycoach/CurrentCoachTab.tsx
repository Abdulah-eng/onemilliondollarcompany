// src/components/customer/mycoach/CurrentCoachTab.tsx
import ModernCoachDashboard from './ModernCoachDashboard';
import EnhancedCoachUpdates from './EnhancedCoachUpdates';
import UnifiedSharedFiles from './UnifiedSharedFiles';
import RequestFeedbackFab from './RequestFeedbackFab';

interface CurrentCoachTabProps {
    isMobile: boolean;
    onViewBio: () => void;
    onRequestFeedback: () => void;
}

const CurrentCoachTab: React.FC<CurrentCoachTabProps> = ({ isMobile, onViewBio, onRequestFeedback }) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    <ModernCoachDashboard onViewBio={onViewBio} />
                    <EnhancedCoachUpdates />
                </div>

                {/* Shared Files Column (Desktop/Tablet) */}
                <div className="lg:col-span-1">
                    <UnifiedSharedFiles />
                </div>
            </div>

            {/* Floating Action Button - Only visible on this tab */}
            <RequestFeedbackFab isMobile={isMobile} onRequestFeedback={onRequestFeedback} />
        </div>
    );
};

export default CurrentCoachTab;
