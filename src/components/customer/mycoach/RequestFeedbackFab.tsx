// src/components/customer/mycoach/RequestFeedbackFab.tsx
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageSquarePlus, Send } from 'lucide-react';

// The component now accepts a prop to handle the request
const RequestFeedbackFab = ({ isMobile, onRequestFeedback }) => {
    const fabButton = (
        <Button className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50">
            <MessageSquarePlus className="w-6 h-6" />
        </Button>
    );

    // This is the action for the popover button
    const handleAction = () => {
        onRequestFeedback();
    };

    // Mobile View: Uses a popover for a single action
    if (isMobile) {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    {fabButton}
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 mb-2">
                    <Button className="w-full justify-start h-12" onClick={handleAction}>
                        <Send className="mr-2 h-4 w-4" />
                        Request Feedback
                    </Button>
                </PopoverContent>
            </Popover>
        );
    }

    // Desktop View: Uses a popover for a single action
    return (
        <Popover>
            <PopoverTrigger asChild>
                {fabButton}
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 mb-2">
                <Button className="w-full justify-start h-12" onClick={handleAction}>
                    <Send className="mr-2 h-4 w-4" />
                    Request Feedback
                </Button>
            </PopoverContent>
        </Popover>
    );
};

export default RequestFeedbackFab;
