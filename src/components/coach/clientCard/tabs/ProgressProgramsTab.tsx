import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, RadialBarChart, RadialBar, Legend } from "recharts";
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

// --- Custom Modern Components & Utilities ---

// Utility for simple trend arrows
const Trend = ({ value }: { value: number }) => {
    if (value > 0)
        return <span className="text-green-500 flex items-center text-xs font-medium"><ArrowUpRight className="w-3 h-3" />{value.toFixed(1)}%</span>;
    if (value < 0)
        return <span className="text-red-500 flex items-center text-xs font-medium"><ArrowDownRight className="w-3 h-3" />{Math.abs(value).toFixed(1)}%</span>;
    return <span className="text-gray-400 text-xs">0%</span>;
};

// Custom Tooltip for Recharts - Glassmorphism style
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/70 p-2 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200/50 text-gray-800">
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

// Radial Progress Card (for Adherence, Steps, Calories)
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
        <Card className="rounded-3xl shadow-lg bg-white/40 backdrop-blur-md border-none p-4 flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105 duration-300">
            <div className="flex items-center justify-center text-lg font-semibold text-gray-700 mb-2">
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
                    <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
                    <span className="text-xs text-gray-500">{unit}</span>
                </div>
            </div>
            {subText && <p className="text-xs text-gray-500 mt-2">{subText}</p>}
        </Card>
    );
};

// New Daily Trend Card for a consistent style
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
        <Card className="rounded-3xl shadow-lg bg-white/40 backdrop-blur-md border-none p-4 flex flex-col justify-between transition-transform transform hover:scale-105 duration-300">
            <div className="flex items-center space-x-2 mb-2">
                {emoji && <span className="mr-1 text-lg">{emoji}</span>}
                <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
            </div>
            <div className="flex justify-between items-end mb-2">
                <p className="text-2xl font-bold text-gray-900">{currentValue} <span className="text-sm text-gray-500">{unit}</span></p>
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

// Main dashboard component
const ProgressProgramsTab: React.FC<DashboardProps> = ({ client }) => {
    const [selectedRange, setSelectedRange] = useState('7d');

    // Extract and transform data
    const dailyCheckIns = client.dailyCheckIn || [];
    const fitness = client.fitness || { adherence: 0, progression: [] };
    const weight = client.weightTrend || [];
    const nutrition = Array.isArray(client.nutrition) ? client.nutrition : client.nutrition ? [client.nutrition] : [];
    const mentalHealth = Array.isArray(client.mentalHealth) ? client.mentalHealth : client.mentalHealth ? [client.mentalHealth] : [];

    // Dummy data for visualization if client data is sparse/empty
    const dummyDailyCheckIns = useMemo(() => {
        const data = [];
        const today = new Date();
        for (let i = 0; i < 180; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            data.push({
                date: d.toISOString().split('T')[0],
                water: Math.floor(Math.random() * 6) + 1, // 1-6 L
                sleep: parseFloat((Math.random() * (9 - 6) + 6).toFixed(1)), // 6-9 hours
                mood: Math.floor(Math.random() * 10) + 1, // 1-10
                energy: Math.floor(Math.random() * 10) + 1, // 1-10
                stress: Math.floor(Math.random() * 10) + 1, // 1-10
                anxiety: Math.floor(Math.random() * 10) + 1, // 1-10
            });
        }
        return data.reverse();
    }, []);

    const dummyNutrition = [
        { date: 'Mon', protein: 50, carbs: 150, fat: 30, calories: 1800 },
        { date: 'Tue', protein: 60, carbs: 160, fat: 35, calories: 1950 },
        { date: 'Wed', protein: 55, carbs: 140, fat: 28, calories: 1750 },
        { date: 'Thu', protein: 70, carbs: 180, fat: 40, calories: 2100 },
        { date: 'Fri', protein: 65, carbs: 170, fat: 32, calories: 2000 },
    ].map((d, i) => ({ ...d, date: `${i + 1}/${new Date().getMonth() + 1}` }));

    const dummyMentalHealth = [
        { date: 'Mon', stress: 7, anxiety: 6, meditation: 30, yoga: 0 },
        { date: 'Tue', stress: 6, anxiety: 5, meditation: 45, yoga: 0 },
        { date: 'Wed', stress: 5, anxiety: 4, meditation: 60, yoga: 30 },
        { date: 'Thu', stress: 7, anxiety: 6, meditation: 30, yoga: 0 },
        { date: 'Fri', stress: 6, anxiety: 5, meditation: 45, yoga: 0 },
    ].map((d, i) => ({ ...d, date: `${i + 1}/${new Date().getMonth() + 1}` }));

    const dummyWeightTrend = [
        { date: 'Jan', weight: 180 }, { date: 'Feb', weight: 178 }, { date: 'Mar', weight: 175 }, { date: 'Apr', weight: 176 }, { date: 'May', weight: 174 },
    ];

    // Modern, soft color palette
    const colors = {
        water: '#60A5FA', // Blue
        sleep: '#A78BFA', // Purple
        mood: '#FCD34D', // Yellow
        energy: '#F87171', // Red
        fitness: '#60A5FA', // Blue
        nutritionProtein: '#34D399', // Green
        nutritionCarbs: '#818CF8', // Indigo
        nutritionFat: '#FBBF24', // Amber
        nutritionCalories: '#EF4444', // Red-Orange
        mentalStress: '#FB923C', // Orange
        mentalAnxiety: '#F87171', // Red
        mentalMeditation: '#4ADE80', // Light Green
        mentalYoga: '#60A5FA', // Blue
        weight: '#A78BFA', // Purple
        heartRate: '#FF6B6B', // Red
        steps: '#818CF8', // Indigo
        exercise: '#50E3C2', // Teal
        caloriesBurned: '#FCD34D', // Yellow
    };

    const dailyData = dailyCheckIns.length > 0 ? dailyCheckIns : dummyDailyCheckIns;

    return (
        <div className="min-h-screen p-2 sm:p-3 md:p-4 font-sans antialiased bg-gray-50 text-gray-900">
            <div className="flex justify-center sm:justify-end mb-4 sm:mb-6">
                <div className="bg-white/40 backdrop-blur-md rounded-full border border-gray-200/50 p-1 flex shadow-sm">
                    {['7d', '1m', '6m'].map(range => (
                        <button
                            key={range}
                            onClick={() => setSelectedRange(range)}
                            className={`text-xs sm:text-sm font-medium px-2 sm:px-3 lg:px-4 py-1 rounded-full transition-all duration-300 ${
                                selectedRange === range
                                    ? 'bg-gray-800 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {range === '7d' ? '7d' : range === '1m' ? '1m' : '6m'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">

                {/* Daily Trend Cards */}
                <DailyTrendCard title="Water Intake" data={dailyData} dataKey="water" color={colors.water} emoji="💧" unit="L" selectedRange={selectedRange} />
                <DailyTrendCard title="Energy" data={dailyData} dataKey="energy" color={colors.energy} emoji="⚡" selectedRange={selectedRange} />
                <DailyTrendCard title="Mood" data={dailyData} dataKey="mood" color={colors.mood} emoji="😊" selectedRange={selectedRange} />
                <DailyTrendCard title="Stress" data={dailyData} dataKey="stress" color={colors.mentalStress} emoji="🧠" selectedRange={selectedRange} />
                <DailyTrendCard title="Sleep" data={dailyData} dataKey="sleep" color={colors.sleep} emoji="😴" unit="hrs" selectedRange={selectedRange} />
                <DailyTrendCard title="Anxiety" data={dailyData} dataKey="anxiety" color={colors.mentalAnxiety} emoji="💔" selectedRange={selectedRange} />

                {/* Small Radial Progress Cards (e.g., Fitness Adherence, Calories) */}
                <RadialProgressCard
                    title="Fitness Adherence"
                    value={fitness.adherence || 75}
                    unit="%"
                    color={colors.fitness}
                    emoji="💪"
                    subText="Last 7 days"
                    size={120}
                />

                <RadialProgressCard
                    title="Calories Burned"
                    value={client.stats?.caloriesBurned ? parseInt(client.stats.caloriesBurned.split(' ')[0]) : 245}
                    maxValue={500}
                    unit="Kcal"
                    color={colors.caloriesBurned}
                    emoji="🔥"
                    subText="Today"
                    size={120}
                />

                {/* Fitness Trend Chart */}
                <FitnessTrendChart data={fitness.progression || []} selectedRange={selectedRange} />

                {/* Mental Health Trend Chart */}
                <MentalHealthTrendChart data={mentalHealth} selectedRange={selectedRange} />

                {/* Nutrition Insights - Simplified with calories as bars */}
                <Card className="rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl bg-white/40 backdrop-blur-md border-none p-3 sm:p-4 lg:p-6 md:col-span-2 lg:col-span-3">
                    <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                         <h3 className="text-lg sm:text-xl font-bold text-gray-800">Nutrition Fuel 🍎</h3>
                    </div>
                    <CardContent className="p-0 h-48 sm:h-56 lg:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={nutrition.length > 0 ? nutrition : dummyNutrition} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    className="text-xs text-gray-500" 
                                    tick={{ fontSize: 10 }}
                                />
                                <YAxis 
                                    className="text-xs text-gray-500" 
                                    tick={{ fontSize: 10 }}
                                />
                                <Tooltip 
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-white/95 p-4 rounded-xl shadow-xl backdrop-blur-md border border-gray-200/50 text-gray-800 min-w-[280px]">
                                                    <div className="border-b border-gray-200/50 pb-2 mb-3">
                                                        <p className="font-bold text-sm text-gray-800">{label}</p>
                                                        <p className="text-xs text-gray-600">Nutrition Overview</p>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-gray-600">🔥 Calories:</span>
                                                            <span className="font-semibold text-sm text-orange-600">{data.calories} kcal</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-gray-600">🥩 Protein:</span>
                                                            <span className="font-semibold text-sm text-blue-600">{data.protein}g</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-gray-600">🍞 Carbs:</span>
                                                            <span className="font-semibold text-sm text-green-600">{data.carbs}g</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-gray-600">🥑 Fats:</span>
                                                            <span className="font-semibold text-sm text-purple-600">{data.fat}g</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 pt-2 border-t border-gray-200/50">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-xs text-gray-600">📊 Goal Progress:</span>
                                                            <span className="font-semibold text-sm text-primary">{Math.round((data.calories / 2200) * 100)}%</span>
                                                        </div>
                                                        {data.calories >= 2000 && data.calories <= 2400 && (
                                                            <p className="text-xs text-green-600 font-medium">🎯 Perfect calorie range!</p>
                                                        )}
                                                        {data.calories > 2400 && (
                                                            <p className="text-xs text-orange-600 font-medium">⚠️ Slightly over target</p>
                                                        )}
                                                        {data.calories < 2000 && (
                                                            <p className="text-xs text-blue-600 font-medium">📈 Room for more fuel</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar 
                                    dataKey="calories" 
                                    fill="#FBBF24" 
                                    radius={[6, 6, 0, 0]}
                                    cursor="pointer"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Weight Journey - Simplified with bars */}
                <Card className="rounded-3xl shadow-xl bg-white/40 backdrop-blur-md border-none p-6 md:col-span-full lg:col-span-full xl:col-span-full">
                    <div className="flex items-center space-x-2 mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Weight Journey ⚖️</h3>
                    </div>
                    <CardContent className="p-0 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weight.length > 0 ? weight : dummyWeightTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    className="text-xs"
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    className="text-xs"
                                />
                                <Tooltip 
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            const goalWeight = 160; // You can make this dynamic
                                            const progress = Math.round(((180 - data.weight) / (180 - goalWeight)) * 100);
                                            
                                            return (
                                                <div className="rounded-2xl shadow-2xl bg-white/95 backdrop-blur-md border border-gray-200/50 p-5 min-w-[250px]">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                            <span className="text-lg">⚖️</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-800">{label}</h4>
                                                            <p className="text-sm text-gray-500">Weight Progress</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                                                            <span className="text-sm font-medium text-gray-700">Current Weight</span>
                                                            <span className="font-bold text-purple-600">{data.weight} lbs</span>
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                                                            <span className="text-sm font-medium text-gray-700">Goal Weight</span>
                                                            <span className="font-bold text-blue-600">{goalWeight} lbs</span>
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                                                            <span className="text-sm font-medium text-gray-700">Progress</span>
                                                            <span className="font-bold text-green-600">{progress}%</span>
                                                        </div>
                                                        
                                                        <div className="bg-gray-50 rounded-lg p-2">
                                                            <p className="text-xs text-gray-600 text-center">
                                                                {data.weight <= goalWeight ? '🎯 Goal achieved!' : 
                                                                 progress >= 80 ? '💪 Almost there!' : 
                                                                 '📈 Keep going!'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar 
                                    dataKey="weight" 
                                    fill="#A855F7" 
                                    radius={[6, 6, 0, 0]}
                                    cursor="pointer"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                    
                    {/* Quick stats */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-3 sm:mt-4">
                        <div className="text-center">
                            <p className="text-sm sm:text-lg font-bold text-gray-800">-10 lbs</p>
                            <p className="text-xs text-gray-500">Total Progress</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm sm:text-lg font-bold text-gray-800">175 lbs</p>
                            <p className="text-xs text-gray-500">Current Weight</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProgressProgramsTab;
