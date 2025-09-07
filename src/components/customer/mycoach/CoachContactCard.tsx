// src/components/customer/mycoach/CoachContactCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageSquare } from 'lucide-react';
import { coachInfo } from '@/mockdata/mycoach/coachData';

const CoachContactCard = () => {
  return (
    <Card className="shadow-lg border-none h-fit animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Contact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Have a question? Reach out to your coach directly.</p>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-3 h-12">
            <Mail className="w-5 h-5 text-primary" />
            <a href={`mailto:${coachInfo.email}`} className="text-foreground">Send an Email</a>
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 h-12">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="text-foreground">Send a Message</span>
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 h-12" disabled>
            <Phone className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">Schedule a Call (Coming Soon)</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachContactCard;
