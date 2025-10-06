'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Tag, Award, Plus, Trash2, Save, Loader2, Brain, AlertCircle, Camera, Instagram, Linkedin, Youtube, Twitter, Video, Facebook, Globe, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCoachProfile, CoachProfile, Certification, SocialLink } from '@/hooks/useCoachProfile';
import { SkillsSelector } from '@/components/onboarding/SkillsSelector';
import { toast } from 'sonner';
import { z } from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import imageCompression from 'browser-image-compression';

const SOCIAL_PLATFORMS = [
  { value: 'Instagram', icon: Instagram, urlPattern: /^https?:\/\/(www\.)?instagram\.com\/.+/, placeholder: 'https://instagram.com/yourprofile' },
  { value: 'LinkedIn', icon: Linkedin, urlPattern: /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/.+/, placeholder: 'https://linkedin.com/in/yourprofile' },
  { value: 'YouTube', icon: Youtube, urlPattern: /^https?:\/\/(www\.)?youtube\.com\/.+/, placeholder: 'https://youtube.com/@yourchannel' },
  { value: 'Twitter', icon: Twitter, urlPattern: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/, placeholder: 'https://twitter.com/yourhandle' },
  { value: 'TikTok', icon: Video, urlPattern: /^https?:\/\/(www\.)?tiktok\.com\/@.+/, placeholder: 'https://tiktok.com/@yourhandle' },
  { value: 'Facebook', icon: Facebook, urlPattern: /^https?:\/\/(www\.)?facebook\.com\/.+/, placeholder: 'https://facebook.com/yourpage' },
  { value: 'Website', icon: Globe, urlPattern: /^https?:\/\/.+/, placeholder: 'https://yourwebsite.com' },
] as const;

const profileSchema = z.object({
  full_name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  tagline: z.string().trim().max(150, 'Tagline cannot exceed 150 characters').optional(),
  bio: z.string().trim().max(2000, 'Bio cannot exceed 2000 characters').optional(),
  skills: z.array(z.string()).min(1, 'Select at least one skill').max(10, 'Maximum 10 skills allowed'),
  certifications: z.array(z.object({
    id: z.string(),
    name: z.string().trim().min(1, 'Certification name required').max(200, 'Name too long'),
    issuer: z.string().trim().max(200, 'Issuer name too long').optional(),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1, 'Invalid year')
  })),
  price_min_cents: z.number().int().min(0).max(10000000).optional(),
  price_max_cents: z.number().int().min(0).max(10000000).optional(),
});

interface ProfileSettingsProps {
  onUpdate?: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onUpdate }) => {
  const { profile, loading, error, updateProfile } = useCoachProfile();
  const [formData, setFormData] = useState<CoachProfile>({
    full_name: '',
    tagline: '',
    bio: '',
    avatar_url: '',
    skills: [],
    certifications: [],
    socials: [],
    price_min_cents: null,
    price_max_cents: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [socialValidation, setSocialValidation] = useState<Record<string, boolean>>({});
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleCertChange = (id: string, field: keyof Certification, value: any) => {
    const newCerts = formData.certifications.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    );
    setFormData({ ...formData, certifications: newCerts });
  };
  
  const addCert = () => {
    setFormData({ 
      ...formData, 
      certifications: [...formData.certifications, { id: `new-${Date.now()}`, name: '', issuer: '', year: new Date().getFullYear() }] 
    });
  };
  
  const removeCert = (id: string) => {
    setFormData({ ...formData, certifications: formData.certifications.filter(c => c.id !== id) });
  };

  const handleSocialChange = (id: string, field: keyof SocialLink, value: any) => {
    const newSocials = formData.socials.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    );
    setFormData({ ...formData, socials: newSocials });
    
    // Validate URL if it's the url field
    if (field === 'url') {
      const social = newSocials.find(s => s.id === id);
      if (social) {
        const platformConfig = SOCIAL_PLATFORMS.find(p => p.value === social.platform);
        const isValid = platformConfig ? platformConfig.urlPattern.test(value) : true;
        setSocialValidation(prev => ({ ...prev, [id]: isValid }));
      }
    }
  };

  const addSocial = () => {
    setFormData({ 
      ...formData, 
      socials: [...formData.socials, { id: `new-${Date.now()}`, platform: 'Instagram', url: '' }] 
    });
  };

  const removeSocial = (id: string) => {
    setFormData({ ...formData, socials: formData.socials.filter(s => s.id !== id) });
    setSocialValidation(prev => {
      const newValidation = { ...prev };
      delete newValidation[id];
      return newValidation;
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      // Compress image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true
      };
      const compressedFile = await imageCompression(file, options);

      // Upload to Supabase Storage
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${profile?.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData({ ...formData, avatar_url: publicUrl });
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    // Validate form data
    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.');
        errors[field] = err.message;
      });
      setValidationErrors(errors);
      toast.error('Please fix the validation errors');
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);
    try {
      const success = await updateProfile(formData);
      if (success) {
        toast.success("Profile Updated! Clients can now see your changes.");
        onUpdate?.();
      }
    } catch (err) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive">Error loading profile: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Basic Info & Profile Image */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5" /> Public Identity
          </CardTitle>
          <CardDescription>This information is visible to potential clients.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={formData.avatar_url || 'https://placehold.co/100x100/A0E7E5/030712?text=CP'} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
              />
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={triggerImageUpload}
                disabled={isUploadingImage}
              >
                <Camera className="h-4 w-4" /> 
                {isUploadingImage ? 'Uploading...' : 'Change Photo'}
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG up to 5MB
              </p>
            </div>
          </div>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={formData.full_name} 
              onChange={e => {
                setFormData({ ...formData, full_name: e.target.value });
                setValidationErrors({ ...validationErrors, full_name: '' });
              }}
              maxLength={100}
              className={validationErrors.full_name ? 'border-destructive' : ''}
            />
            {validationErrors.full_name && (
              <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.full_name}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="tagline">Tagline (Short Summary)</Label>
            <Input 
              id="tagline" 
              value={formData.tagline} 
              onChange={e => {
                setFormData({ ...formData, tagline: e.target.value });
                setValidationErrors({ ...validationErrors, tagline: '' });
              }}
              placeholder="e.g., Elite Fitness Coach & Nutritionist" 
              maxLength={150}
              className={validationErrors.tagline ? 'border-destructive' : ''}
            />
            {validationErrors.tagline && (
              <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.tagline}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea 
              id="bio" 
              value={formData.bio} 
              onChange={e => {
                setFormData({ ...formData, bio: e.target.value });
                setValidationErrors({ ...validationErrors, bio: '' });
              }}
              rows={5} 
              placeholder="Write a compelling bio to land clients..." 
              maxLength={2000}
              className={validationErrors.bio ? 'border-destructive' : ''}
            />
            <div className="flex justify-between items-center mt-1">
              {validationErrors.bio && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.bio}
                </p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {formData.bio.length}/2000
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Tag className="h-5 w-5" /> Price Range (USD)
          </CardTitle>
          <CardDescription>Let customers know your typical price range.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label>Minimum (per package)</Label>
            <Input type="number" value={(formData.price_min_cents ?? 0) / 100}
              onChange={e => setFormData({ ...formData, price_min_cents: Math.round((Number(e.target.value) || 0) * 100) })}
              placeholder="e.g., 99.00" />
          </div>
          <div>
            <Label>Maximum (per package)</Label>
            <Input type="number" value={(formData.price_max_cents ?? 0) / 100}
              onChange={e => setFormData({ ...formData, price_max_cents: Math.round((Number(e.target.value) || 0) * 100) })}
              placeholder="e.g., 499.00" />
          </div>
        </CardContent>
      </Card>
      
      {/* Skills */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-5 w-5" /> Skills & Specialties
          </CardTitle>
          <CardDescription>Select your areas of expertise to help clients find you.</CardDescription>
        </CardHeader>
        <CardContent>
          <SkillsSelector 
            selectedSkills={formData.skills}
            onSkillsChange={(skills) => {
              setFormData({ ...formData, skills });
              setValidationErrors({ ...validationErrors, skills: '' });
            }}
          />
          {validationErrors.skills && (
            <p className="text-sm text-destructive mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {validationErrors.skills}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Award className="h-5 w-5" /> Certifications & Expertise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.certifications.map(cert => (
            <div key={cert.id} className="p-3 border rounded-lg flex items-end gap-3 bg-muted/20">
              <div className="flex-1 space-y-2">
                <Label className="text-xs text-muted-foreground">Certification Name</Label>
                <Input value={cert.name} onChange={e => handleCertChange(cert.id, 'name', e.target.value)} />
              </div>
              <div className="w-20 space-y-2">
                <Label className="text-xs text-muted-foreground">Year</Label>
                <Input type="number" value={cert.year} onChange={e => handleCertChange(cert.id, 'year', parseInt(e.target.value) || new Date().getFullYear())} />
              </div>
              <Button variant="destructive" size="icon" onClick={() => removeCert(cert.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="secondary" onClick={addCert} className="w-full gap-2 mt-4 border-dashed border-2">
            <Plus className="h-4 w-4" /> Add Certification
          </Button>
        </CardContent>
      </Card>
      
      {/* Socials */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Globe className="h-5 w-5" /> Social Media & Online Presence
          </CardTitle>
          <CardDescription>Add your social media links to help clients connect with you and see your content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.socials.map(social => {
            const platformConfig = SOCIAL_PLATFORMS.find(p => p.value === social.platform);
            const IconComponent = platformConfig?.icon || Globe;
            const isValidUrl = socialValidation[social.id] !== false;
            const hasUrl = social.url.trim().length > 0;
            
            return (
              <div key={social.id} className="p-3 border rounded-lg flex items-start gap-3 bg-muted/20">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Platform</Label>
                      <Select 
                        value={social.platform} 
                        onValueChange={(value: any) => handleSocialChange(social.id, 'platform', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SOCIAL_PLATFORMS.map(platform => (
                            <SelectItem key={platform.value} value={platform.value}>
                              <div className="flex items-center gap-2">
                                <platform.icon className="h-4 w-4" />
                                {platform.value}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => removeSocial(social.id)}
                        className="h-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Profile URL</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input 
                        value={social.url} 
                        onChange={e => handleSocialChange(social.id, 'url', e.target.value)}
                        placeholder={platformConfig?.placeholder || 'https://...'}
                        className={cn(
                          "pl-10 pr-10",
                          hasUrl && !isValidUrl && "border-destructive"
                        )}
                      />
                      {hasUrl && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {isValidUrl ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                      )}
                    </div>
                    {hasUrl && !isValidUrl && (
                      <p className="text-xs text-destructive">
                        Please enter a valid {social.platform} URL
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <Button 
            variant="secondary" 
            onClick={addSocial} 
            className="w-full gap-2 mt-4 border-dashed border-2"
          >
            <Plus className="h-4 w-4" /> Add Social Link
          </Button>
        </CardContent>
      </Card>

      <div className="pt-4 flex justify-end">
        <Button onClick={handleSave} size="lg" className="gap-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {isSubmitting ? 'Saving...' : 'Save Public Profile'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
