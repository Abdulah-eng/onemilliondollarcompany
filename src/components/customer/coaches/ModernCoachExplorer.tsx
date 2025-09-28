// src/components/customer/coaches/ModernCoachExplorer.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CircleUserRound, Zap, MessageSquare, Star, Send, Search, Filter, History, Loader2, Clock, Eye } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useEnhancedCoaches, EnhancedCoach } from '@/hooks/useEnhancedCoaches';
import { CoachDetailModal } from './CoachDetailModal';
import { toast } from 'sonner';

// Define the available filter options
type FilterOption = 'All' | 'Fitness' | 'Nutrition' | 'Mental Health';
const FILTER_OPTIONS: FilterOption[] = ['All', 'Fitness', 'Nutrition', 'Mental Health'];

interface CoachCardProps {
    coach: EnhancedCoach;
    onRequest: (coach: EnhancedCoach) => void;
    onViewDetails: (coach: EnhancedCoach) => void;
    index: number;
    requestStatus?: 'pending' | 'accepted' | 'rejected' | null;
}

const ModernCoachCard: React.FC<CoachCardProps> = ({ coach, onRequest, onViewDetails, index, requestStatus }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group"
    >
        <Card className="shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 z-0" />
            <CardContent className="relative p-6 z-10">
                <div className="flex flex-col sm:flex-row items-start gap-4">
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
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-75" />
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {coach.name}
                        </h4>
                        
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
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            {coach.skills.slice(0, 3).map((skill, idx) => (
                                <Badge 
                                    key={idx} 
                                    variant="secondary"
                                    className="text-xs bg-primary/10 text-primary py-1.5 px-3 rounded-full font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
                                >
                                    {skill}
                                </Badge>
                            ))}
                            {coach.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs text-muted-foreground py-1.5 px-3">
                                    +{coach.skills.length - 3} more
                                </Badge>
                            )}
                        </div>
                        
                        <div className="flex gap-2">
                            <Button 
                                onClick={() => onViewDetails(coach)} 
                                variant="outline"
                                size="sm"
                                className="gap-2 flex-1"
                            >
                                <Eye className="w-4 h-4" />
                                View Details
                            </Button>
                            <Button 
                                onClick={() => onRequest(coach)} 
                                size="sm"
                                className="gap-2 flex-1"
                                disabled={requestStatus === 'pending' || requestStatus === 'accepted'}
                                variant={requestStatus === 'rejected' ? 'outline' : 'default'}
                            >
                                <MessageSquare className="w-4 h-4" />
                                {requestStatus === 'pending' && 'Request Sent'}
                                {requestStatus === 'accepted' && 'Already Your Coach'}
                                {requestStatus === 'rejected' && 'Request Again'}
                                {!requestStatus && 'Request Coach'}
                            </Button>
                        </div>
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
    const { coaches, loading, sendRequest, getRequestStatus } = useEnhancedCoaches();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState<EnhancedCoach | null>(null);
    const [requestMessage, setRequestMessage] = useState('');
    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

    const handleRequest = (coach: EnhancedCoach) => {
        const requestStatus = getRequestStatus(coach.id);
        if (requestStatus === 'pending' || requestStatus === 'accepted') {
            return;
        }
        
        setSelectedCoach(coach);
        setIsDialogOpen(true);
        setRequestMessage(`I'm interested in working with ${coach.name} because of their expertise and I'm looking to achieve my fitness goals.`);
    };

    const handleViewDetails = (coach: EnhancedCoach) => {
        setSelectedCoach(coach);
        setIsDetailModalOpen(true);
    };

    const handleSendRequest = async () => {
        if (!selectedCoach || requestMessage.trim().length < 10) return;

        setIsRequestLoading(true);
        try {
            await sendRequest(selectedCoach.id, requestMessage.trim());
            toast.success(`Request sent to ${selectedCoach.name}!`);
            onNewCoachRequestSent(selectedCoach.name);
            setIsDialogOpen(false);
            setRequestMessage('');
        } catch (error) {
            toast.error('Failed to send request. Please try again.');
        } finally {
            setIsRequestLoading(false);
        }
    };

    const mapSkillToCategory = (skill: string): FilterOption => {
        const fitnessSkills = ['strength training', 'hiit', 'yoga', 'pilates', 'bodybuilding', 'endurance', 'weight loss', 'functional training'];
        const nutritionSkills = ['meal planning', 'sports nutrition', 'weight management', 'dietary restrictions', 'supplements', 'macro coaching'];
        const mentalHealthSkills = ['mindfulness', 'stress management', 'motivation coaching', 'habit formation', 'work-life balance', 'goal setting'];
        
        const lowerSkill = skill.toLowerCase();
        if (fitnessSkills.some(s => lowerSkill.includes(s))) return 'Fitness';
        if (nutritionSkills.some(s => lowerSkill.includes(s))) return 'Nutrition';
        if (mentalHealthSkills.some(s => lowerSkill.includes(s))) return 'Mental Health';
        return 'Fitness'; // Default
    };

    const filteredCoaches = coaches.filter(coach => {
        const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             coach.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             coach.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesFilter = activeFilter === 'All' || 
                             coach.skills.some(skill => mapSkillToCategory(skill) === activeFilter);
        
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search coaches by name, expertise, or skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background/50 border-primary/20 focus:border-primary/40 h-12"
                    />
                </div>
                <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <Button 
                        variant="outline" 
                        onClick={() => setIsFilterOpen(true)}
                        className="gap-2 h-12 px-6"
                    >
                        <Filter className="w-4 h-4" />
                        Filter: {activeFilter}
                    </Button>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Filter Coaches</DialogTitle>
                            <DialogDescription>
                                Choose a specialty to filter coaches by their expertise.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-3 py-4">
                            {FILTER_OPTIONS.map((option) => (
                                <Button
                                    key={option}
                                    variant={activeFilter === option ? "default" : "outline"}
                                    onClick={() => {
                                        setActiveFilter(option);
                                        setIsFilterOpen(false);
                                    }}
                                    className="justify-start"
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Results */}
            <div className="grid gap-6">
                {filteredCoaches.length > 0 ? (
                    <>
                        <div className="text-sm text-muted-foreground">
                            Showing {filteredCoaches.length} coach{filteredCoaches.length !== 1 ? 'es' : ''}
                            {searchTerm && ` matching "${searchTerm}"`}
                            {activeFilter !== 'All' && ` in ${activeFilter}`}
                        </div>
                        {filteredCoaches.map((coach, index) => (
                            <ModernCoachCard
                                key={coach.id}
                                coach={coach}
                                onRequest={handleRequest}
                                onViewDetails={handleViewDetails}
                                index={index}
                                requestStatus={getRequestStatus(coach.id)}
                            />
                        ))}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No coaches found</h3>
                        <p className="text-muted-foreground">
                            Try adjusting your search terms or filters to find coaches.
                        </p>
                    </div>
                )}
            </div>

            <Separator className="my-8" />
            <CoachHistorySection />

            {/* Request Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Send Coach Request</DialogTitle>
                        <DialogDescription>
                            Send a personalized message to {selectedCoach?.name} to start your coaching journey.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="message">Your Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Tell the coach about your goals and why you'd like to work with them..."
                                value={requestMessage}
                                onChange={(e) => setRequestMessage(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                Minimum 10 characters ({requestMessage.length}/10)
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSendRequest}
                            disabled={requestMessage.trim().length < 10 || isRequestLoading}
                            className="gap-2"
                        >
                            {isRequestLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            Send Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Coach Detail Modal */}
            <CoachDetailModal
                coach={selectedCoach}
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                onRequest={handleRequest}
                requestStatus={selectedCoach ? getRequestStatus(selectedCoach.id) : null}
            />
        </div>
    );
};

export default ModernCoachExplorer;