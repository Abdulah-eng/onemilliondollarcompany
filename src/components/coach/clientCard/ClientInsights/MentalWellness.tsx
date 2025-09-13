// src/components/coach/clientCard/ClientInsights/MentalWellness.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Smile, Zap } from 'lucide-react';
import { mockClientData } from '@/mockdata/clientCard/mockClientData';

interface MentalWellnessProps {
  mentalHealthData: typeof mockClientData.mentalHealth;
}

const MentalWellness: React.FC<MentalWellnessProps> = ({ mentalHealthData }) => {
  const sections = [
    { label: 'Avg. Stress', value: mentalHealthData.avgStress, trend: mentalHealthData.stressTrend, unit: '/5' },
    { label: 'Avg. Anxiety', value: mentalHealthData.avgAnxiety, trend: mentalHealthData.anxietyTrend, unit: '/5' },
    { label: 'Meditation', value: mentalHealthData.meditationTime, trend: mentalHealthData.meditationTrend, unit: ' min' },
    { label: 'Yoga', value: mentalHealthData.yogaTime, trend: mentalHealthData.yogaTrend, unit: ' min' },
  ];

  const getTrendColor = (trend: string) => {
    if (trend === '↑') return 'text-rose-500';
    if (trend === '↓') return 'text-emerald-500';
    return 'text-muted-foreground';
  };

  return (
    <div>
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Smile className="w-6 h-6 text-purple-500" />
          Mental Wellness
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          A deeper look into your client's emotional and mental state.
        </p>
      </CardHeader>
      <CardContent className="p-0 grid grid-cols-2 gap-4">
        {sections.map((section, index) => (
          <div key={index} className="space-y-1">
            <div className="text-sm text-muted-foreground">{section.label}</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                {section.value}
                <span className="text-sm font-normal text-muted-foreground">{section.unit}</span>
              </span>
              <span className={`text-lg font-bold ${getTrendColor(section.trend)}`}>{section.trend}</span>
            </div>
            {section.label === 'Meditation' && (
              <p className="text-xs text-muted-foreground">{mentalHealthData.meditationValue}</p>
            )}
            {section.label === 'Yoga' && (
              <p className="text-xs text-muted-foreground">{mentalHealthData.yogaValue}</p>
            )}
          </div>
        ))}
      </CardContent>
    </div>
  );
};

export default MentalWellness;
