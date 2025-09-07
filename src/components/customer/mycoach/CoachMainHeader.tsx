// src/components/customer/mycoach/CoachMainHeader.tsx
import { Card, CardContent } from '@/components/ui/card';
import { coachInfo } from '@/mockdata/mycoach/coachData';
import { CircleUserRound, ChevronRight } from 'lucide-react';

const CoachMainHeader = ({ onClick }: { onClick: () => void }) => {
    return (
        <Card
            className="relative w-full overflow-hidden border-0 shadow-lg rounded-3xl cursor-pointer hover:shadow-xl transition-shadow animate-fade-in-down"
            onClick={onClick}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 opacity-80 rounded-3xl" />
            <CardContent className="relative p-4 md:p-6 text-white flex items-center justify-between min-w-0">
                <div className="flex items-center space-x-4 min-w-0 flex-wrap">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center border-2 border-white overflow-hidden">
                        {coachInfo.profileImageUrl ? (
                            <img src={coachInfo.profileImageUrl} alt={coachInfo.name} className="object-cover w-full h-full" />
                        ) : (
                            <CircleUserRound className="w-12 h-12 text-white" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm text-white/80 font-medium">Your Coach</p>
                        <h2 className="text-xl md:text-2xl font-bold overflow-hidden whitespace-nowrap text-ellipsis">{coachInfo.name}</h2>
                    </div>
                </div>
                <ChevronRight className="w-6 h-6 text-white flex-shrink-0" />
            </CardContent>
        </Card>
    );
};

export default CoachMainHeader;
