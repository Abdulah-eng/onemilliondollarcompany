// src/components/coach/clientCard/ClientProgress/ClientProgress.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProgramFill from './ProgramFill';
import DailyCheckIn from './DailyCheckIn';
import WeightTrend from './WeightTrend';
import TimeRangeSelector, { TimeRange } from './TimeRangeSelector';
import { Card, CardContent } from '@/components/ui/card';
import { ClientDetailData } from '@/hooks/useClientDetail';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface ClientProgressProps {
  client: ClientDetailData;
}

// Data structures from the old code
type DailyCheckInPoint = { date: string; water: number; energy: number; sleep: number; mood: number };
type WeightPoint = { date: string; weight: number };

const ClientProgress: React.FC<ClientProgressProps> = ({ client }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1month');

  // Fetch daily check-in data
  const { data: dailyCheckIn = [], isLoading: dailyCheckInLoading } = useQuery<DailyCheckInPoint[]>({
    queryKey: ['daily-checkins', client.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('check_ins')
        .select('check_in_date, data')
        .eq('client_id', client.id)
        .order('check_in_date', { ascending: true });

      if (error) throw error;
      return (data || []).map(ci => ({
        date: ci.check_in_date,
        water: ci.data?.water ?? 0,
        energy: ci.data?.energy ?? 0,
        sleep: ci.data?.sleep ?? 0,
        mood: ci.data?.mood ?? 0,
      }));
    },
    enabled: !!client.id,
  });

  // Fetch weight trend data
  const { data: weightTrend = [], isLoading: weightTrendLoading } = useQuery<WeightPoint[]>({
    queryKey: ['weight-trend', client.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('weight_series', {
        p_customer_id: client.id,
        p_days: 180, // Fetch data for the last 6 months
      });

      if (error) throw error;
      return (data || []).map((row: any) => ({
        date: row.taken_at,
        weight: Number(row.weight_kg),
      }));
    },
    enabled: !!client.id,
  });

  // Mock data for program fill as it's not present in the old code
  const programFill = useMemo(() => ({
    fitness: 75,
    nutrition: 60,
    mentalHealth: 85,
  }), []);

  // Filter data based on time range
  const filterDataByTimeRange = (data: any[], dateField: string = 'date') => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case '1week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '1month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
    }
    return data.filter(item => new Date(item[dateField]) >= cutoffDate);
  };

  const filteredDailyCheckIn = useMemo(() => filterDataByTimeRange(dailyCheckIn), [dailyCheckIn, timeRange]);
  const filteredWeightTrend = useMemo(() => filterDataByTimeRange(weightTrend), [weightTrend, timeRange]);

  if (dailyCheckInLoading || weightTrendLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-0">
          Progress & Insights 📈
        </h3>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgramFill programFill={programFill} />
        <Card className="shadow-lg rounded-xl bg-card p-6">
          <DailyCheckIn dailyCheckIn={filteredDailyCheckIn} timeRange={timeRange} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-lg rounded-xl bg-card p-6">
          <WeightTrend weightTrend={filteredWeightTrend} timeRange={timeRange} />
        </Card>
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 h-96 rounded-xl shadow-lg flex items-center justify-center text-muted-foreground">
          [Detailed Insights Graph goes here]
        </Card>
      </div>
    </motion.div>
  );
};

export default ClientProgress;
