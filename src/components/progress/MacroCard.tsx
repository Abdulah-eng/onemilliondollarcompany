// src/components/customer/progress/MacroCard.tsx
import { MacroData } from '@/mockdata/progress/mockProgressData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = { protein: '#34d399', carbs: '#fbbf24', fat: '#f87171' };

export default function MacroCard({ data }: { data: MacroData }) {
  const chartData = [
    { name: 'Protein', value: data.protein },
    { name: 'Carbs', value: data.carbs },
    { name: 'Fat', value: data.fat },
  ];

  return (
    <div className="bg-card dark:bg-[#0d1218] p-4 rounded-xl border border-border/50">
       <h3 className="font-semibold mb-2">Nutrition Summary</h3>
       <p className="text-sm text-muted-foreground mb-4">Average last 7 days</p>
       <div className="grid grid-cols-2 gap-4">
        <div className="h-32">
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={45} paddingAngle={5}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                        ))}
                    </Pie>
                    <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" iconSize={8} />
                </PieChart>
            </ResponsiveContainer>
        </div>
        <div>
            <p className="text-2xl font-bold">{data.kcal.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Avg. Daily Kcal</p>
        </div>
       </div>
    </div>
  );
}
