// src/components/customer/mycoach/ExploreCoachesCard.tsx (NEW)
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight } from 'lucide-react';

interface ExploreCoachesCardProps {
    onExplore: () => void;
}

const ExploreCoachesCard: React.FC<ExploreCoachesCardProps> = ({ onExplore }) => {
    return (
        <Card 
            className="shadow-lg border-2 border-dashed border-primary/50 hover:border-primary transition-all cursor-pointer bg-primary/5"
            onClick={onExplore}
        >
            <CardContent className="p-4 md:p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
                        <Search className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-base md:text-lg text-foreground">
                            Explore New Coaches
                        </h4>
                        <p className="text-sm text-muted-foreground hidden sm:block">
                            Ready for a change? Discover experts in other specialities.
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="flex-shrink-0 text-primary">
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </CardContent>
        </Card>
    );
};

export default ExploreCoachesCard;
