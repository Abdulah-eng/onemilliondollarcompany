// src/components/customer/mycoach/ExploreAndHistory.tsx (NEW)
import CoachExplorerDrawer from './CoachExplorerDrawer';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

interface ExploreAndHistoryProps {
    onNewCoachRequestSent: (coachName: string) => void;
}

const CoachHistoryPlaceholder = () => (
    <div className="p-6 bg-card rounded-xl shadow-md space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Coach History 🕰️</h3>
            <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                View All Records
            </Button>
        </div>
        <p className="text-muted-foreground">
            You are currently working with **Sophia Miller**. Previous coach records will appear here.
        </p>
        <div className="h-20 border border-dashed rounded-lg flex items-center justify-center text-sm text-muted-foreground">
            No past coaches on file.
        </div>
    </div>
);


const ExploreAndHistory: React.FC<ExploreAndHistoryProps> = ({ onNewCoachRequestSent }) => {
    return (
        <div className="space-y-8">
            {/* Coach Explorer takes up the majority of the view */}
            {/* NOTE: We now remove the 'onClose' prop from the Explorer since it's in a persistent tab */}
            <CoachExplorerDrawer 
                // We fake the onClose for internal dialogs to work, but it just calls onNewCoachRequestSent
                onClose={() => {}} 
                onNewCoachRequestSent={onNewCoachRequestSent}
            />

            {/* Coach History (Future Expansion) */}
            <CoachHistoryPlaceholder />
        </div>
    );
};

export default ExploreAndHistory;
