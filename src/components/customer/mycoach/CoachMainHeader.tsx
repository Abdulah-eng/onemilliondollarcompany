// src/components/customer/mycoach/CoachMainHeader.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { coachInfo } from '@/mockdata/mycoach/coachData';

interface CoachMainHeaderProps {
    onClick: () => void;
}

const CoachMainHeader: React.FC<CoachMainHeaderProps> = ({ onClick }) => {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={coachInfo.profileImageUrl} alt={coachInfo.name} />
                        <AvatarFallback>
                            <User className="w-8 h-8" />
                        </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">{coachInfo.name}</h2>
                            <p className="text-sm text-muted-foreground">Your Personal Coach</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {coachInfo.specialties.map((specialty, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                    {specialty}
                                </Badge>
                            ))}
                        </div>
                        
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={onClick}
                            className="mt-2"
                        >
                            View Full Bio
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CoachMainHeader;