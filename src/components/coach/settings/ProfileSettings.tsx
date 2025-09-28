'use client';

import React, { useState } from 'react';
import { CoachProfile, Certification, SocialLink } from '@/mockdata/settings/mockSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Tag, Award, Plus, Trash2, Link, Upload, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileSettingsProps {
  profile: CoachProfile;
  onUpdate: (updatedProfile: CoachProfile) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState(profile);

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

  const handleSave = () => {
    onUpdate(formData);
    alert('Public Profile Updated! Clients can now see your changes.');
  };

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
              src={formData.profileImageUrl} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
            />
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" /> Change Photo
            </Button>
          </div>
          
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />

          <Label htmlFor="tagline">Tagline (Short Summary)</Label>
          <Input id="tagline" value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} placeholder="e.g., Elite Fitness Coach & Nutritionist" />

          <Label htmlFor="bio">Professional Bio</Label>
          <Textarea id="bio" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} rows={5} placeholder="Write a compelling bio to land clients..." />
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
        <Button onClick={handleSave} size="lg" className="gap-2">
          <Save className="h-5 w-5" /> Save Public Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
