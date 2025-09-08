import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Calendar, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { customerProfile } from '@/mockdata/profile/profileData';

const ProfileInfo = () => {
  const { personalInfo } = customerProfile;

  return (
    <div className="space-y-6">
      <Card className="shadow-md rounded-2xl overflow-hidden p-6 text-center">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
            <img
              src={personalInfo.profileImageUrl}
              alt={personalInfo.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {personalInfo.fullName}
            <CheckCircle className="w-5 h-5 text-primary-500" />
          </h2>
          <p className="text-muted-foreground text-sm">{personalInfo.role}</p>
          <div className="mt-4 flex gap-2">
            <Button size="sm">Subscribe</Button>
            <Button size="sm" variant="outline">Edit profile</Button>
          </div>
        </div>
      </Card>

      <Card className="shadow-md rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
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
          {customerProfile.goals.map((goal, index) => (
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

export default ProfileInfo;
