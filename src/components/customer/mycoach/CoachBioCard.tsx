// src/components/customer/mycoach/CoachBioCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { coachInfo } from '@/mockdata/mycoach/coachData';
import { Badge } from '@/components/ui/badge';
import { CircleUserRound } from 'lucide-react';

const CoachBioCard = () => {
  return (
    <Card className="shadow-lg border-none animate-fade-in">
      <CardHeader className="p-0 relative">
        <div className="h-40 bg-gray-200 rounded-t-xl" style={{ backgroundImage: `url(${coachInfo.profileImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
        </div>
        <div className="absolute top-24 left-6 flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-background overflow-hidden">
            {coachInfo.profileImageUrl ? (
              <img src={coachInfo.profileImageUrl} alt={coachInfo.name} className="object-cover w-full h-full" />
            ) : (
              <CircleUserRound className="w-16 h-16 text-primary" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-foreground mt-8">{coachInfo.name}</h2>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-16 space-y-4">
        <div className="flex flex-wrap gap-2">
          {coachInfo.specialties.map(specialty => (
            <Badge key={specialty} variant="secondary">{specialty}</Badge>
          ))}
        </div>
        <p className="text-muted-foreground leading-relaxed">{coachInfo.bio}</p>
      </CardContent>
    </Card>
  );
};

export default CoachBioCard;
