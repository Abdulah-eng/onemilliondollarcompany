'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Tag, Award, Plus, Trash2, Link, Upload, Save, Loader2, Brain, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCoachProfile, CoachProfile, Certification, SocialLink } from '@/hooks/useCoachProfile';
import { SkillsSelector } from '@/components/onboarding/SkillsSelector';
import { toast } from 'sonner';
import { z } from 'zod';

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
  }))
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
    socials: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
            <img 
              src={formData.avatar_url || 'https://placehold.co/100x100/A0E7E5/030712?text=CP'} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
            />
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" /> Change Photo
            </Button>
          </div>
          
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
            <Tag className="h-5 w-5" /> Social Presence
          </CardTitle>
          <CardDescription>Share links where clients can find more of your content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.socials.map(social => (
            <div key={social.id} className="space-y-2">
              <Label>{social.platform} URL</Label>
              <Input value={social.url} onChange={e => setFormData({ ...formData, socials: formData.socials.map(s => s.id === social.id ? { ...s, url: e.target.value } : s) })} placeholder={`https://${social.platform.toLowerCase()}.com/...`} />
            </div>
          ))}
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
