import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DailyCheckIn from '@/components/coach/clientCard/ClientInsights/DailyCheckIn';
import WeightTrend from '@/components/coach/clientCard/ClientInsights/WeightTrend';
import ProgramCompletion from '@/components/coach/clientCard/ClientInsights/ProgramCompletion';
import NutritionInsights from '@/components/coach/clientCard/ClientInsights/NutritionInsights';
import MentalWellness from '@/components/coach/clientCard/ClientInsights/MentalWellness';
import { Calendar, TrendingUp, Activity, Utensils, Brain, Camera } from 'lucide-react';

interface InsightsTabProps {
  client: any;
}

const InsightsTab: React.FC<InsightsTabProps> = ({ client }) => {
  const [timeRange, setTimeRange] = useState<'1week' | '1month' | '6months'>('1month');

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Health & Progress Insights</h2>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-[140px] rounded-full">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1week">1 Week</SelectItem>
            <SelectItem value="1month">1 Month</SelectItem>
            <SelectItem value="6months">6 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Check-ins */}
        <Card className="rounded-2xl border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5 text-blue-500" />
              Daily Check-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DailyCheckIn dailyCheckIn={client.dailyCheckIn} timeRange={timeRange} />
          </CardContent>
        </Card>

        {/* Weight Trend */}
        <Card className="rounded-2xl border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Weight Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeightTrend weightTrend={client.weightTrend} />
          </CardContent>
        </Card>

        {/* Program Completion */}
        <Card className="rounded-2xl border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-5 w-5 text-purple-500" />
              Program Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgramCompletion programFill={client.programFill} />
          </CardContent>
        </Card>

        {/* Nutrition Insights */}
        <Card className="rounded-2xl border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Utensils className="h-5 w-5 text-orange-500" />
              Nutrition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NutritionInsights nutritionData={client.nutrition} />
          </CardContent>
        </Card>

        {/* Mental Wellness */}
        <Card className="rounded-2xl border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-5 w-5 text-pink-500" />
              Mental Wellness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MentalWellness mentalHealthData={client.mentalHealth} />
          </CardContent>
        </Card>

        {/* Progress Photos */}
        <Card className="rounded-2xl border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Camera className="h-5 w-5 text-teal-500" />
              Progress Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {client.progressPhotos && client.progressPhotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {client.progressPhotos.slice(0, 4).map((photo: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted">
                      <img
                        src={photo.url}
                        alt={`Progress ${photo.date}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-xs text-center text-muted-foreground">
                      {photo.date}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No progress photos yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default InsightsTab;