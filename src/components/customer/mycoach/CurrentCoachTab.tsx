// src/components/customer/mycoach/CurrentCoachTab.tsx
import ModernCoachDashboard from './ModernCoachDashboard';
import EnhancedCoachUpdates from './EnhancedCoachUpdates';
import UnifiedSharedFiles from './UnifiedSharedFiles';
import RequestFeedbackFab from './RequestFeedbackFab';
import { Button } from '@/components/ui/button';
import { File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CurrentCoachTabProps {
    isMobile: boolean;
    onViewBio: () => void;
    onRequestFeedback: () => void;
    onViewSharedFiles: () => void; // Added for mobile file access
}

const CurrentCoachTab: React.FC<CurrentCoachTabProps> = ({ isMobile, onViewBio, onRequestFeedback, onViewSharedFiles }) => {
    return (
        <div className="space-y-8">
            {/* Mobile View: Files button is placed here */}
            {isMobile && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Button
                        variant="outline"
                        className="w-full h-12 border-2 border-dashed border-primary/20 hover:bg-primary/5 transition-all"
                        onClick={onViewSharedFiles}
                    >
                        <File className="w-4 h-4 mr-2" /> View All Shared Files
                    </Button>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    <ModernCoachDashboard onViewBio={onViewBio} />
                    <EnhancedCoachUpdates />
                </div>

                {/* Shared Files Column (Desktop/Tablet) */}
                <div className={cn(
                    "lg:col-span-1",
                    isMobile ? 'hidden' : 'block'
                )}>
                    <UnifiedSharedFiles />
                </div>
            </div>

            {/* Floating Action Button - Only visible on this tab */}
            <RequestFeedbackFab isMobile={isMobile} onRequestFeedback={onRequestFeedback} />
        </div>
    );
};

export default CurrentCoachTab;
