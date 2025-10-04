// src/components/customer/dashboard/QuickStats.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { usePaymentPlan } from '@/hooks/usePaymentPlan';
import { useWeightTracking } from '@/hooks/useWeightTracking';

const QuickStats = () => {
  const { profile } = useAuth();
  const { planStatus } = usePaymentPlan();
  const { checkins } = useDailyCheckins();
  const { getWeightTrend, getWeightHistory, entries: weightEntries, addWeightEntry } = useWeightTracking();
  const [stats, setStats] = useState({
    avgWater: '0.0 L',
    avgEnergy: 'N/A',
    avgSleep: '0.0 hrs',
    avgMood: 'N/A',
    weightTrend: '0.0 kg',
    goalAdherence: 0,
  });
  const [loading, setLoading] = useState(true);

  // Test function to add sample weight data
  const addSampleWeightData = async () => {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Add weight entries for testing
      await addWeightEntry(70.5, today.toISOString().split('T')[0], 'Test entry - today');
      await addWeightEntry(71.0, yesterday.toISOString().split('T')[0], 'Test entry - yesterday');
      
      console.log('Sample weight data added');
      // Recalculate stats
      calculateStats();
    } catch (error) {
      console.error('Failed to add sample weight data:', error);
    }
  };

  // Determine user plan level based on profile plan and payment status
  const getUserPlanLevel = () => {
    if (!profile?.plan) return 0;
    
    // Map database plan values to plan levels
    const planMapping = {
      'trial': 1,
      'platform_monthly': 3,  // This should be premium level
      'platform_yearly': 3,   // This should be premium level
      'standard': 2,
      'premium': 3
    };
    
    return planMapping[profile.plan] || 0;
  };
  
  const userPlanLevel = getUserPlanLevel();


  useEffect(() => {
    const calculateStats = () => {
      if (!checkins || checkins.length === 0) {
        setLoading(false);
        return;
      }

      // Get last 7 days of data
      const last7Days = checkins.slice(-7);
      
      // Calculate averages
      const avgWater = last7Days.reduce((sum, c) => sum + (c.water_liters || 0), 0) / last7Days.length;
      const avgEnergy = last7Days.reduce((sum, c) => sum + (c.energy || 0), 0) / last7Days.length;
      const avgSleep = last7Days.reduce((sum, c) => sum + (c.sleep_hours || 0), 0) / last7Days.length;
      const avgMood = last7Days.reduce((sum, c) => sum + (c.mood || 0), 0) / last7Days.length;

      // Calculate weight trend from real data
      const weightTrend = getWeightTrend();
      console.log('Weight trend calculation:', {
        weightEntries: weightEntries.length,
        entries: weightEntries,
        trend: weightTrend
      });

      // Calculate goal adherence (simplified)
      const completedDays = last7Days.filter(c => c.water_liters && c.energy && c.sleep_hours && c.mood).length;
      const goalAdherence = Math.round((completedDays / last7Days.length) * 100);

      setStats({
        avgWater: `${avgWater.toFixed(1)} L`,
        avgEnergy: avgEnergy > 3.5 ? 'Good' : avgEnergy > 2.5 ? 'Fair' : 'Low',
        avgSleep: `${avgSleep.toFixed(1)} hrs`,
        avgMood: avgMood > 3.5 ? 'Positive' : avgMood > 2.5 ? 'Neutral' : 'Low',
        weightTrend: weightEntries.length === 0 ? 'No data' : weightEntries.length === 1 ? 'Need more data' : `${weightTrend > 0 ? '+' : ''}${weightTrend.toFixed(1)} kg`,
        goalAdherence,
      });
      setLoading(false);
    };

    calculateStats();
  }, [checkins, weightEntries]);

  const statItems = [
    { label: "Avg. Water", value: stats.avgWater, emoji: '💧', requiredPlan: 1, color: 'blue' },
    { label: "Avg. Energy", value: stats.avgEnergy, emoji: '⚡️', requiredPlan: 1, color: 'green' },
    { label: "Avg. Sleep", value: stats.avgSleep, emoji: '😴', requiredPlan: 1, color: 'indigo' },
    { label: "Avg. Mood", value: stats.avgMood, emoji: '😊', requiredPlan: 1, color: 'rose' },
    { label: "Weight Trend", value: stats.weightTrend, emoji: '⚖️', requiredPlan: 3, trend: 'down', color: 'sky' },
    { label: "Goal Adherence", value: `${stats.goalAdherence}%`, emoji: '🎯', requiredPlan: 3, trend: 'up', color: 'purple' },
  ];

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Your Weekly Stats</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Your Weekly Stats</h2>
          {weightEntries.length === 0 && (
            <button 
              onClick={addSampleWeightData}
              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20"
            >
              Add Test Data
            </button>
          )}
        </div>
        <div className="p-1 -m-1">
            <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {statItems.map((stat) => (
                    <StatCard
                    key={stat.label}
                    {...stat}
                    isLocked={stat.requiredPlan > userPlanLevel}
                    />
                ))}
            </div>
        </div>
    </div>
  );
};

// Updated themes to be fully responsive for both light and dark modes
const statCardThemes = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-900 dark:bg-blue-900/30 dark:border-blue-700/80 dark:text-blue-200',
    green: 'from-emerald-50 to-green-100 border-emerald-200 text-emerald-900 dark:bg-emerald-900/30 dark:border-emerald-700/80 dark:text-emerald-200',
    indigo: 'from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-900 dark:bg-indigo-900/30 dark:border-indigo-700/80 dark:text-indigo-200',
    rose: 'from-rose-50 to-rose-100 border-rose-200 text-rose-900 dark:bg-rose-900/30 dark:border-rose-700/80 dark:text-rose-200',
    sky: 'from-sky-50 to-sky-100 border-sky-200 text-sky-900 dark:bg-sky-900/30 dark:border-sky-700/80 dark:text-sky-200',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-900 dark:bg-purple-900/30 dark:border-purple-700/80 dark:text-purple-200',
};

interface StatCardProps {
  emoji: string;
  label: string;
  value: string;
  isLocked: boolean;
  trend?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ emoji, label, value, isLocked, trend, color }) => {
  const theme = statCardThemes[color];

  if (isLocked) {
    return (
      <Card className="min-w-[160px] flex-1 shadow-sm bg-card border">
        <CardContent className="p-4 flex flex-col justify-center items-center h-full text-center gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-lg filter grayscale">{emoji}</span>
            <p className="text-xs font-semibold">{label}</p>
          </div>
          <div className="flex flex-col items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
              <Lock size={12} />
              <span>Premium Feature</span>
            </div>
            <Button size="sm" className="h-7 px-3 text-xs bg-orange-500 hover:bg-orange-600 rounded-full">Upgrade</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("min-w-[160px] flex-1 shadow-sm hover:shadow-lg transition-all duration-300 border bg-gradient-to-br dark:bg-none", theme)}>
        <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{emoji}</span>
                <p className="text-xs font-semibold">{label}</p>
            </div>
            
            <div className="flex items-baseline gap-1.5 mt-2">
                <p className="text-2xl font-bold dark:text-white">{value}</p>
                {trend && (
                    <div className={cn("flex items-center font-bold text-xs", trend === 'up' ? 'text-emerald-500' : 'text-rose-500')}>
                        {trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
  );
};

export default QuickStats;
