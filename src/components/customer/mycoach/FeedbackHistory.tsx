// src/components/customer/mycoach/FeedbackHistory.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { feedbackHistory } from '@/mockdata/mycoach/coachData';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

const FeedbackHistory = () => {
  const isPremiumUser = true; // TODO: Fetch from user_roles or plans table [cite: 147, 159]

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
          <div className="space-y-4">
            {feedbackHistory.map(feedback => (
              <div key={feedback.id} className="flex items-start gap-4 p-4 border rounded-xl bg-secondary/20">
                <div className="flex-shrink-0 mt-1">
                  <feedback.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{feedback.title}</h4>
                    <span className="text-xs text-muted-foreground">{feedback.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{feedback.message}</p>
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
