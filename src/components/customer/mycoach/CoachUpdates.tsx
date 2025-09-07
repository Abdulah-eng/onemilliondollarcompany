// src/components/customer/mycoach/CoachUpdates.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { feedbackHistory } from '@/mockdata/mycoach/coachData';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, History } from 'lucide-react';

const emojiRatings = ['😞', '😕', '😐', '🙂', '😃', '😁', '🤩'];

const CoachUpdates = () => {
  const isPremiumUser = true; // TODO: Fetch from user_roles or plans table
  const [checkInRating, setCheckInRating] = useState<number | null>(null);

  if (!isPremiumUser) {
    return (
      <Card className="shadow-lg border-none animate-fade-in p-6 text-center">
        <h3 className="text-xl font-bold">Coach Updates</h3>
        <p className="mt-2 text-muted-foreground">
          Upgrade to a <strong>Premium Plan</strong> to see your coach's updates! 🚀
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {feedbackHistory.length > 0 ? (
        feedbackHistory.map((update) => {
          const isFeedback = update.type === 'Program Feedback';
          const isCheckIn = update.type === 'Check-in';
          const isInfo = update.type === 'Pinpoint';

          return (
            <Card key={update.id} className="shadow-md rounded-2xl hover:shadow-lg transition">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {isFeedback && '💬'}
                      {isCheckIn && '📍'}
                      {isInfo && '📊'}
                    </span>
                    <CardTitle className="text-base md:text-lg font-semibold truncate">
                      {update.title}
                    </CardTitle>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{update.date}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{update.message}</p>

                {/* Feedback card (reply UI) */}
                {isFeedback && (
                  <div className="pt-4 border-t border-gray-200">
                    <Textarea placeholder="Type your response here..." className="mb-2" />
                    <Button size="sm">Send Response</Button>
                  </div>
                )}

                {/* Check-in card (emoji rating + comment) */}
                {isCheckIn && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="font-medium text-sm mb-2">How are things going?</p>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {emojiRatings.map((emoji, index) => {
                        const ratingValue = index + 1;
                        return (
                          <button
                            key={ratingValue}
                            onClick={() => setCheckInRating(ratingValue)}
                            className={`text-2xl transition-transform ${
                              checkInRating === ratingValue ? 'scale-125' : 'opacity-60 hover:opacity-100'
                            }`}
                          >
                            {emoji}
                          </button>
                        );
                      })}
                    </div>
                    <Textarea placeholder="Add a comment..." className="mb-2" />
                    <Button size="sm">Submit Check-in</Button>
                  </div>
                )}

                {/* Info card (no response UI) */}
                {isInfo && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-muted-foreground">
                      This is an informational update. No response needed.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
          <CheckCircle2 size={48} className="mb-4 text-primary" />
          <p>No recent updates. You're on track!</p>
        </div>
      )}

      {/* History Button */}
      <div className="flex justify-center pt-2">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <History className="w-4 h-4" />
          View All Past Updates
        </Button>
      </div>
    </div>
  );
};

export default CoachUpdates;
