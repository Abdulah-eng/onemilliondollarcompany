// src/components/customer/mycoach/CoachUpdates.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { feedbackHistory } from '@/mockdata/mycoach/coachData';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, History, X } from 'lucide-react'; // Import the X icon
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names

const emojiRatings = ['😞', '😕', '😐', '🙂', '😃', '😁', '🤩'];

const CoachUpdates = () => {
  const isPremiumUser = true;

  const [responses, setResponses] = useState<Record<number, string>>({});
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [submittedIds, setSubmittedIds] = useState<number[]>([]);

  // We need a separate state to handle dismissing the 'Info' card
  const [dismissedInfoId, setDismissedInfoId] = useState<number | null>(null);

  const handleSubmit = (id: number) => {
    setSubmittedIds((prev) => [...prev, id]);
  };

  // New dismiss function for the Info card
  const handleDismissInfo = (id: number) => {
    setDismissedInfoId(id);
  };

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

  // Only show the latest 3 updates, filter out the one that was dismissed
  const recentUpdates = feedbackHistory
    .slice(0, 3)
    .filter((update) => update.id !== dismissedInfoId);

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {recentUpdates
          .filter((update) => !submittedIds.includes(update.id))
          .map((update) => {
            const isFeedback = update.type === 'Program Feedback';
            const isCheckIn = update.type === 'Check-in';
            const isInfo = update.type === 'Pinpoint';

            return (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                // Different exit animation for the Info card
                exit={isInfo ? { opacity: 0, x: 300, transition: { duration: 0.3 } } : { opacity: 0, y: -10 }}
                transition={{ duration: isInfo ? 0.3 : 0.25 }}
                // Apply drag only to the Info card
                drag={isInfo ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(event, info) => {
                  if (isInfo && Math.abs(info.point.x) > 50) {
                    handleDismissInfo(update.id);
                  }
                }}
                className={isInfo ? 'relative cursor-pointer' : ''}
              >
                <Card className="shadow-md rounded-2xl hover:shadow-lg transition">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl">
                          {isFeedback && '💬'}
                          {isCheckIn && '📍'}
                          {isInfo && '📊'}
                        </span>
                        <CardTitle className="text-base md:text-lg font-semibold truncate">
                          {update.title}
                        </CardTitle>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                        {update.date}
                      </span>
                      {/* Add dismiss button for Info card on desktop */}
                      {isInfo && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            'hidden sm:inline-flex',
                            'ml-2' // Add a little margin to the left
                          )}
                          onClick={() => handleDismissInfo(update.id)}
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{update.message}</p>

                    {/* Feedback card */}
                    {isFeedback && (
                      <>
                        <Textarea
                          value={responses[update.id] || ''}
                          onChange={(e) =>
                            setResponses((prev) => ({ ...prev, [update.id]: e.target.value }))
                          }
                          placeholder="Type your response here..."
                          className="mb-2"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSubmit(update.id)}
                          disabled={!responses[update.id]?.trim()}
                        >
                          Send Response
                        </Button>
                        <p className="text-green-600 mt-2">
                          {submittedIds.includes(update.id) ? 'Response submitted!' : ''}
                        </p>
                      </>
                    )}

                    {/* Check-in card */}
                    {isCheckIn && (
                      <>
                        <p className="font-medium text-sm mb-2">How are things going?</p>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {emojiRatings.map((emoji, index) => {
                            const ratingValue = index + 1;
                            return (
                              <button
                                key={ratingValue}
                                type="button"
                                onClick={() =>
                                  setRatings((prev) => ({ ...prev, [update.id]: ratingValue }))
                                }
                                className={`text-2xl transition-transform ${
                                  ratings[update.id] === ratingValue
                                    ? 'scale-125'
                                    : 'opacity-60 hover:opacity-100'
                                }`}
                              >
                                {emoji}
                              </button>
                            );
                          })}
                        </div>
                        <Textarea
                          value={responses[update.id] || ''}
                          onChange={(e) =>
                            setResponses((prev) => ({ ...prev, [update.id]: e.target.value }))
                          }
                          placeholder="Add a comment..."
                          className="mb-2"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSubmit(update.id)}
                          disabled={
                            ratings[update.id] === undefined && !responses[update.id]?.trim()
                          }
                        >
                          Submit Check-in
                        </Button>
                        <p className="text-green-600 mt-2">
                          {submittedIds.includes(update.id) ? 'Check-in submitted!' : ''}
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
      </AnimatePresence>

      {/* History Button */}
      <div className="flex justify-center pt-2">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <History className="w-4 h-4" />
          View All Past Updates
        </Button>
      </div>

      {recentUpdates.length === 0 && (
        <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
          <CheckCircle2 size={48} className="mb-4 text-primary" />
          <p>No recent updates. You're on track!</p>
        </div>
      )}
    </div>
  );
};

export default CoachUpdates;
