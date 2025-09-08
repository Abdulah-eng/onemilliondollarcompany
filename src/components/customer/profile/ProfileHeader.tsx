import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { customerProfile } from '@/mockdata/profile/profileData';

const ProfileHeader = () => {
  const { personalInfo } = customerProfile;
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl w-full">
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-r from-purple-500 to-pink-500 z-0" />
      <div className="relative p-6 sm:p-8 z-10 flex flex-col items-center justify-center">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 mb-4 shadow-lg">
          <img
            src={personalInfo.profileImageUrl}
            alt={personalInfo.fullName}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-1">
          {personalInfo.fullName}
          <CheckCircle className="w-5 h-5 text-primary-500" />
        </h2>
        <p className="text-sm text-muted-foreground mb-4">{personalInfo.role}</p>
        <div className="flex gap-2">
          <Button size="sm">Subscribe</Button>
          <Button size="sm" variant="outline">Edit profile</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
