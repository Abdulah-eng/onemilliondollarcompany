// src/components/customer/mycoach/RequestFeedbackFab.tsx
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageSquarePlus, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const RequestFeedbackFab = ({ isMobile }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [requestMade, setRequestMade] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const handleRequestFeedback = () => {
        // Here you would typically make an API call to send the request
        // For this example, we'll just update the state
        if (requestMade) {
            setFeedbackMessage('You have already made a request, your coach will reach out very soon');
        } else {
            setRequestMade(true);
            setFeedbackMessage('Your coach will reach out soon');
        }
        setIsMenuOpen(false); // Close the popover after clicking
    };

    const fabButton = (
        <Button className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50">
            <MessageSquarePlus className="w-6 h-6" />
        </Button>
    );

    const popoverContent = (
        <PopoverContent className="w-48 p-2 mb-2">
            <Button className="w-full justify-start h-12" onClick={handleRequestFeedback}>
                <Send className="mr-2 h-4 w-4" />
                Request Feedback
            </Button>
        </PopoverContent>
    );

    const messageContent = (
        <PopoverContent className="w-64 p-4 mb-2 flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">{feedbackMessage}</span>
        </PopoverContent>
    );

    // Determines which PopoverContent to display
    const currentContent = requestMade ? messageContent : popoverContent;

    return (
        <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <PopoverTrigger asChild>
                {fabButton}
            </PopoverTrigger>
            {currentContent}
        </Popover>
    );
};

export default RequestFeedbackFab;
