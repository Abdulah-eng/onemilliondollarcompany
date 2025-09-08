import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { customerProfile } from '@/mockdata/profile/profileData';

const GoalsAndPreferences = () => {
  const { preferences } = customerProfile;

  return (
    <div className="space-y-6">
      <Card className="shadow-md rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">App Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-select">Theme</Label>
            <Select>
              <SelectTrigger id="theme-select" className="w-[120px]">
                <SelectValue placeholder={preferences.theme} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="profile-visibility">Profile Visibility</Label>
            <Select>
              <SelectTrigger id="profile-visibility" className="w-[120px]">
                <SelectValue placeholder={preferences.privacy.profileVisibility} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="shadow-md rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="new-messages">New Messages</Label>
            <Switch checked={preferences.notifications.newMessages} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="coach-feedback">Coach Feedback</Label>
            <Switch checked={preferences.notifications.coachFeedback} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="progress-reminders">Progress Reminders</Label>
            <Switch checked={preferences.notifications.progressReminders} />
          </div>
        </div>
      </Card>
      
    </div>
  );
};

export default GoalsAndPreferences;
