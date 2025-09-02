// src/components/customer/progress/MentalHealthProgression.tsx
import { ProgressData } from '@/mockdata/progress/mockProgressData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BrainCircuit, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MentalHealthProgression({ mentalHealth, dailyCheckins }: { mentalHealth: ProgressData['mentalHealth'], dailyCheckins: ProgressData['dailyCheckins'] }) {
    const last7DaysCheckins = dailyCheckins.slice(-7);

    const getYogaStreak = () => {
        let streak = 0;
        for (let i = mentalHealth.yogaSessions.length - 1; i >= 0; i--) {
            if (mentalHealth.yogaSessions[i].completed) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };
    
    return (
        <motion.div 
            className="bg-card dark:bg-[#0d1218] p-4 sm:p-6 rounded-2xl border border-border/50 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-semibold mb-2">Meditation Trend (minutes)</h4>
                    <div className="h-40 w-full">
                        <ResponsiveContainer>
                            <BarChart data={mentalHealth.meditationMinutes} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="minutes" fill="hsl(var(--primary))" barSize={15} radius={[5, 5, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold mb-2">Stress/Anxiety Log</h4>
                    <div className="h-40 w-full">
                        <ResponsiveContainer>
                            <LineChart data={last7DaysCheckins} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip />
                                <Line type="monotone" dataKey="stressLevel" stroke="#f87171" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div className="flex justify-around pt-4 border-t border-border/50">
                <div className="text-center">
                    <p className="text-2xl font-bold">{getYogaStreak()}</p>
                    <p className="text-sm text-muted-foreground">Yoga Session Streak</p>
                </div>
                 <div className="text-center">
                    <p className="text-2xl font-bold">7 days</p>
                    <p className="text-sm text-muted-foreground">Journaling Streak</p>
                </div>
            </div>
        </motion.div>
    );
}
