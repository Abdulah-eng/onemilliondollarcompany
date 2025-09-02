// src/components/customer/progress/CheckinTrendCard.tsx
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface CheckinTrendCardProps {
    title: string;
    icon: string;
    value: string;
    data: any[];
    dataKey: string;
    color: string;
    gradient: string;
    insight: string;
    onClick: () => void;
}

export default function CheckinTrendCard({ title, icon, value, data, dataKey, gradient, insight, onClick }: CheckinTrendCardProps) {
    const latestValue = data.length > 0 ? data[data.length - 1][dataKey] : 0;
    const previousValue = data.length > 1 ? data[data.length - 2][dataKey] : 0;
    const trend = latestValue - previousValue;
    
    return (
        <motion.div
            className={`flex-shrink-0 w-64 h-48 p-4 rounded-2xl flex flex-col justify-between text-white bg-gradient-to-br ${gradient} cursor-pointer shadow-lg hover:scale-105 transition-transform duration-300`}
            onClick={onClick}
            whileHover={{ y: -5 }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-2xl">{icon}</p>
                    <p className="font-semibold">{title}</p>
                </div>
                <div className="w-16 h-8 -mr-2">
                    <ResponsiveContainer>
                        <LineChart data={data}>
                            <Line type="monotone" dataKey={dataKey} stroke="white" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div>
                 <p className="text-3xl font-bold">{value.split(' ')[0]} <span className="text-lg font-normal opacity-80">{value.split(' ')[1]}</span></p>
                 <p className="text-xs opacity-80 mt-1">{insight}</p>
            </div>
        </motion.div>
    );
}
