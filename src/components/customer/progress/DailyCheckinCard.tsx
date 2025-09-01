import { DailyCheckin } from '@/mockdata/progress/mockProgressData';
import { Droplets, Moon, Battery, Heart } from 'lucide-react';

const getMoodColor = (mood: string) => {
  switch (mood) {
    case 'great': return 'text-green-500';
    case 'good': return 'text-blue-500';
    case 'okay': return 'text-yellow-500';
    case 'bad': return 'text-red-500';
    default: return 'text-muted-foreground';
  }
};

const getMoodIcon = (mood: string) => {
  switch (mood) {
    case 'great': return '😄';
    case 'good': return '😊';
    case 'okay': return '😐';
    case 'bad': return '😔';
    default: return '🙂';
  }
};

export default function DailyCheckinCard({ checkin }: { checkin: DailyCheckin }) {
  return (
    <div className="bg-card dark:bg-[#0d1218] p-4 rounded-2xl border border-border/50">
      <div className="text-sm font-medium mb-3">
        {new Date(checkin.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-sm">Water</span>
          </div>
          <span className="text-sm font-medium">{checkin.waterLiters.toFixed(1)}L</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-purple-500" />
            <span className="text-sm">Sleep</span>
          </div>
          <span className="text-sm font-medium">{checkin.sleepHours.toFixed(1)}h</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Battery className="h-4 w-4 text-orange-500" />
            <span className="text-sm">Energy</span>
          </div>
          <span className="text-sm font-medium">{checkin.energyLevel}/5</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className={`h-4 w-4 ${getMoodColor(checkin.mood)}`} />
            <span className="text-sm">Mood</span>
          </div>
          <span className="text-lg">{getMoodIcon(checkin.mood)}</span>
        </div>
      </div>
    </div>
  );
}