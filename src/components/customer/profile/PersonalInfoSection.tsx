import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileUpdates } from '@/hooks/useProfileUpdates';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Edit, Save, X, Plus, Trash2, Calendar, MapPin, Ruler, Weight, User, Flag, Heart, Activity, Brain } from 'lucide-react';

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

const PersonalInfoSection = () => {
  const { user } = useAuth();
  const { updateOnboarding, loading } = useProfileUpdates();
  const [onboardingData, setOnboardingData] = useState<OnboardingDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<OnboardingDetails>>({});
  const [newItem, setNewItem] = useState({ type: '', value: '' });

  useEffect(() => {
    const fetchOnboardingData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('onboarding_details')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw error;
        }
        
        if (data) {
          setOnboardingData(data);
          setFormData(data);
        }
      } catch (error) {
        console.error('Error fetching onboarding data:', error);
        toast.error('Failed to load profile data');
      }
    };

    fetchOnboardingData();
  }, [user]);

  const handleSave = async () => {
    try {
      const success = await updateOnboarding(formData);
      if (success) {
        setOnboardingData(formData as OnboardingDetails);
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
    setIsEditing(false);
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

  if (!onboardingData && !isEditing) {
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
      {/* Personal Information */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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
                    <SelectItem value="other">Other</SelectItem>
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
                  placeholder="United States"
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
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newItem.value}
                  onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                  placeholder="Add a goal..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addArrayItem('goals', newItem.value);
                    }
                  }}
                />
                <Button
                  onClick={() => addArrayItem('goals', newItem.value)}
                  disabled={!newItem.value.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.goals || []).map((goal, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {goal}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => removeArrayItem('goals', index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(onboardingData?.goals || []).length > 0 ? (
                (onboardingData?.goals || []).map((goal, index) => (
                  <Badge key={index} variant="secondary">{goal}</Badge>
                ))
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
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Health Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Allergies */}
          <div>
            <Label>Allergies</Label>
            {isEditing ? (
              <div className="space-y-3 mt-2">
                <div className="flex gap-2">
                  <Input
                    value={newItem.value}
                    onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                    placeholder="Add an allergy..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addArrayItem('allergies', newItem.value);
                      }
                    }}
                  />
                  <Button
                    onClick={() => addArrayItem('allergies', newItem.value)}
                    disabled={!newItem.value.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.allergies || []).map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="flex items-center gap-1">
                      {allergy}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeArrayItem('allergies', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {(onboardingData?.allergies || []).length > 0 ? (
                  (onboardingData?.allergies || []).map((allergy, index) => (
                    <Badge key={index} variant="destructive">{allergy}</Badge>
                  ))
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
              <div className="space-y-3 mt-2">
                <div className="flex gap-2">
                  <Input
                    value={newItem.value}
                    onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                    placeholder="Add an injury..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addArrayItem('injuries', newItem.value);
                      }
                    }}
                  />
                  <Button
                    onClick={() => addArrayItem('injuries', newItem.value)}
                    disabled={!newItem.value.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.injuries || []).map((injury, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {injury}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeArrayItem('injuries', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {(onboardingData?.injuries || []).length > 0 ? (
                  (onboardingData?.injuries || []).map((injury, index) => (
                    <Badge key={index} variant="outline">{injury}</Badge>
                  ))
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
              <div className="space-y-3 mt-2">
                <div className="flex gap-2">
                  <Input
                    value={newItem.value}
                    onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                    placeholder="Add a training preference..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addArrayItem('training_likes', newItem.value);
                      }
                    }}
                  />
                  <Button
                    onClick={() => addArrayItem('training_likes', newItem.value)}
                    disabled={!newItem.value.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.training_likes || []).map((like, index) => (
                    <Badge key={index} variant="default" className="flex items-center gap-1">
                      {like}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeArrayItem('training_likes', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {(onboardingData?.training_likes || []).length > 0 ? (
                  (onboardingData?.training_likes || []).map((like, index) => (
                    <Badge key={index} variant="default">{like}</Badge>
                  ))
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
              <div className="space-y-3 mt-2">
                <div className="flex gap-2">
                  <Input
                    value={newItem.value}
                    onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                    placeholder="Add a training dislike..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addArrayItem('training_dislikes', newItem.value);
                      }
                    }}
                  />
                  <Button
                    onClick={() => addArrayItem('training_dislikes', newItem.value)}
                    disabled={!newItem.value.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.training_dislikes || []).map((dislike, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {dislike}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeArrayItem('training_dislikes', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {(onboardingData?.training_dislikes || []).length > 0 ? (
                  (onboardingData?.training_dislikes || []).map((dislike, index) => (
                    <Badge key={index} variant="secondary">{dislike}</Badge>
                  ))
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
              <Select
                value={formData.meditation_experience || ''}
                onValueChange={(value) => setFormData({ ...formData, meditation_experience: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="none">No experience</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                {onboardingData?.meditation_experience || 'Not specified'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoSection;
