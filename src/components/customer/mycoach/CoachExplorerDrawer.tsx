// src/components/customer/mycoach/CoachExplorerDrawer.tsx
import { useState } from 'react';
import { allCoaches, Coach } from '@/mockdata/mycoach/coachData';
import { Button } from '@/components/ui/button';
import { CircleUserRound, Zap, MessageSquare, Star, Send } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Component for a single coach's card in the explorer
const CoachCard = ({ coach, onRequest }: { coach: Coach, onRequest: (coach: Coach) => void }) => (
    <div className="flex items-start p-4 border rounded-xl bg-background shadow-sm hover:shadow-md transition-shadow">
        <div className="w-16 h-16 rounded-full flex-shrink-0 bg-primary/10 overflow-hidden">
            {coach.profileImageUrl ? (
                <img src={coach.profileImageUrl} alt={coach.name} className="object-cover w-full h-full" />
            ) : (
                <CircleUserRound className="w-12 h-12 text-primary/70" />
            )}
        </div>
        <div className="ml-4 flex-1 min-w-0">
            <h4 className="text-lg font-bold">{coach.name}</h4>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                    <span>{coach.rating.toFixed(1)}</span>
                    <span className="ml-1">({coach.reviews} reviews)</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center">
                    <Zap className="w-4 h-4 mr-1 text-orange-500" />
                    {coach.yearsExperience}+ Yrs Exp
                </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{coach.bio}</p>
            <div className="mt-3 flex flex-wrap gap-2">
                {coach.specialties.slice(0, 3).map(s => (
                    <span key={s} className="text-xs bg-primary/10 text-primary py-1 px-2 rounded-full font-medium">
                        {s}
                    </span>
                ))}
            </div>
            <Button size="sm" className="mt-4" onClick={() => onRequest(coach)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Request This Coach
            </Button>
        </div>
    </div>
);

// Main Coach Explorer Drawer Content
interface CoachExplorerDrawerProps {
    onClose: () => void;
    onNewCoachRequestSent: (coachName: string) => void;
}

const CoachExplorerDrawer: React.FC<CoachExplorerDrawerProps> = ({ onClose, onNewCoachRequestSent }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
    const [requestMessage, setRequestMessage] = useState('');
    const [isRequestLoading, setIsRequestLoading] = useState(false);

    const handleRequest = (coach: Coach) => {
        setSelectedCoach(coach);
        setIsDialogOpen(true);
    };

    const handleSendRequest = () => {
        if (!selectedCoach || requestMessage.trim().length < 10) return;

        setIsRequestLoading(true);
        // Simulate API call and closing both the modal and the main drawer/sheet
        setTimeout(() => {
            console.log(`Request sent to ${selectedCoach.name}: ${requestMessage}`);
            setIsRequestLoading(false);
            setIsDialogOpen(false);
            onClose(); // Close the main drawer/sheet
            
            // Notify the parent component (main page) to show the popup
            onNewCoachRequestSent(selectedCoach.name);
            
            // Reset state
            setSelectedCoach(null);
            setRequestMessage('');
        }, 1500);
    };

    return (
        <div className="h-full overflow-y-auto p-6 md:p-8 space-y-6">
            <h3 className="text-2xl font-bold">Explore Our Coaches 🤝</h3>
            <p className="text-muted-foreground">
                Found a new specialization? Request a switch to an expert coach that fits your evolving needs.
            </p>
            <Separator />
            <div className="space-y-6">
                {allCoaches.map(coach => (
                    <CoachCard key={coach.id} coach={coach} onRequest={handleRequest} />
                ))}
            </div>

            {/* Coach Request Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Request {selectedCoach?.name} as your Coach</DialogTitle>
                        <DialogDescription>
                            Tell us why you'd like to switch. Your current coach will be notified of your request.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="message">Reason for Switching (Min 10 characters)</Label>
                            <Textarea
                                id="message"
                                placeholder="E.g., I'm now focusing on Olympic lifting, and Alex specializes in that area."
                                value={requestMessage}
                                onChange={(e) => setRequestMessage(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleSendRequest}
                            disabled={isRequestLoading || requestMessage.trim().length < 10}
                        >
                            <Send className="w-4 h-4 mr-2" />
                            {isRequestLoading ? 'Sending Request...' : 'Confirm Request'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CoachExplorerDrawer;
