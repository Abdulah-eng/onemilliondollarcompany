// src/components/customer/mycoach/EnhancedCoachUpdates.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { feedbackHistory } from '@/mockdata/mycoach/coachData';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, History, X, MessageCircle, MapPin, BarChart3, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const emojiRatings = ['😞', '😕', '😐', '🙂', '😃', '😁', '🤩'];

const getUpdateIcon = (type: string) => {
    switch (type) {
        case 'Program Feedback': return MessageCircle;
        case 'Check-in': return MapPin;
        case 'Pinpoint': return BarChart3;
        default: return MessageCircle;
    }
};

const getUpdateColor = (type: string) => {
    switch (type) {
        case 'Program Feedback': return 'from-blue-500/10 to-blue-600/5';
        case 'Check-in': return 'from-green-500/10 to-green-600/5';
        case 'Pinpoint': return 'from-purple-500/10 to-purple-600/5';
        default: return 'from-gray-500/10 to-gray-600/5';
    }
};

const EnhancedCoachUpdates = () => {
    const isPremiumUser = true;
    const [responses, setResponses] = useState<Record<number, string>>({});
    const [ratings, setRatings] = useState<Record<number, number>>({});
    const [submittedIds, setSubmittedIds] = useState<number[]>([]);
    const [dismissedInfoId, setDismissedInfoId] = useState<number | null>(null);

    const handleSubmit = (id: number) => {
        setSubmittedIds((prev) => [...prev, id]);
    };

    const handleDismissInfo = (id: number) => {
        setDismissedInfoId(id);
    };

    if (!isPremiumUser) {
        return (
            <Card className="shadow-xl border-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                        <span className="text-2xl">🚀</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Coach Updates</h3>
                    <p className="text-muted-foreground">
                        Upgrade to a <strong>Premium Plan</strong> to see your coach's updates!
                    </p>
                </CardContent>
            </Card>
        );
    }

    const recentUpdates = feedbackHistory
        .slice(0, 3)
        .filter((update) => update.id !== dismissedInfoId);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Recent Updates</h3>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <History className="w-4 h-4 mr-2" />
                    View All
                </Button>
            </div>

            <AnimatePresence>
                {recentUpdates
                    .filter((update) => !submittedIds.includes(update.id))
                    .map((update, index) => {
                        const isFeedback = update.type === 'Program Feedback';
                        const isCheckIn = update.type === 'Check-in';
                        const isInfo = update.type === 'Pinpoint';
                        const Icon = getUpdateIcon(update.type);
                        const colorGradient = getUpdateColor(update.type);

                        return (
                            <motion.div
                                key={update.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={isInfo ? { opacity: 0, x: 300, transition: { duration: 0.3 } } : { opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                drag={isInfo ? 'x' : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={(event, info) => {
                                    if (isInfo && Math.abs(info.point.x) > 50) {
                                        handleDismissInfo(update.id);
                                    }
                                }}
                                className={cn(
                                    "relative",
                                    isInfo && "cursor-grab active:cursor-grabbing"
                                )}
                            >
                                <Card className="shadow-lg rounded-2xl border-0 overflow-hidden hover:shadow-xl transition-all duration-300">
                                    <div className={cn("absolute inset-0 bg-gradient-to-br", colorGradient)} />
                                    <div className="relative bg-card/50 backdrop-blur-sm">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <div className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
                                                        <Icon className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <CardTitle className="text-base font-semibold truncate">
                                                            {update.title}
                                                        </CardTitle>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {update.date} • {update.type}
                                                        </p>
                                                    </div>
                                                </div>
                                                {isInfo && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="hidden sm:flex opacity-60 hover:opacity-100 transition-opacity"
                                                        onClick={() => handleDismissInfo(update.id)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-0 space-y-4">
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {update.message}
                                            </p>

                                            {/* Enhanced Feedback Section */}
                                            {isFeedback && (
                                                <div className="space-y-3">
                                                    <Textarea
                                                        value={responses[update.id] || ''}
                                                        onChange={(e) =>
                                                            setResponses((prev) => ({ ...prev, [update.id]: e.target.value }))
                                                        }
                                                        placeholder="Share your thoughts..."
                                                        className="min-h-[80px] bg-background/50 backdrop-blur-sm"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSubmit(update.id)}
                                                        disabled={!responses[update.id]?.trim()}
                                                        className="w-full sm:w-auto"
                                                    >
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Send Response
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Enhanced Check-in Section */}
                                            {isCheckIn && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="font-medium text-sm mb-3">How are you feeling today?</p>
                                                        <div className="flex items-center gap-1 mb-4 justify-center sm:justify-start">
                                                            {emojiRatings.map((emoji, index) => {
                                                                const ratingValue = index + 1;
                                                                return (
                                                                    <button
                                                                        key={ratingValue}
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setRatings((prev) => ({ ...prev, [update.id]: ratingValue }))
                                                                        }
                                                                        className={cn(
                                                                            "text-2xl p-2 rounded-full transition-all duration-200",
                                                                            ratings[update.id] === ratingValue
                                                                                ? 'scale-125 bg-primary/10'
                                                                                : 'opacity-60 hover:opacity-100 hover:scale-110'
                                                                        )}
                                                                    >
                                                                        {emoji}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                    <Textarea
                                                        value={responses[update.id] || ''}
                                                        onChange={(e) =>
                                                            setResponses((prev) => ({ ...prev, [update.id]: e.target.value }))
                                                        }
                                                        placeholder="Tell your coach how you're doing..."
                                                        className="bg-background/50 backdrop-blur-sm"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSubmit(update.id)}
                                                        disabled={
                                                            ratings[update.id] === undefined && !responses[update.id]?.trim()
                                                        }
                                                        className="w-full sm:w-auto"
                                                    >
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Submit Check-in
                                                    </Button>
                                                </div>
                                            )}

                                            {submittedIds.includes(update.id) && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span className="text-sm font-medium">
                                                        {isFeedback ? 'Response submitted!' : 'Check-in submitted!'}
                                                    </span>
                                                </motion.div>
                                            )}
                                        </CardContent>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
            </AnimatePresence>

            {recentUpdates.length === 0 && (
                <Card className="shadow-lg border-0 rounded-2xl">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="font-semibold mb-2">All caught up!</h4>
                        <p className="text-muted-foreground text-sm">No recent updates. You're on track!</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default EnhancedCoachUpdates;