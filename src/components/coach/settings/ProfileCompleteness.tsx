'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Lightbulb } from 'lucide-react';
import { CoachProfile } from '@/hooks/useCoachProfile';
import { cn } from '@/lib/utils';

interface ProfileCompletenessProps {
  profile: CoachProfile;
}

interface CompletionItem {
  label: string;
  completed: boolean;
  tip?: string;
}

export const calculateCompleteness = (profile: CoachProfile): number => {
  let score = 0;
  const total = 100;
  
  // Required fields (60 points)
  if (profile.full_name && profile.full_name.length >= 2) score += 20;
  if (profile.tagline && profile.tagline.length >= 10) score += 15;
  if (profile.bio && profile.bio.length > 100) score += 25;
  
  // Optional but important (40 points)
  if (profile.avatar_url) score += 10;
  if (profile.skills.length >= 3) score += 10;
  if (profile.certifications.length >= 1) score += 10;
  if (profile.socials.length >= 1) score += 5;
  if (profile.price_min_cents && profile.price_max_cents) score += 5;
  
  return Math.round((score / total) * 100);
};

const getProfileStrength = (percentage: number): { label: string; color: string } => {
  if (percentage >= 90) return { label: 'Excellent', color: 'text-green-500' };
  if (percentage >= 70) return { label: 'Good', color: 'text-blue-500' };
  if (percentage >= 50) return { label: 'Fair', color: 'text-yellow-500' };
  return { label: 'Weak', color: 'text-red-500' };
};

export const ProfileCompleteness: React.FC<ProfileCompletenessProps> = ({ profile }) => {
  const percentage = calculateCompleteness(profile);
  const strength = getProfileStrength(percentage);

  const items: CompletionItem[] = [
    {
      label: 'Profile Photo',
      completed: !!profile.avatar_url,
      tip: 'A professional photo builds trust'
    },
    {
      label: 'Complete Bio (100+ chars)',
      completed: profile.bio.length > 100,
      tip: 'Tell clients why you\'re the right coach'
    },
    {
      label: 'Skills (3+ selected)',
      completed: profile.skills.length >= 3,
      tip: 'Help clients find you based on expertise'
    },
    {
      label: 'Certifications',
      completed: profile.certifications.length >= 1,
      tip: 'Showcase your credentials to build credibility'
    },
    {
      label: 'Social Links',
      completed: profile.socials.length >= 1,
      tip: 'Let clients see your content and community'
    },
    {
      label: 'Price Range',
      completed: !!(profile.price_min_cents && profile.price_max_cents),
      tip: 'Set clear expectations for potential clients'
    },
  ];

  const incompleteItems = items.filter(item => !item.completed);

  return (
    <Card className="shadow-md border-primary/20">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Profile Strength</h3>
            <p className="text-sm text-muted-foreground">
              <span className={cn('font-bold', strength.color)}>{strength.label}</span>
              {' • '}
              {percentage}% Complete
            </p>
          </div>
          <div className="text-3xl font-bold text-primary">{percentage}%</div>
        </div>

        <Progress value={percentage} className="h-2" />

        {incompleteItems.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span>Complete your profile to stand out:</span>
            </div>
            <div className="space-y-1.5">
              {incompleteItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Circle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">{item.label}</span>
                    {item.tip && <span className="text-xs"> - {item.tip}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {percentage === 100 && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Perfect! Your profile is complete and ready to attract clients.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
