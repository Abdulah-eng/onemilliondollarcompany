// src/pages/customer/MyCoach.tsx
import { useState } from 'react';
import useMediaQuery from '@/hooks/use-media-query';
import CoachMainHeader from '@/components/customer/mycoach/CoachMainHeader';
import TodaysMessage from '@/components/customer/mycoach/TodaysMessage';
import CoachUpdates from '@/components/customer/mycoach/CoachUpdates';
import SharedFilesCard from '@/components/customer/mycoach/SharedFilesCard';
import RequestFeedbackFab from '@/components/customer/mycoach/RequestFeedbackFab';
import CoachBioDrawer from '@/components/customer/mycoach/CoachBioDrawer';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import SharedFilesDrawerContent from '@/components/customer/mycoach/SharedFilesDrawerContent';

const MyCoach = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isFilesDrawerOpen, setIsFilesDrawerOpen] = useState(false);

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
                <div className="md:col-span-2 space-y-6 min-w-0">
                    <CoachMainHeader onClick={() => setIsDrawerOpen(true)} />
                    <TodaysMessage />
                    <CoachUpdates />
                </div>

                {/* Right Column (1/3 width on desktop) */}
                <div className="md:col-span-1 space-y-6 min-w-0">
                    {!isMobile && <SharedFilesCard />}
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
            <RequestFeedbackFab
                isMobile={isMobile}
                onOpenFilesDrawer={() => setIsFilesDrawerOpen(true)}
            />
        </div>
    );
};

export default MyCoach;
