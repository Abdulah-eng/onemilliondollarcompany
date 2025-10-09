import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Edit, Camera, CreditCard, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePaymentPlan } from '@/hooks/usePaymentPlan';
import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { useProfileUpdates } from '@/hooks/useProfileUpdates';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ProfileHeaderProps {
  isGlobalEditing?: boolean;
}

const ProfileHeader = ({ isGlobalEditing = false }: ProfileHeaderProps) => {
  const { profile } = useAuth();
  const { planStatus, startTrial } = usePaymentPlan();
  const { updateProfile, loading } = useProfileUpdates();
  const navigate = useNavigate();
  const [editName, setEditName] = useState(profile?.full_name || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isStartingTrial, setIsStartingTrial] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
        setHasUnsavedChanges(false);
        toast.success('Name updated successfully');
      } else {
        toast.error('Failed to update name');
      }
    } catch (error) {
      console.error('Name update error:', error);
      toast.error('Failed to update name');
    }
  };

  const handleCancel = () => {
    setEditName(profile?.full_name || '');
    setHasUnsavedChanges(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      // For now, use data URL approach (base64) since storage bucket doesn't exist
      // This works immediately without any setup
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          const success = await updateProfile({ avatar_url: dataUrl });
          if (success) {
            toast.success('Profile image updated successfully');
            setHasUnsavedChanges(true);
          } else {
            toast.error('Failed to update profile image');
          }
        }
        setIsUploadingImage(false);
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
      setIsUploadingImage(false);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleStartTrial = async () => {
    setIsStartingTrial(true);
    try {
      const result = await startTrial();
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('14-day trial started! Enjoy your premium features.');
      }
    } catch (error) {
      console.error('Trial start error:', error);
      toast.error('Failed to start trial');
    } finally {
      setIsStartingTrial(false);
    }
  };

  const handleManageBilling = () => {
    navigate('/customer/payment/update-plan');
  };

  const handleCancelSubscription = () => {
    navigate('/customer/payment/cancel-subscription');
  };
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl w-full">
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-r from-purple-500 to-pink-500 z-0" />
      <div className="relative p-6 sm:p-8 z-10 flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 mb-4 shadow-lg group">
          <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
          {isGlobalEditing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={triggerImageUpload}>
              <Camera className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
        {isGlobalEditing && (
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={triggerImageUpload}
              disabled={isUploadingImage}
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              {isUploadingImage ? 'Uploading...' : 'Change Photo'}
            </Button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {isGlobalEditing ? (
          <div className="flex items-center gap-2 mb-4">
            <Input
              value={editName}
              onChange={(e) => {
                setEditName(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="text-2xl font-bold text-center bg-white/90 border-2 border-primary/50"
              placeholder="Enter your name"
            />
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
        <div className="flex gap-2 flex-wrap justify-center">
          {!planStatus.hasActivePlan ? (
            // No active plan - show trial or subscribe options
            <>
              {!planStatus.hasUsedTrial && (
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleStartTrial}
                  disabled={isStartingTrial}
                >
                  {isStartingTrial ? 'Starting...' : 'Start 14-Day Trial'}
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleManageBilling}
                className="flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Subscribe
              </Button>
            </>
          ) : (
            // Has active plan - show manage billing and cancel options
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleManageBilling}
                className="flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Manage Billing
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={handleCancelSubscription}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
