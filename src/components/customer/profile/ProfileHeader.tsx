import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Edit, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePaymentPlan } from '@/hooks/usePaymentPlan';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useProfileUpdates } from '@/hooks/useProfileUpdates';
import { toast } from 'sonner';

const ProfileHeader = () => {
  const { profile } = useAuth();
  const { planStatus } = usePaymentPlan();
  const { updateProfile, loading } = useProfileUpdates();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.full_name || '');
  
  const avatar = profile?.avatar_url || 'https://placehold.co/256x256/6b7280/fff?text=Avatar';
  const fullName = profile?.full_name || profile?.email || 'Your Profile';
  const role = profile?.role === 'coach' ? 'Coach' : 'Customer';

  const handleSaveName = async () => {
    if (!editName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    try {
      const success = await updateProfile({ full_name: editName.trim() });
      if (success) {
        setIsEditing(false);
        toast.success('Name updated successfully');
      } else {
        toast.error('Failed to update name');
      }
    } catch (error) {
      console.error('Name update error:', error);
      toast.error('Failed to update name');
    }
  };
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl w-full">
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-r from-purple-500 to-pink-500 z-0" />
      <div className="relative p-6 sm:p-8 z-10 flex flex-col items-center justify-center">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 mb-4 shadow-lg">
          <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
        </div>
        {isEditing ? (
          <div className="flex items-center gap-2 mb-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="text-2xl font-bold text-center bg-white/90 border-2 border-primary/50"
              placeholder="Enter your name"
            />
            <Button 
              size="sm" 
              onClick={handleSaveName}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditName(profile?.full_name || '');
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-1">
            {fullName}
            <CheckCircle className="w-5 h-5 text-primary-500" />
          </h2>
        )}
        <p className="text-sm text-muted-foreground mb-4">
          {role} • {planStatus.hasActivePlan ? 'Premium Member' : 'Free Member'}
        </p>
        <div className="flex gap-2">
          {!planStatus.hasActivePlan && (
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Subscribe
            </Button>
          )}
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit Name
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
