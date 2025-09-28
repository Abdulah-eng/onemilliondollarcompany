// src/pages/customer/MyCoach.tsx
import { useState } from 'react';
import useMediaQuery from '@/hooks/use-media-query';

// Import from the strictly separated directories
import CurrentCoachTab from '@/components/customer/mycoach/CurrentCoachTab'; // From mycoach folder
import ExplorerTab from '@/components/customer/coaches/ExplorerTab'; // From coaches folder
import CoachBioDrawer from '@/components/customer/mycoach/CoachBioDrawer';
import { SharedFilesDrawerContent } from '@/components/customer/mycoach/UnifiedSharedFiles';
import SmartFeedbackSystem from '@/components/customer/mycoach/SmartFeedbackSystem';

// UI Components
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; 

import { coachInfo } from '@/mockdata/mycoach/coachData'; 
import { User, Search } from 'lucide-react'; 

const MyCoach = () => {
    const hasCurrentCoach = !!coachInfo.name;
    const initialTab = hasCurrentCoach ? 'myCoach' : 'explore';
    const [activeTab, setActiveTab] = useState(initialTab);

    const [isBioDrawerOpen, setIsBioDrawerOpen] = useState(false);
    const [isFilesDrawerOpen, setIsFilesDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [feedbackPopup, setFeedbackPopup] = useState({
        isVisible: false,
        message: '',
        requested: false,
    });

    // DRY: Helper to centralize showing the popup message
    const showPopup = (message: string, requested = false) => {
        setFeedbackPopup({ isVisible: true, message, requested });
        setTimeout(() => {
            setFeedbackPopup(prev => ({ ...prev, isVisible: false }));
        }, 5000);
    };

    const handleFeedbackRequest = () => {
        if (feedbackPopup.requested) {
            showPopup(`You already requested feedback. Your coach ${coachInfo.name} will reach out soon.`, true);
        } else {
            showPopup("Feedback requested! Your coach will reach out soon.", true);
        }
    };

    const handleNewCoachRequestSent = (coachName: string) => {
        showPopup(`Your request for ${coachName} has been sent! We'll process the switch shortly.`);
        if (hasCurrentCoach) {
             setActiveTab('myCoach');
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-8">
            <div className="px-2">
                <h1 className="text-3xl font-bold text-foreground">Coaching Hub 🚀</h1>
                <p className="mt-1 text-lg text-muted-foreground">Your complete coach management center.</p>
            </div>
            
            <Tabs 
                defaultValue={initialTab} 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="w-full"
            >
                {/* 1. TAB LIST */}
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger 
                        value="myCoach" 
                        onClick={() => setActiveTab('myCoach')}
                        disabled={!hasCurrentCoach}
                    >
                        <User className="w-4 h-4 mr-2"/> My Coach
                    </TabsTrigger>
                    <TabsTrigger value="explore" onClick={() => setActiveTab('explore')}>
                        <Search className="w-4 h-4 mr-2"/> Explore & History
                    </TabsTrigger>
                </TabsList>

                {/* 2. TAB CONTENT */}
                
                {/* --- CONTENT 1: MY COACH --- */}
                {hasCurrentCoach && (
                    <TabsContent value="myCoach">
                        <CurrentCoachTab
                            isMobile={isMobile}
                            onViewBio={() => setIsBioDrawerOpen(true)}
                            onRequestFeedback={handleFeedbackRequest}
                        />
                    </TabsContent>
                )}
                
                {/* --- CONTENT 2: EXPLORE & HISTORY --- */}
                <TabsContent value="explore">
                    <ExplorerTab
                        onNewCoachRequestSent={handleNewCoachRequestSent}
                    />
                </TabsContent>
            </Tabs>


            {/* MODAL/DRAWER LAYERS (Non-Tab Overlays) */}
            
            {/* Coach Bio Modal/Drawer (Triggered from CurrentCoachTab) */}
            {isMobile ? (
                <Drawer open={isBioDrawerOpen} onOpenChange={setIsBioDrawerOpen}>
                    <DrawerContent><CoachBioDrawer /></DrawerContent>
                </Drawer>
            ) : (
                <Sheet open={isBioDrawerOpen} onOpenChange={setIsBioDrawerOpen}>
                    <SheetContent side="right" className="w-full sm:max-w-md"><CoachBioDrawer /></SheetContent>
                </Sheet>
            )}

            {/* Shared Files Drawer for Mobile (Kept for completeness) */}
            {isMobile && (
                <Drawer open={isFilesDrawerOpen} onOpenChange={setIsFilesDrawerOpen}>
                    <DrawerContent><SharedFilesDrawerContent /></DrawerContent>
                </Drawer>
            )}

            {/* Smart Feedback System - Global */}
            <SmartFeedbackSystem
                message={feedbackPopup.message}
                isVisible={feedbackPopup.isVisible}
                onDismiss={() => setFeedbackPopup(prev => ({ ...prev, isVisible: false }))}
                type="success"
            />
        </div>
    );
};

export default MyCoach;
