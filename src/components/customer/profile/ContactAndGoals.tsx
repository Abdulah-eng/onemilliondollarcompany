import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { customerProfile } from '@/mockdata/profile/profileData';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useProfileUpdates } from '@/hooks/useProfileUpdates';
import { toast } from 'sonner';

const ContactAndGoals = () => {
  const { personalInfo, goals } = customerProfile;
  const [phone, setPhone] = useState(personalInfo.phoneNumber || '');
  const [location, setLocation] = useState(personalInfo.location || '');
  const [goalEdits, setGoalEdits] = useState<string[]>(goals);
  const { updateProfile, updateOnboarding, loading } = useProfileUpdates();

  const handleSave = async () => {
    const ok = await updateProfile({ phone });
    if (!ok) {
      toast.error('Failed to save profile');
      return;
    }
    const saved = await updateOnboarding({ goals: goalEdits, location });
    if (!saved) {
      toast.error('Failed to save goals');
      return;
    }
    toast.success('Profile updated');
  };

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
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="h-8" />
          </li>
          <li className="flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" />
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="h-8" />
          </li>
          <li className="flex items-center gap-3 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{personalInfo.joinedDate}</span>
          </li>
        </ul>
      </Card>
      
      <Card className="shadow-md rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">Your Goals</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          {goalEdits.map((goal, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-green-500 mt-2 shrink-0">●</span>
              <Input value={goal} onChange={(e) => {
                const g = [...goalEdits];
                g[index] = e.target.value;
                setGoalEdits(g);
              }} />
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setGoalEdits(prev => [...prev, ''])}>Add Goal</Button>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} disabled={loading}>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
};

export default ContactAndGoals;
