 // src/pages/customer/MyCoach.tsx (UPDATED)
import { useState } from 'react';
import useMediaQuery from '@/hooks/use-media-query';
import CoachMainHeader from '@/components/customer/mycoach/CoachMainHeader';
import TodaysMessage from '@/components/customer/mycoach/TodaysMessage';
import CoachUpdates from '@/components/customer/mycoach/CoachUpdates';
import SharedFilesCard from '@/components/customer/mycoach/SharedFilesCard';
import RequestFeedbackFab from '@/components/customer/mycoach/RequestFeedbackFab';
import FeedbackMessagePopup from '@/components/customer/mycoach/FeedbackMessagePopup';
import CoachBioDrawer from '@/components/customer/mycoach/CoachBioDrawer';
import CoachExplorerDrawer from '@/components/customer/mycoach/CoachExplorerDrawer'; // NEW IMPORT
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'; // Added DrawerHeader/Title
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'; // Added SheetHeader/Title
import SharedFilesDrawerContent from '@/components/customer/mycoach/SharedFilesDrawerContent';
import { coachInfo } from '@/mockdata/mycoach/coachData'; // Import coachInfo

const MyCoach = () => {
    // Current Coach Bio Drawer State
    const [isBioDrawerOpen, setIsBioDrawerOpen] = useState(false);
    // NEW: Coach Explorer Drawer/Sheet State
    const [isExplorerOpen, setIsExplorerOpen] = useState(false);

    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isFilesDrawerOpen, setIsFilesDrawerOpen] = useState(false);

    // State for managing the feedback pop-up message
    const [feedbackPopup, setFeedbackPopup] = useState({
        isVisible: false,
        message: '',
        requested: false,
    });

    const handleFeedbackRequest = () => {
        if (feedbackPopup.requested) {
            setFeedbackPopup({
                isVisible: true,
                message: `You already requested feedback. Your coach ${coachInfo.name} will reach out soon.`,
                requested: true,
            });
        } else {
            setFeedbackPopup({
                isVisible: true,
                message: "Feedback requested! Your coach will reach out soon.",
                requested: true,
            });
        }
        // Automatically hide the message after 5 seconds
        setTimeout(() => {
            setFeedbackPopup(prev => ({ ...prev, isVisible: false }));
        }, 5000);
    };
    
    // NEW: Handler for successful coach request from the explorer
    const handleNewCoachRequestSent = (coachName: string) => {
        setFeedbackPopup({
            isVisible: true,
            message: `Your request to switch to ${coachName} has been sent! We'll process it shortly.`,
            requested: true, // Mark this as a pending request (though different type)
        });
        setTimeout(() => {
            setFeedbackPopup(prev => ({ ...prev, isVisible: false }));
        }, 5000);
    };
    
    // Determine which component (Drawer or Sheet) to use for the Explorer
    const ExplorerWrapper = isMobile ? Drawer : Sheet;
    const ExplorerContent = isMobile ? DrawerContent : SheetContent;
    const ExplorerHeader = isMobile ? DrawerHeader : SheetHeader;
    const ExplorerTitle = isMobile ? DrawerTitle : SheetTitle;


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
                    <CoachMainHeader 
                        onClick={() => setIsBioDrawerOpen(true)} 
                        onExploreMore={() => setIsExplorerOpen(true)} // NEW PROP HANDLER
                    />
                    <TodaysMessage />
                    <CoachUpdates />
                </div>

                {/* Shared Files Column */}
                <div className="lg:col-span-1 space-y-6">
                    <SharedFilesCard />
                </div>
            </div>

            {/* Coach Bio Modal/Drawer (Existing Logic) */}
            {isMobile ? (
                <Drawer open={isBioDrawerOpen} onOpenChange={setIsBioDrawerOpen}>
                    <DrawerContent>
                        <CoachBioDrawer />
                    </DrawerContent>
                </Drawer>
            ) : (
                <Sheet open={isBioDrawerOpen} onOpenChange={setIsBioDrawerOpen}>
                    <SheetContent side="right" className="w-full sm:max-w-md">
                        <CoachBioDrawer />
                    </SheetContent>
                </Sheet>
            )}

            {/* NEW: Coach Explorer Modal/Drawer */}
            <ExplorerWrapper open={isExplorerOpen} onOpenChange={setIsExplorerOpen}>
                <ExplorerContent className={isMobile ? "h-[90%] max-h-[90vh]" : "w-full sm:max-w-md"}>
                    <ExplorerHeader>
                        <ExplorerTitle>Find a New Coach</ExplorerTitle>
                    </ExplorerHeader>
                    <CoachExplorerDrawer 
                        onClose={() => setIsExplorerOpen(false)}
                        onNewCoachRequestSent={handleNewCoachRequestSent} 
                    />
                </ExplorerContent>
            </ExplorerWrapper>

            {/* Shared Files Drawer for Mobile (Existing Logic) */}
            {isMobile && (
                <Drawer open={isFilesDrawerOpen} onOpenChange={setIsFilesDrawerOpen}>
                    <DrawerContent>
                        <SharedFilesDrawerContent />
                    </DrawerContent>
                </Drawer>
            )}

            {/* Floating Action Button */}
            <RequestFeedbackFab isMobile={isMobile} onRequestFeedback={handleFeedbackRequest} />

            {/* Feedback Pop-up Message */}
            <FeedbackMessagePopup
                message={feedbackPopup.message}
                isVisible={feedbackPopup.isVisible}
                onDismiss={() => setFeedbackPopup(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
};

export default MyCoach;
