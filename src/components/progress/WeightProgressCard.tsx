// src/components/customer/progress/WeightProgressCard.tsx
import { WeightEntry } from '@/mockdata/progress/mockProgressData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowDown, ArrowUp } from 'lucide-react';

export default function WeightProgressCard({ data }: { data: WeightEntry[] }) {
  if (data.length < 2) return <div>Not enough data to show trend.</div>;

  const latestWeight = data[data.length - 1].weight;
  const startWeight = data[0].weight;
  const change = latestWeight - startWeight;
  const isDecreasing = change < 0;

  return (
    <div className="bg-card dark:bg-[#0d1218] p-4 rounded-xl border border-border/50">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Weight</p>
          <p className="text-3xl font-bold">{latestWeight.toFixed(1)} kg</p>
          <div className={`flex items-center text-sm font-semibold ${isDecreasing ? 'text-emerald-500' : 'text-red-500'}`}>
            {isDecreasing ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
            <span>{Math.abs(change).toFixed(1)} kg from start</span>
          </div>
        </div>
      </div>
      <div className="h-40 w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <XAxis dataKey="date" tickFormatter={(str) => str.slice(5)} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
