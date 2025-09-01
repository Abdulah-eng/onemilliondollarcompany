import { FitnessTrend } from '@/mockdata/progress/mockProgressData';
import { ArrowUp } from 'lucide-react';

export default function FitnessTrendCard({ trend }: { trend: FitnessTrend }) {
  return (
    <div className="bg-card dark:bg-[#0d1218] p-4 rounded-2xl border border-border/50">
        <p className="font-semibold">{trend.exerciseName}</p>
        <p className="text-2xl font-bold">{trend.currentAvg.toFixed(1)} {trend.unit}</p>
        <div className="flex items-center text-sm font-semibold text-emerald-500">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>{trend.trendPercentage}%</span>
        </div>
    </div>
  );
}
