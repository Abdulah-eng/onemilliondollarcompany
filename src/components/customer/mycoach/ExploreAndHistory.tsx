// src/components/customer/mycoach/ExploreAndHistory.tsx
import CoachExplorerDrawer from './CoachExplorerDrawer';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

interface ExploreAndHistoryProps {
    onNewCoachRequestSent: (coachName: string) => void;
}

const CoachHistoryPlaceholder = () => (
    <div className="p-6 bg-card rounded-xl shadow-md border space-y-4 mt-8">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Coach History 🕰️</h3>
            <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                View Full History
            </Button>
        </div>
        <p className="text-muted-foreground text-sm">
            View records, programs, and messages from your past coaching relationships.
        </p>
        <div className="h-20 border border-dashed rounded-lg flex items-center justify-center text-sm text-muted-foreground">
            No past coaches on file.
        </div>
    </div>
);


const ExploreAndHistory: React.FC<ExploreAndHistoryProps> = ({ onNewCoachRequestSent }) => {
    return (
        <div className="space-y-8">
            {/* Coach Explorer takes the main space. It now behaves like persistent tab content. */}
            <CoachExplorerDrawer 
                // The Explorer component is designed with a modal for the request, 
                // so we pass a placeholder onClose to prevent errors, as the main Drawer/Sheet is gone.
                onClose={() => {}} 
                onNewCoachRequestSent={onNewCoachRequestSent}
            />

            {/* Coach History Section */}
            <CoachHistoryPlaceholder />
        </div>
    );
};

export default ExploreAndHistory;
