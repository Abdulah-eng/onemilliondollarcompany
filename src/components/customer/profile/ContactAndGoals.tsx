import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { customerProfile } from '@/mockdata/profile/profileData';

const ContactAndGoals = () => {
  const { personalInfo, goals } = customerProfile;

  return (
    <div className="space-y-6">
      <Card className="shadow-md rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">Contact & Personal Info</h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-3 text-sm text-muted-foreground">
            <Mail className="w-4 h-4 shrink-0" />
            <span>{personalInfo.email}</span>
          </li>
          <li className="flex items-center gap-3 text-sm text-muted-foreground">
            <Phone className="w-4 h-4 shrink-0" />
            <span>{personalInfo.phoneNumber}</span>
          </li>
          <li className="flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{personalInfo.location}</span>
          </li>
          <li className="flex items-center gap-3 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{personalInfo.joinedDate}</span>
          </li>
        </ul>
      </Card>
      
      <Card className="shadow-md rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">Your Goals</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {goals.map((goal, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-500 mt-1 shrink-0">●</span>
              <span>{goal}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Button variant="outline" size="sm">Edit Goals</Button>
        </div>
      </Card>
    </div>
  );
};

export default ContactAndGoals;
