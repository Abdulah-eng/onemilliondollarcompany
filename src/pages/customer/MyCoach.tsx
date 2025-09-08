// src/pages/customer/MyCoach.tsx
import { useState } from 'react';
import useMediaQuery from '@/hooks/use-media-query';
import CoachMainHeader from '@/components/customer/mycoach/CoachMainHeader';
import TodaysMessage from '@/components/customer/mycoach/TodaysMessage';
import CoachUpdates from '@/components/customer/mycoach/CoachUpdates';
import SharedFilesCard from '@/components/customer/mycoach/SharedFilesCard';
import RequestFeedbackFab from '@/components/customer/mycoach/RequestFeedbackFab';
import FeedbackMessagePopup from '@/components/customer/mycoach/FeedbackMessagePopup'; // Import the new component
import CoachBioDrawer from '@/components/customer/mycoach/CoachBioDrawer';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import SharedFilesDrawerContent from '@/components/customer/mycoach/SharedFilesDrawerContent';

const MyCoach = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isFilesDrawerOpen, setIsFilesDrawerOpen] = useState(false);

    // New state for managing the feedback pop-up message
    const [feedbackPopup, setFeedbackPopup] = useState({
        isVisible: false,
        message: '',
        requested: false,
    });

    const handleFeedbackRequest = () => {
        if (feedbackPopup.requested) {
            setFeedbackPopup({
                isVisible: true,
                message: "You have already made a request, your coach will reach out very soon",
                requested: true,
            });
        } else {
            setFeedbackPopup({
                isVisible: true,
                message: "Your coach will reach out soon",
                requested: true,
            });
        }
        // Automatically hide the message after 5 seconds
        setTimeout(() => {
            setFeedbackPopup(prev => ({ ...prev, isVisible: false }));
        }, 5000);
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
            {/* Page Header */}
            <div className="px-2">
                <h1 className="text-3xl font-bold text-foreground">My Coach 🤝</h1>
                <p className="mt-1 text-lg text-muted-foreground">Everything you need to connect with your coach.</p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    <CoachMainHeader onClick={() => setIsDrawerOpen(true)} />
                    <TodaysMessage />
                    <CoachUpdates />
                </div>

                {/* Shared Files Column */}
                <div className="lg:col-span-1 space-y-6">
                    <SharedFilesCard />
                </div>
            </div>

            {/* Coach Bio Modal/Drawer */}
            {isMobile ? (
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerContent>
                        <CoachBioDrawer />
                    </DrawerContent>
                </Drawer>
            ) : (
                <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <SheetContent side="right" className="w-96">
                        <CoachBioDrawer />
                    </SheetContent>
                </Sheet>
            )}

            {/* Shared Files Drawer for Mobile */}
            {isMobile && (
                <Drawer open={isFilesDrawerOpen} onOpenChange={setIsFilesDrawerOpen}>
                    <DrawerContent>
                        <SharedFilesDrawerContent />
                    </DrawerContent>
                </Drawer>
            )}

            {/* Floating Action Button */}
            <RequestFeedbackFab isMobile={isMobile} onRequestFeedback={handleFeedbackRequest} />

            {/* New Feedback Pop-up Message */}
            <FeedbackMessagePopup
                message={feedbackPopup.message}
                isVisible={feedbackPopup.isVisible}
                onDismiss={() => setFeedbackPopup(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
};

export default MyCoach;
