// src/components/customer/progress/WeightProgressCard.tsx
import { WeightEntry } from '@/mockdata/progress/mockProgressData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WeightProgressCard({ data }: { data: WeightEntry[] }) {
  if (data.length < 2) return <div>Not enough data to show trend.</div>;

  const latestWeight = data[data.length - 1].weight;
  const startWeight = data[0].weight;
  const change = latestWeight - startWeight;
  const isDecreasing = change < 0;

  return (
    <motion.div 
        className="bg-card dark:bg-[#0d1218] p-4 sm:p-6 rounded-2xl border border-border/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xl font-bold">Weight Graph</p>
          <p className="text-sm text-muted-foreground">{startWeight.toFixed(1)}kg to {latestWeight.toFixed(1)}kg</p>
        </div>
        <div className={`flex items-center text-sm font-semibold ${isDecreasing ? 'text-emerald-500' : 'text-red-500'}`}>
            {isDecreasing ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
            <span>{Math.abs(change).toFixed(1)} kg</span>
        </div>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short' })} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
