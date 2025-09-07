// src/components/customer/mycoach/RequestFeedbackFab.tsx
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { MessageSquarePlus, FileText, Send } from 'lucide-react';

const RequestFeedbackFab = ({ isMobile, onOpenFilesDrawer }) => {
    // Mobile View: Uses a bottom drawer
    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger asChild>
                    <Button
                        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
                    >
                        <MessageSquarePlus className="w-6 h-6" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="p-4 rounded-t-2xl">
                    <div className="flex flex-col space-y-4">
                        <Button className="w-full justify-start h-12">
                            <Send className="mr-2 h-4 w-4" />
                            Request Feedback
                        </Button>
                        <Button className="w-full justify-start h-12" onClick={onOpenFilesDrawer}>
                            <FileText className="mr-2 h-4 w-4" />
                            Shared Files
                        </Button>
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    // Desktop View: Uses a popover
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
                >
                    <MessageSquarePlus className="w-6 h-6" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 mb-2">
                <Button className="w-full justify-start h-12">
                    <Send className="mr-2 h-4 w-4" />
                    Request Feedback
                </Button>
            </PopoverContent>
        </Popover>
    );
};

export default RequestFeedbackFab;
