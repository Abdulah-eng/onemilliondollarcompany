// src/components/customer/coaches/ModernCoachExplorer.tsx
import { useState, useEffect } from 'react';
import { Coach } from '@/mockdata/mycoach/coachData';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { CircleUserRound, Zap, MessageSquare, Star, Send, Search, Filter, History, Loader2, BarChart3, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Define the available filter options (using "All" for clear reset)
type FilterOption = 'All' | 'Fitness' | 'Nutrition' | 'Mental Health';
const FILTER_OPTIONS: FilterOption[] = ['All', 'Fitness', 'Nutrition', 'Mental Health'];

// --- CoachCard and History Section components remain largely unchanged ---
interface CoachCardProps {
    coach: Coach;
    onRequest: (coach: Coach) => void;
    index: number;
    requestStatus?: 'pending' | 'accepted' | 'rejected' | null;
}
const ModernCoachCard: React.FC<CoachCardProps> = ({ coach, onRequest, index, requestStatus }) => (
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
                        
                        <Button 
                            onClick={() => onRequest(coach)} 
                            className="w-full sm:w-auto shadow-md transition-all duration-300"
                            disabled={requestStatus === 'pending' || requestStatus === 'accepted'}
                            variant={requestStatus === 'rejected' ? 'outline' : 'default'}
                        >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {requestStatus === 'pending' && 'Request Sent'}
                            {requestStatus === 'accepted' && 'Already Your Coach'}
                            {requestStatus === 'rejected' && 'Request Again'}
                            {!requestStatus && 'Request Coach'}
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
    const { user } = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
    const [requestMessage, setRequestMessage] = useState('');
    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [coachRequests, setCoachRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch coaches and requests
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            
            try {
                // Fetch all coaches
                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('role', 'coach');

                if (profilesError) throw profilesError;

                // Convert profiles to Coach format  
                const coachesData: Coach[] = (profilesData || []).map((profile, index) => ({
                    id: index + 1, // Use numeric id for compatibility with Coach interface
                    profileId: profile.id, // Store actual profile ID separately
                    name: profile.full_name || 'Coach',
                    profileImageUrl: profile.avatar_url || '',
                    bio: 'Experienced fitness coach dedicated to helping you achieve your goals.',
                    specialties: ['Fitness', 'Nutrition'], // Default specialties
                    rating: 4.8,
                    reviews: 42,
                    yearsExperience: 5
                } as Coach & { profileId: string }));

                // Fetch user's requests
                const { data: requestsData, error: requestsError } = await supabase
                    .from('coach_requests')
                    .select('*')
                    .eq('customer_id', user.id);

                if (requestsError) throw requestsError;

                setCoaches(coachesData);
                setCoachRequests(requestsData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleRequest = (coach: Coach) => {
        const coachProfileId = (coach as any).profileId || coach.id.toString();
        const existingRequest = coachRequests.find(req => req.coach_id === coachProfileId);
        if (existingRequest?.status === 'pending' || existingRequest?.status === 'accepted') {
            return; // Don't open dialog if request exists
        }
        
        setSelectedCoach(coach);
        setIsDialogOpen(true);
        setRequestMessage(`I'm interested in working with ${coach.name} because of their expertise in ${coach.specialties[0]} and I'm looking to achieve [specific goal, e.g., muscle gain/marathon prep].`);
    };

    const handleSendRequest = async () => {
        if (!selectedCoach || !user || requestMessage.trim().length < 10) return;

        const coachProfileId = (selectedCoach as any).profileId || selectedCoach.id.toString();
        setIsRequestLoading(true);
        try {
            const { error } = await supabase.from('coach_requests').insert({
                customer_id: user.id,
                coach_id: coachProfileId,
                message: requestMessage.trim(),
                status: 'pending'
            });

            if (error) throw error;

            // Refresh requests
            const { data: updatedRequests } = await supabase
                .from('coach_requests')
                .select('*')
                .eq('customer_id', user.id);
            
            setCoachRequests(updatedRequests || []);
            setIsDialogOpen(false);
            onNewCoachRequestSent(selectedCoach.name);
            setSelectedCoach(null);
            setRequestMessage('');
        } catch (error) {
            console.error('Error sending request:', error);
        } finally {
            setIsRequestLoading(false);
        }
    };

    // Map specialties to broader categories for filtering
    const mapSpecialtyToCategory = (specialty: string): string => {
        const lower = specialty.toLowerCase();
        if (lower.includes('hiit') || lower.includes('strength') || lower.includes('endurance') || lower.includes('bodybuilding') || lower.includes('weight loss')) {
            return 'fitness';
        }
        if (lower.includes('yoga') || lower.includes('mindfulness') || lower.includes('stress') || lower.includes('mental')) {
            return 'mental health';
        }
        if (lower.includes('nutrition') || lower.includes('macro') || lower.includes('diet')) {
            return 'nutrition';
        }
        return lower;
    };

    // Get request status for a coach
    const getRequestStatus = (coach: Coach & { profileId?: string }): 'pending' | 'accepted' | 'rejected' | null => {
        const coachProfileId = (coach as any).profileId || coach.id.toString();
        const request = coachRequests.find(req => req.coach_id === coachProfileId);
        return request?.status || null;
    };

    // Comprehensive Filter Logic
    const filteredCoaches = coaches
        .filter(coach => {
            // 1. Filter by Category
            if (activeFilter !== 'All') {
                const hasMatchingSpecialty = coach.specialties.some(specialty => 
                    mapSpecialtyToCategory(specialty) === activeFilter.toLowerCase()
                );
                if (!hasMatchingSpecialty) {
                    return false;
                }
            }
            
            // 2. Filter by Search Term
            if (searchTerm.trim() === '') {
                return true;
            }
            const lowerCaseSearch = searchTerm.toLowerCase();
            return (
                coach.name.toLowerCase().includes(lowerCaseSearch) ||
                coach.bio.toLowerCase().includes(lowerCaseSearch) ||
                coach.specialties.some(s => s.toLowerCase().includes(lowerCaseSearch))
            );
        });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading coaches...</p>
                </div>
            </div>
        );
    }

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

                {/* Search and Filter Inputs - FIXED Search */}
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            type="search" 
                            placeholder="Search by name, specialty, or focus..." 
                            className="w-full pl-9 h-10 border-2 rounded-xl focus-visible:ring-primary/50 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // 💡 Search state updated
                        />
                    </div>
                    {/* Filter Button opens the dialog */}
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className={cn("h-10 w-10 flex-shrink-0 rounded-xl", activeFilter !== 'All' && 'border-primary text-primary bg-primary/10')}
                        onClick={() => setIsFilterOpen(true)}
                    >
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
                                requestStatus={getRequestStatus(coach)}
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

            {/* Request Dialog */}
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

            {/* 💡 Filter Dialog - FIXED Filters */}
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-2xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <Filter className='w-5 h-5 text-primary' />
                            Filter Coaches
                        </DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground">
                            Narrow down the list by primary area of expertise.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-3 py-4">
                        {FILTER_OPTIONS.map(option => (
                            <Button
                                key={option}
                                variant={activeFilter === option ? 'default' : 'outline'}
                                onClick={() => {
                                    setActiveFilter(option);
                                    setIsFilterOpen(false); // Close dialog on select for mobile friendliness
                                }}
                                className={cn("h-12 text-base rounded-xl transition-all", activeFilter !== option && "hover:bg-primary/5")}
                            >
                                {option}
                            </Button>
                        ))}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button variant="ghost" onClick={() => setIsFilterOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ModernCoachExplorer;
