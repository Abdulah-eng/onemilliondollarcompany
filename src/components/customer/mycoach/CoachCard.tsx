// src/components/customer/mycoach/CoachCard.tsx
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { coachInfo } from '@/mockdata/mycoach/coachData';
import { CircleUserRound, ChevronRight, MessageSquare, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const CoachCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Coach Preview Card (Main UI) */}
      <Card
        className="relative w-full overflow-hidden border-0 shadow-lg rounded-xl cursor-pointer hover:shadow-xl transition-shadow animate-fade-in-down"
        onClick={() => setIsOpen(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-amber-500 rounded-xl" />
        <CardContent className="relative p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white overflow-hidden">
              {coachInfo.profileImageUrl ? (
                <img src={coachInfo.profileImageUrl} alt={coachInfo.name} className="object-cover w-full h-full" />
              ) : (
                <CircleUserRound className="w-10 h-10 text-white" />
              )}
            </div>
            <div>
              <p className="text-sm text-white/80 font-medium">Your Coach</p>
              <h2 className="text-xl font-bold text-white">{coachInfo.name}</h2>
            </div>
          </div>
          <Button variant="ghost" className="text-white/80 hover:text-white">
            <ChevronRight />
          </Button>
        </CardContent>
      </Card>

      {/* Full Coach Card (Dialog/Modal) */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>About Your Coach</DialogTitle>
            <DialogDescription>
              {coachInfo.name} is here to help you on your journey.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center p-4">
            <div className="w-32 h-32 rounded-full mb-4 overflow-hidden">
              <img src={coachInfo.profileImageUrl} alt={coachInfo.name} className="object-cover w-full h-full" />
            </div>
            <h3 className="text-2xl font-bold">{coachInfo.name}</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">{coachInfo.bio}</p>
            <div className="flex space-x-4 mt-6">
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" /> Message
              </Button>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" /> Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CoachCard;
