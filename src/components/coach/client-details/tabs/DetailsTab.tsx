// src/components/coach/client-details/tabs/DetailsTab.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Ruler, Weight, Heart, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ClientDetailData } from '@/hooks/useClientDetail';
import { InfoRow, BadgeList } from '../helpers/index';

interface DetailsTabProps {
  client: ClientDetailData;
}

const DetailsTab = ({ client }: DetailsTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Personal Info Card */}
      <Card className="shadow-lg rounded-xl bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} className="text-primary" />
            Personal Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoRow label="Age" value={client.age ?? 'N/A'} />
            <InfoRow label="Height (cm)" value={client.height ?? 'N/A'} />
            <InfoRow label="Weight (kg)" value={client.weight ?? 'N/A'} />
            <InfoRow label="Gender" value={client.gender || 'Not set'} />
          </div>
        </CardContent>
      </Card>

      {/* Goals & Preferences Card */}
      <Card className="shadow-lg rounded-xl bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={20} className="text-primary" />
            Goals & Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoRow label="Preferences" value={client.preferences || 'None'} />
          <InfoRow label="Dislikes" value={client.dislikes || 'None'} />
          <BadgeList label="Allergies" items={client.allergies} tone="warn" />
          <BadgeList label="Injuries" items={client.injuries} tone="danger" />
          <InfoRow label="Meditation Experience" value={client.meditation_experience || 'None'} />
          <BadgeList label="Goals" items={client.goals} tone="primary" />
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailsTab;
