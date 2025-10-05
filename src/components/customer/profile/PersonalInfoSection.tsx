import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MultiSelectButton } from '@/components/onboarding/MultiSelectButton';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileUpdates } from '@/hooks/useProfileUpdates';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Edit, Save, X, Plus, Trash2, Calendar, MapPin, Ruler, Weight, User, Flag, Heart, Activity, Brain, Mail, Phone } from 'lucide-react';

interface OnboardingDetails {
  id: string;
  user_id: string;
  weight: number | null;
  height: number | null;
  gender: string | null;
  dob: string | null;
  country: string | null;
  goals: string[];
  allergies: string[];
  training_likes: string[];
  training_dislikes: string[];
  injuries: string[];
  meditation_experience: string | null;
  location: string | null;
}

// Options from onboarding flow
const goals = [
  { id: 'get-fit', emoji: '💪', title: 'Get Fit', category: 'fitness' },
  { id: 'build-muscle', emoji: '🏋️', title: 'Build Muscle', category: 'fitness' },
  { id: 'get-stronger', emoji: '💥', title: 'Get Stronger', category: 'fitness' },
  { id: 'burn-fat', emoji: '🔥', title: 'Burn Fat', category: 'fitness' },
  { id: 'get-toned', emoji: '✨', title: 'Get Toned', category: 'fitness' },
  { id: 'eat-healthier', emoji: '🥗', title: 'Eat Healthier', category: 'nutrition' },
  { id: 'weight-loss', emoji: '⚖️', title: 'Weight Loss', category: 'nutrition' },
  { id: 'improve-habits', emoji: '🎯', title: 'Improve Habits', category: 'nutrition' },
  { id: 'more-energy', emoji: '⚡', title: 'More Energy', category: 'nutrition' },
  { id: 'reduce-cravings', emoji: '🍃', title: 'Reduce Cravings', category: 'nutrition' },
  { id: 'reduce-stress', emoji: '🧘', title: 'Reduce Stress', category: 'mental' },
  { id: 'improve-sleep', emoji: '😴', title: 'Improve Sleep', category: 'mental' },
  { id: 'build-mindfulness', emoji: '🌸', title: 'Build Mindfulness', category: 'mental' },
  { id: 'emotional-balance', emoji: '🌈', title: 'Emotional Balance', category: 'mental' },
  { id: 'boost-focus', emoji: '🎯', title: 'Boost Focus', category: 'mental' }
];

const allergies = [
  { id: 'dairy', label: 'Dairy', icon: '🥛' },
  { id: 'gluten', label: 'Gluten', icon: '🍞' },
  { id: 'nuts', label: 'Nuts', icon: '🥜' },
  { id: 'eggs', label: 'Eggs', icon: '🥚' },
  { id: 'soy', label: 'Soy', icon: '🌱' },
  { id: 'fish', label: 'Fish', icon: '🐟' },
  { id: 'shellfish', label: 'Shellfish', icon: '🦞' },
  { id: 'lactose', label: 'Lactose', icon: '🧀' },
];

const trainingOptions = [
  { id: 'strength', label: 'Strength', icon: '💪' },
  { id: 'cardio', label: 'Cardio', icon: '🏃‍♂️' },
  { id: 'endurance', label: 'Endurance', icon: '🚴‍♀️' },
  { id: 'weights', label: 'Weights', icon: '🏋️' },
  { id: 'calisthenics', label: 'Calisthenics', icon: '🤸' },
  { id: 'hiit', label: 'HIIT', icon: '🔥' },
  { id: 'outdoor', label: 'Outdoor', icon: '🌲' },
  { id: 'running', label: 'Running', icon: '👟' },
];

const injuries = [
  { id: 'lower-back', label: 'Lower back', icon: '🤕' },
  { id: 'neck', label: 'Neck', icon: '🧣' },
  { id: 'knee', label: 'Knee', icon: '🦵' },
  { id: 'shoulder', label: 'Shoulder', icon: '🙋‍♂️' },
  { id: 'wrist-elbow', label: 'Wrist/Elbow', icon: '💪' },
];

const meditationOptions = [
  { value: 'never', label: 'Never tried it', emoji: '🤔' },
  { value: 'beginner', label: 'Just started', emoji: '🌱' },
  { value: 'sometimes', label: 'Practice sometimes', emoji: '🧘' },
  { value: 'regular', label: 'Regular practice', emoji: '🧠' },
  { value: 'experienced', label: 'Very experienced', emoji: '🕉️' },
];

const PersonalInfoSection = () => {
  const { user, profile } = useAuth();
  const { updateOnboarding, updateProfile, loading } = useProfileUpdates();
  const [onboardingData, setOnboardingData] = useState<OnboardingDetails | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<OnboardingDetails>>({});
  const [profileFormData, setProfileFormData] = useState({ phone: '', email: '' });
  const [newItem, setNewItem] = useState({ type: '', value: '' });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email, phone, created_at')
          .eq('id', user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        if (profileData) {
          setProfileData(profileData);
          setProfileFormData({
            phone: profileData.phone || '',
            email: profileData.email || ''
          });
        }

        // Fetch onboarding data
        const { data: onboardingData, error: onboardingError } = await supabase
          .from('onboarding_details')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (onboardingError && onboardingError.code !== 'PGRST116') {
          throw onboardingError;
        }
        
        if (onboardingData) {
          setOnboardingData(onboardingData);
          setFormData(onboardingData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load profile data');
      }
    };

    fetchData();
  }, [user]);

  const handleSave = async () => {
    try {
      // Update profile data (phone)
      const profileSuccess = await updateProfile({ phone: profileFormData.phone });
      if (!profileSuccess) {
        toast.error('Failed to update profile');
        return;
      }

      // Update onboarding data
      const onboardingSuccess = await updateOnboarding(formData);
      if (onboardingSuccess) {
        setOnboardingData(formData as OnboardingDetails);
        setProfileData({ ...profileData, phone: profileFormData.phone });
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData(onboardingData || {});
    setProfileFormData({
      phone: profileData?.phone || '',
      email: profileData?.email || ''
    });
    setIsEditing(false);
  };

  const handleMultiSelect = (field: keyof OnboardingDetails, value: string) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: keyof OnboardingDetails, value: string) => {
    if (!value.trim()) return;
    
    const currentArray = (formData[field] as string[]) || [];
    setFormData({
      ...formData,
      [field]: [...currentArray, value.trim()]
    });
    setNewItem({ type: '', value: '' });
  };

  const removeArrayItem = (field: keyof OnboardingDetails, index: number) => {
    const currentArray = (formData[field] as string[]) || [];
    setFormData({
      ...formData,
      [field]: currentArray.filter((_, i) => i !== index)
    });
  };

  const calculateAge = (dob: string | null) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (!onboardingData && !profileData && !isEditing) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No personal information available. Complete your onboarding to see your details here.
          </p>
          <Button onClick={() => setIsEditing(true)} className="w-full">
            Add Personal Information
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contact & Personal Information */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact & Personal Information
            </CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <p className="text-sm text-muted-foreground py-2">
                  {profileData?.email || 'Not provided'}
                </p>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={profileFormData.phone}
                    onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground py-2">
                    {profileData?.phone || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                {isEditing ? (
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || null })}
                    placeholder="70.0"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground py-2">
                    {onboardingData?.weight ? `${onboardingData.weight} kg` : 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="height">Height (cm)</Label>
                {isEditing ? (
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={formData.height || ''}
                    onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || null })}
                    placeholder="175.0"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground py-2">
                    {onboardingData?.height ? `${onboardingData.height} cm` : 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                {isEditing ? (
                  <Select
                    value={formData.gender || ''}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground py-2">
                    {onboardingData?.gender || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <p className="text-sm text-muted-foreground py-2">
                  {calculateAge(formData.dob || onboardingData?.dob || null) || 'Not provided'}
                </p>
              </div>

              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                {isEditing ? (
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob || ''}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground py-2">
                    {onboardingData?.dob ? new Date(onboardingData.dob).toLocaleDateString() : 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                {isEditing ? (
                  <Input
                    id="country"
                    value={formData.country || ''}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. Norway"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground py-2">
                    {onboardingData?.country || 'Not provided'}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="location">Location</Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, State/Province"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground py-2">
                    {onboardingData?.location || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goals */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Goals
            </CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {goals.map(goal => (
                  <MultiSelectButton
                    key={goal.id}
                    selected={(formData.goals || []).includes(goal.id)}
                    onClick={() => handleMultiSelect('goals', goal.id)}
                  >
                    <span className="mr-2">{goal.emoji}</span>
                    {goal.title}
                  </MultiSelectButton>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSave} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save changes'}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(onboardingData?.goals || []).length > 0 ? (
                (onboardingData?.goals || []).map((goalId) => {
                  const goal = goals.find(g => g.id === goalId);
                  return goal ? (
                    <Badge key={goalId} variant="secondary" className="flex items-center gap-1">
                      <span>{goal.emoji}</span>
                      {goal.title}
                    </Badge>
                  ) : null;
                })
              ) : (
                <p className="text-sm text-muted-foreground">No goals set</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Information */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Health Information
            </CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Allergies */}
          <div>
            <Label>Allergies</Label>
            {isEditing ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                {allergies.map(allergy => (
                  <MultiSelectButton
                    key={allergy.id}
                    selected={(formData.allergies || []).includes(allergy.id)}
                    onClick={() => handleMultiSelect('allergies', allergy.id)}
                  >
                    <span className="mr-2">{allergy.icon}</span>
                    {allergy.label}
                  </MultiSelectButton>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {(onboardingData?.allergies || []).length > 0 ? (
                  (onboardingData?.allergies || []).map((allergyId) => {
                    const allergy = allergies.find(a => a.id === allergyId);
                    return allergy ? (
                      <Badge key={allergyId} variant="destructive" className="flex items-center gap-1">
                        <span>{allergy.icon}</span>
                        {allergy.label}
                      </Badge>
                    ) : null;
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No allergies recorded</p>
                )}
              </div>
            )}
          </div>

          {/* Injuries */}
          <div>
            <Label>Past Injuries</Label>
            {isEditing ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {injuries.map(injury => (
                  <MultiSelectButton
                    key={injury.id}
                    selected={(formData.injuries || []).includes(injury.id)}
                    onClick={() => handleMultiSelect('injuries', injury.id)}
                  >
                    <span className="mr-2">{injury.icon}</span>
                    {injury.label}
                  </MultiSelectButton>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {(onboardingData?.injuries || []).length > 0 ? (
                  (onboardingData?.injuries || []).map((injuryId) => {
                    const injury = injuries.find(i => i.id === injuryId);
                    return injury ? (
                      <Badge key={injuryId} variant="outline" className="flex items-center gap-1">
                        <span>{injury.icon}</span>
                        {injury.label}
                      </Badge>
                    ) : null;
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No injuries recorded</p>
                )}
              </div>
            )}
          </div>

          {/* Training Preferences */}
          <div>
            <Label>Training Likes</Label>
            {isEditing ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                {trainingOptions.map(option => (
                  <MultiSelectButton
                    key={option.id}
                    selected={(formData.training_likes || []).includes(option.id)}
                    onClick={() => handleMultiSelect('training_likes', option.id)}
                  >
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </MultiSelectButton>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {(onboardingData?.training_likes || []).length > 0 ? (
                  (onboardingData?.training_likes || []).map((likeId) => {
                    const like = trainingOptions.find(t => t.id === likeId);
                    return like ? (
                      <Badge key={likeId} variant="default" className="flex items-center gap-1">
                        <span>{like.icon}</span>
                        {like.label}
                      </Badge>
                    ) : null;
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No training preferences set</p>
                )}
              </div>
            )}
          </div>

          {/* Training Dislikes */}
          <div>
            <Label>Training Dislikes</Label>
            {isEditing ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                {trainingOptions.map(option => (
                  <MultiSelectButton
                    key={option.id}
                    selected={(formData.training_dislikes || []).includes(option.id)}
                    onClick={() => handleMultiSelect('training_dislikes', option.id)}
                  >
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </MultiSelectButton>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {(onboardingData?.training_dislikes || []).length > 0 ? (
                  (onboardingData?.training_dislikes || []).map((dislikeId) => {
                    const dislike = trainingOptions.find(t => t.id === dislikeId);
                    return dislike ? (
                      <Badge key={dislikeId} variant="secondary" className="flex items-center gap-1">
                        <span>{dislike.icon}</span>
                        {dislike.label}
                      </Badge>
                    ) : null;
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No training dislikes recorded</p>
                )}
              </div>
            )}
          </div>

          {/* Meditation Experience */}
          <div>
            <Label htmlFor="meditation">Meditation Experience</Label>
            {isEditing ? (
              <RadioGroup
                value={formData.meditation_experience || ''}
                onValueChange={(value) => setFormData({ ...formData, meditation_experience: value })}
                className="mt-2"
              >
                {meditationOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex items-center gap-2">
                      <span>{option.emoji}</span>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                {onboardingData?.meditation_experience ? 
                  meditationOptions.find(opt => opt.value === onboardingData.meditation_experience)?.label || 'Not specified'
                  : 'Not specified'
                }
              </p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save changes'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoSection;
