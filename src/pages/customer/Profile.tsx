import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import ProfileHeader from '@/components/customer/profile/ProfileHeader';
import PersonalInfoSection from '@/components/customer/profile/PersonalInfoSection';
import PaymentAndLegal from '@/components/customer/profile/PaymentAndLegal';
import PaymentHistoryTable from '@/components/customer/profile/PaymentHistoryTable';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // For now, just show success message
      // TODO: Implement actual save functionality
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelAll = () => {
    // For now, just exit edit mode
    // TODO: Implement actual cancel functionality
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="px-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="mt-1 text-lg text-muted-foreground">View all your profile details here.</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSaveAll} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save All'}
                </Button>
                <Button variant="outline" onClick={() => {
                  handleCancelAll();
                  setIsEditing(false);
                }}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProfileHeader isGlobalEditing={isEditing} />
          <PersonalInfoSection isGlobalEditing={isEditing} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <PaymentAndLegal />
          <PaymentHistoryTable />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
