// src/components/customer/mycoach/CoachUpdates.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { feedbackHistory } from '@/mockdata/mycoach/coachData';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Pin, MessageSquare, BarChart2, Star } from 'lucide-react';

const CoachUpdates = () => {
    const isPremiumUser = true; // TODO: Fetch from user_roles or plans table
    const [response, setResponse] = useState('');
    const [checkInRating, setCheckInRating] = useState(0);

    if (!isPremiumUser) {
        return (
            <Card className="shadow-lg border-none animate-fade-in p-6 text-center">
                <h3 className="text-xl font-bold">Coach Updates</h3>
                <p className="mt-2 text-muted-foreground">Upgrade to a **Premium Plan** to see your coach's updates! 🚀</p>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg border-none animate-fade-in">
            <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-xl font-semibold">Coach Updates</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
                {feedbackHistory.length > 0 ? (
                    <div className="space-y-6">
                        {feedbackHistory.map(update => (
                            <div key={update.id} className="space-y-2 p-4 border rounded-xl bg-secondary/20">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        {update.type === 'Program Feedback' && <MessageSquare className="w-5 h-5 text-purple-500" />}
                                        {update.type === 'Check-in' && <Pin className="w-5 h-5 text-orange-500" />}
                                        {update.type === 'Pinpoint' && <BarChart2 className="w-5 h-5 text-green-500" />}
                                    </div>
                                    <div className="flex-1 space-y-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-base md:text-lg overflow-hidden whitespace-nowrap text-ellipsis">{update.title}</h4>
                                            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{update.date}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{update.message}</p>

                                        {/* Check-in response UI */}
                                        {update.type === 'Check-in' && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="font-medium text-sm mb-2">How are things going?</p>
                                                <div className="flex items-center space-x-1 mb-2">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`w-5 h-5 cursor-pointer transition-colors ${checkInRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                            onClick={() => setCheckInRating(star)}
                                                        />
                                                    ))}
                                                </div>
                                                <Textarea placeholder="Add a comment..." className="mb-2" />
                                                <Button size="sm">Submit Check-in</Button>
                                            </div>
                                        )}

                                        {/* General feedback response UI */}
                                        {update.type !== 'Check-in' && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <Textarea placeholder="Type your response here..." className="mb-2" />
                                                <Button size="sm">Send Response</Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                        <CheckCircle2 size={48} className="mb-4 text-primary" />
                        <p>No recent updates. You're on track!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CoachUpdates;
