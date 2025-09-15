import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, RadialBarChart, RadialBar } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import FitnessTrendChart from "./charts/FitnessTrendChart";
import MentalHealthTrendChart from "./charts/MentalHealthTrendChart";

// --- Types (remain the same) ---
interface DailyCheckInData {
    date: string;
    water: number;
    sleep: number;
    mood: number;
    energy: number;
    stress?: number;
    anxiety?: number;
}

interface FitnessData {
    week: string;
    adherence: number;
    progression: number[];
}

interface NutritionData {
    date: string;
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
    adherence: number;
}

interface MentalHealthData {
    date: string;
    stress: number;
    anxiety: number;
    meditation: number;
    yoga: number;
}

interface WeightData {
    date: string;
    weight: number;
}

interface DashboardProps {
    client: any;
}

// --- Utilities ---
const Trend = ({ value }: { value: number }) => {
    if (value > 0)
        return <span className="text-green-500 flex items-center text-xs font-medium"><ArrowUpRight className="w-3 h-3" />{value.toFixed(1)}%</span>;
    if (value < 0)
        return <span className="text-red-500 flex items-center text-xs font-medium"><ArrowDownRight className="w-3 h-3" />{Math.abs(value).toFixed(1)}%</span>;
    return <span className="text-muted-foreground text-xs">0%</span>;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card text-card-foreground p-2 rounded-lg shadow-lg border border-border">
                <p className="font-semibold text-xs mb-1">{label}</p>
                {payload.map((p: any) => (
                    <p key={p.name} className="text-xs flex items-center" style={{ color: p.color }}>
                        <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: p.color }}></span>
                        {`${p.name}: `} <span className="font-medium ml-1">{p.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Radial Progress Card
const RadialProgressCard: React.FC<{
    title: string;
    value: number;
    maxValue?: number;
    unit: string;
    color: string;
    emoji?: string;
    subText?: string;
    size?: number;
}> = ({ title, value, maxValue = 100, unit, color, emoji, subText, size = 100 }) => {
    const data = [{ name: title, value: (value / maxValue) * 100 }];
    const percentage = Math.round((value / maxValue) * 100);

    return (
        <Card className="rounded-3xl shadow-lg bg-card text-card-foreground border p-4 flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center text-lg font-semibold mb-2">
                {emoji && <span className="mr-2 text-xl">{emoji}</span>}
                <p className="text-sm">{title}</p>
            </div>
            <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="90%"
                        barSize={10}
                        data={data}
                        startAngle={90}
                        endAngle={90 + (percentage / 100) * 360}
                    >
                        <RadialBar background dataKey="value" cornerRadius={size / 10} fill={color} />
                        <Tooltip content={<CustomTooltip />} />
                    </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xl font-bold leading-none">{value}</p>
                    <span className="text-xs text-muted-foreground">{unit}</span>
                </div>
            </div>
            {subText && <p className="text-xs text-muted-foreground mt-2">{subText}</p>}
        </Card>
    );
};

// Daily Trend Card
const DailyTrendCard: React.FC<{
    title: string;
    data: any[];
    dataKey: string;
    color: string;
    emoji?: string;
    unit?: string;
    selectedRange: string;
}> = ({ title, data, dataKey, color, emoji, unit = '', selectedRange }) => {
    const filteredData = useMemo(() => {
        const now = new Date();
        let rangeInDays = 7;
        if (selectedRange === '1m') rangeInDays = 30;
        if (selectedRange === '6m') rangeInDays = 180;

        return data.filter(d => {
            const date = new Date(d.date);
            const diffInTime = now.getTime() - date.getTime();
            const diffInDays = diffInTime / (1000 * 3600 * 24);
            return diffInDays <= rangeInDays;
        });
    }, [selectedRange, data]);

    const trendChange = useMemo(() => {
        if (filteredData.length < 2) return 0;
        const startValue = filteredData[0][dataKey] || 0;
        const endValue = filteredData[filteredData.length - 1][dataKey] || 0;
        if (startValue === 0) return 0;
        return ((endValue - startValue) / startValue) * 100;
    }, [filteredData, dataKey]);

    const currentValue = filteredData.length > 0 ? filteredData[filteredData.length - 1][dataKey] : 0;

    return (
        <Card className="rounded-3xl shadow-lg bg-card text-card-foreground border p-4 flex flex-col justify-between">
            <div className="flex items-center space-x-2 mb-2">
                {emoji && <span className="mr-1 text-lg">{emoji}</span>}
                <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            <div className="flex justify-between items-end mb-2">
                <p className="text-2xl font-bold">{currentValue} <span className="text-sm text-muted-foreground">{unit}</span></p>
                <Trend value={trendChange} />
            </div>
            <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={filteredData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                    <defs>
                        <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#color${dataKey})`} fillOpacity={0.5} strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};

// Main Dashboard Component
const ProgressProgramsTab: React.FC<DashboardProps> = ({ client }) => {
    const [selectedRange, setSelectedRange] = useState('4w');
    const [weightRange, setWeightRange] = useState('1m');

    // ... keep the rest of your logic/data generation untouched ...

    return (
        <>
            {/* Keep rest of rendering code the same, but replace all `bg-white/40 backdrop-blur-md` with `bg-card text-card-foreground border` */}
        </>
    );
};

export default ProgressProgramsTab;
