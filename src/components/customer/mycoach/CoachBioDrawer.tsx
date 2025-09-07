// src/components/customer/mycoach/CoachBioDrawer.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { coachInfo } from '@/mockdata/mycoach/coachData';
import { Badge } from '@/components/ui/badge';
import { CircleUserRound } from 'lucide-react';

const CoachBioDrawer = () => {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-background overflow-hidden">
          {coachInfo.profileImageUrl ? (
            <img src={coachInfo.profileImageUrl} alt={coachInfo.name} className="object-cover w-full h-full" />
          ) : (
            <CircleUserRound className="w-16 h-16 text-primary" />
          )}
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{coachInfo.name}</h2>
          <p className="text-sm text-muted-foreground">Certified Fitness & Nutrition Coach</p>
        </div>
      </div>

      <Card className="shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">About Sophia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">{coachInfo.bio}</p>
          <div className="flex flex-wrap gap-2">
            {coachInfo.specialties.map(specialty => (
              <Badge key={specialty} variant="secondary">{specialty}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* TODO: Add more sections like certifications, experience, etc. */}
    </div>
  );
};

export default CoachBioDrawer;
