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
  const [successMessageId, setSuccessMessageId] = useState<string | null>(null);

  const handleSubmit = (id: string) => {
    setSubmittedIds((prev) => [...prev, id]);
    setSuccessMessageId(id);

    // Remove the success message after 2s
    setTimeout(() => setSuccessMessageId(null), 2000);
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
    <div className="space-y-6">
      <AnimatePresence>
        {feedbackHistory
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
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
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
                        {successMessageId === update.id && (
                          <p className="text-green-600 mt-2">Response submitted!</p>
                        )}
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
                        {successMessageId === update.id && (
                          <p className="text-green-600 mt-2">Check-in submitted!</p>
                        )}
                      </>
                    )}

                    {/* Info card */}
                    {isInfo && null}
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
