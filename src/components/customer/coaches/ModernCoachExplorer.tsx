// src/components/customer/coaches/ModernCoachExplorer.tsx
import { useState } from 'react';
import { allCoaches, Coach } from '@/mockdata/mycoach/coachData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CircleUserRound, Zap, MessageSquare, Star, Send, Search, Filter, History, Loader2, BarChart3, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; // 💡 Added Input for search
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge'; // 💡 Added Badge component

interface CoachCardProps {
    coach: Coach;
    onRequest: (coach: Coach) => void;
    index: number;
}

const ModernCoachCard: React.FC<CoachCardProps> = ({ coach, onRequest, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }} // Faster sequential animation
        className="group"
    >
        <Card className="shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Subtle background gradient on card for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 z-0" />
            <CardContent className="relative p-6 z-10">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                    
                    {/* Coach Avatar and Status */}
                    <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all shadow-md">
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
                        {/* Status badge: Use pulse for modern feel */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-75" />
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {coach.name}
                        </h4>
                        
                        {/* Stats Section */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-semibold text-foreground/80">{coach.rating.toFixed(1)}</span>
                                <span>({coach.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-primary" />
                                <span className='font-medium'>{coach.yearsExperience}+ Years Exp.</span>
                            </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                            {coach.bio}
                        </p>
                        
                        {/* Specialties Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {coach.specialties.slice(0, 3).map((specialty, idx) => (
                                <Badge 
                                    key={idx} 
                                    variant="secondary"
                                    className="text-xs bg-primary/10 text-primary py-1.5 px-3 rounded-full font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
                                >
                                    {specialty}
                                </Badge>
                            ))}
                            {coach.specialties.length > 3 && (
                                <Badge variant="outline" className="text-xs text-muted-foreground py-1.5 px-3">
                                    +{coach.specialties.length - 3} more
                                </Badge>
                            )}
                        </div>
                        
                        {/* Action Button */}
                        <Button 
                            onClick={() => onRequest(coach)} 
                            className="w-full sm:w-auto shadow-md transition-all duration-300"
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
                        <h3 className="text-xl font-semibold">Coach History</h3>
                        <p className="text-sm text-muted-foreground">Previous coaching relationships</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-primary/5">
                    View All
                </Button>
            </div>
            <div className="border-2 border-dashed rounded-xl p-8 text-center bg-card">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                    <Clock className="w-6 h-6 text-muted-foreground" />
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
    const [searchTerm, setSearchTerm] = useState('');

    const handleRequest = (coach: Coach) => {
        setSelectedCoach(coach);
        setIsDialogOpen(true);
        // Pre-populate message for better user guidance
        setRequestMessage(`I'm interested in working with ${coach.name} because of their expertise in ${coach.specialties[0]} and I'm looking to achieve [specific goal, e.g., muscle gain/marathon prep].`);
    };

    const handleSendRequest = () => {
        if (!selectedCoach || requestMessage.trim().length < 10) return;

        setIsRequestLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setIsRequestLoading(false);
            setIsDialogOpen(false);
            onNewCoachRequestSent(selectedCoach.name);
            setSelectedCoach(null);
            setRequestMessage('');
        }, 1500);
    };

    // Filter logic
    const filteredCoaches = allCoaches.filter(coach => 
        coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            {/* Header and Controls (Combined for mobile friendliness) */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="text-2xl font-bold text-foreground">Coach Marketplace</h2>
                    <p className="text-muted-foreground text-sm hidden sm:block">
                        Find the perfect coach for your evolving fitness journey
                    </p>
                </div>

                {/* Search and Filter Inputs - More Prominent and Unified */}
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            type="search" 
                            placeholder="Search by name, specialty, or focus..." 
                            className="w-full pl-9 h-10 border-2 rounded-xl focus-visible:ring-primary/50 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0 hover:bg-primary/5 rounded-xl">
                        <Filter className="w-5 h-5" />
                        <span className="sr-only">Filter</span>
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Coach Grid */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                    Top Picks ({filteredCoaches.length} coaches found)
                </h3>
                {filteredCoaches.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredCoaches.map((coach, index) => (
                            <ModernCoachCard 
                                key={coach.id} 
                                coach={coach} 
                                onRequest={handleRequest} 
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="shadow-lg border-0 rounded-2xl">
                        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                            <Search className="w-8 h-8 text-muted-foreground mb-4" />
                            <h4 className="font-semibold mb-2">No Coaches Match</h4>
                            <p className="text-muted-foreground text-sm">
                                Try adjusting your search or filter settings.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Coach History Section */}
            <CoachHistorySection />

            {/* Request Dialog (Model/Popup) */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-2xl p-6">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <BarChart3 className='w-5 h-5 text-primary' />
                            Request {selectedCoach?.name}
                        </DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground">
                            Let us know why you'd like to partner with **{selectedCoach?.name}**. This message will be sent to our management team for approval.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <div className="space-y-3">
                            <Label htmlFor="message" className="text-sm font-medium">
                                Your Goal & Motivation
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="Share your fitness goals and why this coach is the right fit for you..."
                                value={requestMessage}
                                onChange={(e) => setRequestMessage(e.target.value)}
                                rows={5}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {requestMessage.length}/10 characters minimum
                            </p>
                        </div>
                    </div>
                    
                    <DialogFooter className="gap-2 pt-4">
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
                                isRequestLoading && "opacity-80"
                            )}
                        >
                            {isRequestLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
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
