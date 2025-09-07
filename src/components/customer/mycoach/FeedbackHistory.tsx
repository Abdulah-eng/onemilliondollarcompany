// src/components/customer/mycoach/FeedbackHistory.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { feedbackHistory } from '@/mockdata/mycoach/coachData';
import { Button } from '@/components/ui/button';
import { MessageSquare, CheckCircle2, Pin } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const FeedbackHistory = () => {
  const isPremiumUser = true; // TODO: Fetch from user_roles or plans table
  const [response, setResponse] = useState('');

  if (!isPremiumUser) {
    return (
      <Card className="shadow-lg border-none animate-fade-in p-6 text-center">
        <h3 className="text-xl font-bold">Feedback History</h3>
        <p className="mt-2 text-muted-foreground">Upgrade to a **Premium Plan** to get direct feedback from your coach! 🚀</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-none animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {feedbackHistory.length > 0 ? (
          <div className="space-y-6">
            {feedbackHistory.map(feedback => (
              <div key={feedback.id} className="space-y-2 p-4 border rounded-xl bg-secondary/20">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {feedback.type === 'Feedback' ? (
                      <MessageSquare className="w-5 h-5 text-primary" />
                    ) : (
                      <Pin className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{feedback.title}</h4>
                      <span className="text-xs text-muted-foreground">{feedback.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{feedback.message}</p>
                  </div>
                </div>
                {/* Respond Functionality */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Textarea 
                    placeholder="Type your response here..." 
                    value={response} 
                    onChange={(e) => setResponse(e.target.value)} 
                    className="mb-2" 
                  />
                  <Button size="sm" disabled={!response}>Send Response</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
            <CheckCircle2 size={48} className="mb-4 text-primary" />
            <p>No recent feedback. You're on track!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackHistory;
