// src/components/coach/clientCard/ClientInsights/ClientInsights.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Heart, Scale, Utensils, Smile } from 'lucide-react';
import DailyCheckIn from './DailyCheckIn';
import WeightTrend from './WeightTrend';
import ProgramCompletion from './ProgramCompletion'; // Renamed ProgramFill
import NutritionInsights from './NutritionInsights'; // NEW: Nutrition component
import MentalWellness from './MentalWellness'; // NEW: Mental wellness component
import TimeRangeSelector, { TimeRange } from './TimeRangeSelector';
import { mockClientData } from '@/mockdata/clientCard/mockClientData';

interface ClientInsightsProps {
  client: typeof mockClientData;
}

const sectionCard = 'rounded-2xl border bg-card shadow-sm';

const ClientInsights: React.FC<ClientInsightsProps> = ({ client }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1month');

  const filterDataByTimeRange = (data: any[], range: TimeRange) => {
    const now = new Date();
    let startDate;
    if (range === '1week') startDate = new Date(now.setDate(now.getDate() - 7));
    if (range === '1month') startDate = new Date(now.setMonth(now.getMonth() - 1));
    if (range === '6months') startDate = new Date(now.setMonth(now.getMonth() - 6));
    
    return data.filter(d => new Date(d.date) >= startDate);
  };

  const filteredDailyCheckIn = useMemo(() => filterDataByTimeRange(client.dailyCheckIn, timeRange), [client.dailyCheckIn, timeRange]);
  const filteredWeightTrend = useMemo(() => filterDataByTimeRange(client.weightTrend, timeRange), [client.weightTrend, timeRange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-6"
    >
      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight mb-4 sm:mb-0">Client Insights 📈</h2>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {/* Primary Insights - Program & Adherence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgramCompletion programFill={client.programFill} />
        </div>
        <Card className={`${sectionCard} p-6`}>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Daily Check-ins
            </h3>
            <p className="text-sm text-muted-foreground">
              Avg. Adherence: <span className="text-base font-bold text-foreground">{client.insights.avgDailyCheckIn}</span>
            </p>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <TrendPill label="Mood" value={client.trends.mood} />
              <TrendPill label="Sleep" value={client.trends.sleep} />
              <TrendPill label="Energy" value={client.trends.energy} />
              <TrendPill label="Stress" value={client.trends.stress} />
            </div>
            <p className="text-xs text-muted-foreground">
              Trends calculated based on the selected time range.
            </p>
          </div>
        </Card>
      </div>

      {/* Detailed Insights - Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Check-in Chart */}
        <Card className={`${sectionCard} p-6`}>
          <DailyCheckIn dailyCheckIn={filteredDailyCheckIn} timeRange={timeRange} />
        </Card>
        {/* Weight Trend Chart */}
        <Card className={`${sectionCard} p-6`}>
          <WeightTrend weightTrend={filteredWeightTrend} />
        </Card>
      </div>

      {/* Holistic Wellness - Nutrition & Mental Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nutrition Insights */}
        <Card className={`${sectionCard} p-6`}>
          <NutritionInsights nutritionData={client.nutrition} />
        </Card>
        {/* Mental Wellness */}
        <Card className={`${sectionCard} p-6`}>
          <MentalWellness mentalHealthData={client.mentalHealth} />
        </Card>
      </div>

      {/* Progress Photos Section */}
      <Card className={`${sectionCard} p-6`}>
        <CardHeader className="pb-3 px-0 pt-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Progress Photos 📸
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Visual progress and comparison over time.
          </p>
        </CardHeader>
        <CardContent className="px-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {client.progressPhotos.length > 0 ? (
              client.progressPhotos.map((p, idx) => (
                <div key={idx} className="space-y-2">
                  <div className={`aspect-square w-full overflow-hidden rounded-xl ${p.isNewest ? 'ring-2 ring-primary' : 'ring-1 ring-border'}`}>
                    <img src={p.url} alt={`Progress ${p.date}`} className="h-full w-full object-cover" />
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>{p.date}</span>
                    {p.isNewest && <span className="text-primary font-semibold">Newest</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-sm text-muted-foreground">
                No progress photos available yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientInsights;

/** Reusable Trend Pill Component */
const TrendPill = ({ label, value }: { label: string; value: string }) => {
  const arrow = value === '↑' ? 'text-emerald-600' : value === '↓' ? 'text-rose-600' : 'text-muted-foreground';
  return (
    <div className="flex items-center justify-between rounded-full bg-muted/50 px-3 py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-base font-bold ml-2 ${arrow}`}>{value}</span>
    </div>
  );
};
