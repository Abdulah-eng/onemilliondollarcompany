// src/components/customer/mycoach/RequestFeedbackFab.tsx
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';

const RequestFeedbackFab = () => {
  return (
    <div className="fixed bottom-6 right-6 md:hidden z-40">
      <Button
        className="rounded-full w-14 h-14 shadow-lg"
        // TODO: Add functionality to trigger a "Request Feedback" action
      >
        <MessageSquarePlus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default RequestFeedbackFab;
