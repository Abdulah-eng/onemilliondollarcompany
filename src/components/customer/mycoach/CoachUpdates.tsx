// src/components/customer/mycoach/CoachUpdates.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { feedbackHistory } from '@/mockdata/mycoach/coachData';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, History } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const emojiRatings = ['😞', '😕', '😐', '🙂', '😃', '😁', '🤩'];

const CoachUpdates = () => {
  const isPremiumUser = true;

  const [responses, setResponses] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [submittedIds, setSubmittedIds] = useState<string[]>([]);
  const [activeResponseId, setActiveResponseId] = useState<string | null>(null);

  const handleOpenResponse = (id: string) => setActiveResponseId(id);
  const handleSubmit = (id: string) => {
    setSubmittedIds((prev) => [...prev, id]);
    setActiveResponseId(null);

    // optional: auto-remove after 2s
    setTimeout(() => {
      setSubmittedIds((prev) => prev.filter((s) => s !== id));
      setResponses((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setRatings((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }, 2000);
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

  return (
    <div className="space-y-6 relative">
      <AnimatePresence>
        {feedbackHistory.map((update) => {
          if (submittedIds.includes(update.id)) return null;

          const isFeedback = update.type === 'Program Feedback';
          const isCheckIn = update.type === 'Check-in';
          const isInfo = update.type === 'Pinpoint';
          const isActive = activeResponseId === update.id;

          return (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-md rounded-2xl hover:shadow-lg transition relative">
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
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{update.message}</p>

                  {/* Info card has no response UI */}
                  {isInfo && null}

                  {/* Show button to open response for Feedback/Check-in */}
                  {(isFeedback || isCheckIn) && !isActive && (
                    <Button size="sm" onClick={() => handleOpenResponse(update.id)}>
                      {isFeedback ? 'Reply' : 'Respond'}
                    </Button>
                  )}

                  {/* Modal-like overlay for response */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-white/95 backdrop-blur-sm p-4 rounded-2xl flex flex-col gap-3 z-10"
                      >
                        {isCheckIn && (
                          <div className="flex flex-wrap gap-2">
                            {emojiRatings.map((emoji, index) => {
                              const ratingValue = index + 1;
                              return (
                                <button
                                  key={ratingValue}
                                  onClick={() =>
                                    setRatings((prev) => ({ ...prev, [update.id]: ratingValue }))
                                  }
                                  className={`text-2xl ${
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
                        )}

                        <Textarea
                          value={responses[update.id] || ''}
                          onChange={(e) =>
                            setResponses((prev) => ({ ...prev, [update.id]: e.target.value }))
                          }
                          placeholder={isFeedback ? 'Type your response...' : 'Add a comment...'}
                        />

                        <div className="flex gap-2 justify-end">
                          <Button size="sm" onClick={() => setActiveResponseId(null)} variant="outline">
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSubmit(update.id)}
                            disabled={
                              isCheckIn
                                ? ratings[update.id] === undefined && !responses[update.id]?.trim()
                                : !responses[update.id]?.trim()
                            }
                          >
                            Submit
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
    </div>
  );
};

export default CoachUpdates;
