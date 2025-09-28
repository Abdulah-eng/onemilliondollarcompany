// src/components/customer/mycoach/CoachMainHeader.tsx
import { Card, CardContent } from '@/components/ui/card';
import { coachInfo } from '@/mockdata/mycoach/coachData';
import { CircleUserRound, ChevronRight, Search } from 'lucide-react'; // Import Search
import { Button } from '@/components/ui/button'; // Import Button

// Add onExploreMore prop
const CoachMainHeader = ({ onClick, onExploreMore }: { onClick: () => void, onExploreMore: () => void }) => {
    return (
        <Card
            // NOTE: Removed onClick from the Card itself to allow the buttons to work independently
            className="relative w-full overflow-hidden border-0 shadow-lg rounded-3xl hover:shadow-xl transition-shadow animate-fade-in-down"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 opacity-80 rounded-3xl" />
            <CardContent className="relative p-4 md:p-6 text-white flex items-center justify-between min-w-0">
                <div className="flex items-center space-x-4 min-w-0 flex-wrap">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center border-2 border-white overflow-hidden" onClick={onClick} style={{ cursor: 'pointer' }}>
                        {coachInfo.profileImageUrl ? (
                            <img src={coachInfo.profileImageUrl} alt={coachInfo.name} className="object-cover w-full h-full" />
                        ) : (
                            <CircleUserRound className="w-12 h-12 text-white" />
                        )}
                    </div>
                    <div className="min-w-0" onClick={onClick} style={{ cursor: 'pointer' }}>
                        <p className="text-sm text-white/80 font-medium">Your Coach</p>
                        <h2 className="text-xl md:text-2xl font-bold overflow-hidden whitespace-nowrap text-ellipsis">{coachInfo.name}</h2>
                    </div>
                </div>
                
                {/* New button for exploring other coaches, a modern and distinct action */}
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 bg-white/20 hover:bg-white/30 text-white border-white/50"
                    onClick={onExploreMore}
                >
                    <Search className="w-4 h-4 mr-2" />
                    Explore Coaches
                </Button>

                {/* Optional: A subtle button to view current coach bio */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 ml-2 text-white hover:bg-white/20"
                    onClick={onClick}
                >
                    <ChevronRight className="w-6 h-6" />
                </Button>

            </CardContent>
        </Card>
    );
};

export default CoachMainHeader;
