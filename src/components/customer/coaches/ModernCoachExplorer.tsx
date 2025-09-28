// src/components/customer/coaches/ModernCoachExplorer.tsx
import { useState } from 'react';
import { allCoaches, Coach } from '@/mockdata/mycoach/coachData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CircleUserRound, Zap, MessageSquare, Star, Send, Search, Filter, History } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CoachCardProps {
    coach: Coach;
    onRequest: (coach: Coach) => void;
    index: number;
}

const ModernCoachCard: React.FC<CoachCardProps> = ({ coach, onRequest, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="group"
    >
        <Card className="shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <CardContent className="relative p-6">
                <div className="flex items-start gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all">
                            {coach.profileImageUrl ? (
                                <img 
                                    src={coach.profileImageUrl} 
                                    alt={coach.name} 
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                                />
                            ) : (
                                <CircleUserRound className="w-8 h-8 text-primary/70" />
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {coach.name}
                        </h4>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-medium">{coach.rating.toFixed(1)}</span>
                                <span>({coach.reviews})</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-orange-500" />
                                <span>{coach.yearsExperience}+ years</span>
                            </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                            {coach.bio}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            {coach.specialties.slice(0, 3).map((specialty, idx) => (
                                <span 
                                    key={idx} 
                                    className="text-xs bg-primary/10 text-primary py-1.5 px-3 rounded-full font-medium border border-primary/20"
                                >
                                    {specialty}
                                </span>
                            ))}
                            {coach.specialties.length > 3 && (
                                <span className="text-xs text-muted-foreground py-1.5 px-2">
                                    +{coach.specialties.length - 3} more
                                </span>
                            )}
                        </div>
                        
                        <Button 
                            onClick={() => onRequest(coach)} 
                            className="w-full group-hover:shadow-md transition-all duration-300"
                        >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Request Coach
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

const CoachHistorySection = () => (
    <Card className="shadow-lg border-0 rounded-2xl bg-gradient-to-br from-accent/5 to-secondary/5">
        <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                        <History className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Coach History</h3>
                        <p className="text-sm text-muted-foreground">Previous coaching relationships</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-primary/5">
                    View All
                </Button>
            </div>
            <div className="border-2 border-dashed rounded-xl p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                    <History className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                    No previous coaches on record. This will be your first coaching journey!
                </p>
            </div>
        </CardContent>
    </Card>
);

interface ModernCoachExplorerProps {
    onNewCoachRequestSent: (coachName: string) => void;
}

const ModernCoachExplorer: React.FC<ModernCoachExplorerProps> = ({ onNewCoachRequestSent }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
    const [requestMessage, setRequestMessage] = useState('');
    const [isRequestLoading, setIsRequestLoading] = useState(false);

    const handleRequest = (coach: Coach) => {
        setSelectedCoach(coach);
        setIsDialogOpen(true);
        setRequestMessage(`I'm interested in working with ${coach.name} because of their expertise in ${coach.specialties[0]}.`);
    };

    const handleSendRequest = () => {
        if (!selectedCoach || requestMessage.trim().length < 10) return;

        setIsRequestLoading(true);
        setTimeout(() => {
            setIsRequestLoading(false);
            setIsDialogOpen(false);
            onNewCoachRequestSent(selectedCoach.name);
            setSelectedCoach(null);
            setRequestMessage('');
        }, 1500);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Explore Coaches</h2>
                    <p className="text-muted-foreground text-sm">
                        Find the perfect coach for your evolving fitness journey
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="hover:bg-primary/5">
                        <Search className="w-4 h-4 mr-2" />
                        Search
                    </Button>
                    <Button variant="outline" size="sm" className="hover:bg-primary/5">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Coach Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {allCoaches.map((coach, index) => (
                    <ModernCoachCard 
                        key={coach.id} 
                        coach={coach} 
                        onRequest={handleRequest} 
                        index={index}
                    />
                ))}
            </div>

            {/* Coach History Section */}
            <CoachHistorySection />

            {/* Request Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-2xl">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-xl">
                            Request {selectedCoach?.name} as Your Coach
                        </DialogTitle>
                        <DialogDescription className="text-base">
                            Share why you'd like to work with this coach. We'll review your request and facilitate the transition.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <div className="space-y-3">
                            <Label htmlFor="message" className="text-sm font-medium">
                                Tell us about your goals (minimum 10 characters)
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="Share your fitness goals and why this coach is the right fit for you..."
                                value={requestMessage}
                                onChange={(e) => setRequestMessage(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                {requestMessage.length}/10 characters minimum
                            </p>
                        </div>
                    </div>
                    
                    <DialogFooter className="gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isRequestLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSendRequest}
                            disabled={isRequestLoading || requestMessage.trim().length < 10}
                            className={cn(
                                "min-w-[140px]",
                                isRequestLoading && "cursor-not-allowed"
                            )}
                        >
                            {isRequestLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                                    Sending...
                                </div>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Request
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ModernCoachExplorer;