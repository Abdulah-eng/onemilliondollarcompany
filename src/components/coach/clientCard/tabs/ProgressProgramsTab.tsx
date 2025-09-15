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
  unit?: string;
  color: string;
  emoji?: string;
  subText?: string;
  size?: number;
}> = ({ title, value, maxValue = 100, unit = '', color, emoji, subText, size = 120 }) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <Card className="rounded-2xl shadow-lg bg-card border-none p-4 flex flex-col items-center justify-center min-h-[200px]">
      <div className="relative" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="90%" data={[{ value: percentage }]}>
            <RadialBar dataKey="value" cornerRadius={10} fill={color} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl">{emoji}</div>
          <div className="text-lg font-bold text-foreground">{value}{unit}</div>
        </div>
      </div>
      <div className="text-center mt-3">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        {subText && <p className="text-xs text-muted-foreground mt-1">{subText}</p>}
      </div>
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
  const rangeInDays = selectedRange === '4w' ? 28 : selectedRange === '12w' ? 84 : 168;
  const filteredData = data.slice(-rangeInDays);
  
  const currentValue = filteredData[filteredData.length - 1]?.[dataKey] || 0;
  const previousValue = filteredData[filteredData.length - 8]?.[dataKey] || 0;
  const trend = ((currentValue - previousValue) / previousValue) * 100;
  
  return (
    <Card className="rounded-2xl shadow-lg bg-card border-none p-4 min-h-[200px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {emoji && <span className="text-lg">{emoji}</span>}
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        </div>
        <Trend value={trend} />
      </div>
      <div className="mb-3">
        <span className="text-2xl font-bold text-foreground">{currentValue.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground ml-1">{unit}</span>
      </div>
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData.slice(-14)}>
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// Main dashboard component
const ProgressProgramsTab: React.FC<DashboardProps> = ({ client }) => {
    // State for time range selectors
    const [selectedRange, setSelectedRange] = useState('4w'); // For fitness and mental health (weekly)
    const [weightRange, setWeightRange] = useState('1m'); // For weight journey (monthly)

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

    // Extended nutrition data for 30+ days
    const dummyNutrition = useMemo(() => {
        return Array.from({ length: 35 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            return {
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                protein: isWeekend ? 100 + Math.random() * 40 : 110 + Math.random() * 30,
                carbs: isWeekend ? 250 + Math.random() * 60 : 270 + Math.random() * 40,
                fat: isWeekend ? 60 + Math.random() * 20 : 65 + Math.random() * 15,
                calories: isWeekend ? 2100 + Math.random() * 400 : 2000 + Math.random() * 300,
            };
        }).reverse();
    }, []);

    const dummyMentalHealth = [
        { date: 'Mon', stress: 7, anxiety: 6, meditation: 30, yoga: 0 },
        { date: 'Tue', stress: 6, anxiety: 5, meditation: 45, yoga: 0 },
        { date: 'Wed', stress: 5, anxiety: 4, meditation: 60, yoga: 30 },
        { date: 'Thu', stress: 7, anxiety: 6, meditation: 30, yoga: 0 },
        { date: 'Fri', stress: 6, anxiety: 5, meditation: 45, yoga: 0 },
    ].map((d, i) => ({ ...d, date: `${i + 1}/${new Date().getMonth() + 1}` }));

    // Extended weight data for 12+ months (daily data for aggregation)
    const dummyWeightTrend = useMemo(() => {
        return Array.from({ length: 365 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return {
                date: date.toISOString().split('T')[0],
                weight: 180 - (i * 0.03) + (Math.random() * 1.5 - 0.75), // Gradual weight loss with daily fluctuation
            };
        }).reverse();
    }, []);

    // Aggregate weight data based on selected range
    const aggregateWeightData = useMemo(() => {
        const rawData = weight.length > 0 ? weight : dummyWeightTrend;
        const now = new Date();
        
        // Get data within range
        const filteredData = rawData.filter(d => {
            const date = new Date(d.date);
            const diffInDays = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
            const rangeInDays = weightRange === '1m' ? 30 : weightRange === '3m' ? 90 : weightRange === '6m' ? 180 : 365;
            return diffInDays <= rangeInDays && diffInDays >= 0;
        });

        const aggregateData = (data, periods, periodLength, labelFormat) => {
            const result = [];
            for (let i = 0; i < periods; i++) {
                const startIdx = i * Math.floor(data.length / periods);
                const endIdx = (i + 1) * Math.floor(data.length / periods);
                const chunk = data.slice(startIdx, endIdx);
                
                if (chunk.length > 0) {
                    const avgWeight = chunk.reduce((sum, item) => sum + item.weight, 0) / chunk.length;
                    const startDate = new Date(chunk[0].date);
                    const endDate = new Date(chunk[chunk.length - 1].date);
                    
                    let label;
                    switch (labelFormat) {
                        case 'week':
                            label = `W${i + 1}`;
                            break;
                        case 'biweek':
                            label = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${endDate.toLocaleDateString('en-US', { day: 'numeric' })}`;
                            break;
                        case 'triweek':
                            label = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-${endDate.toLocaleDateString('en-US', { day: 'numeric' })}`;
                            break;
                        case 'month':
                            label = startDate.toLocaleDateString('en-US', { month: 'short' });
                            break;
                        default:
                            label = `Period ${i + 1}`;
                    }
                    
                    result.push({
                        date: chunk[Math.floor(chunk.length / 2)].date, // Middle date for reference
                        weight: parseFloat(avgWeight.toFixed(1)),
                        label,
                        periodStart: startDate,
                        periodEnd: endDate,
                        periodType: labelFormat
                    });
                }
            }
            return result;
        };

        switch (weightRange) {
            case '1m':
                return aggregateData(filteredData, 4, 7, 'week'); // 4 weeks
            case '3m':
                return aggregateData(filteredData, 6, 14, 'biweek'); // 6 bi-weekly periods
            case '6m':
                return aggregateData(filteredData, 8, 21, 'triweek'); // 8 tri-weekly periods
            case '12m':
                return aggregateData(filteredData, 12, 30, 'month'); // 12 monthly periods
            default:
                return aggregateData(filteredData, 4, 7, 'week');
        }
    }, [weight, dummyWeightTrend, weightRange]);

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
        <>
            {/* Time Range Selector for Fitness & Mental Health */}
            <div className="flex justify-center sm:justify-end mb-4 sm:mb-6">
                <div className="bg-card/80 backdrop-blur-md rounded-full border border-border p-1 flex shadow-sm">
                    {['4w', '12w', '24w'].map(range => (
                        <button
                            key={range}
                            onClick={() => setSelectedRange(range)}
                            className={`text-xs sm:text-sm font-medium px-2 sm:px-3 lg:px-4 py-1 rounded-full transition-all duration-300 ${
                                selectedRange === range
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'text-muted-foreground hover:bg-muted'
                            }`}
                        >
                            {range === '4w' ? '4 Weeks' : range === '12w' ? '12 Weeks' : '24 Weeks'}
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
                <Card className="rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl bg-card border border-border p-3 sm:p-4 lg:p-6 md:col-span-2 lg:col-span-3">
                    <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                         <h3 className="text-lg sm:text-xl font-bold text-foreground">Nutrition Fuel 🍎</h3>
                    </div>
                    <CardContent className="p-0 h-48 sm:h-56 lg:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={nutrition.length > 0 ? nutrition : dummyNutrition} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    className="text-xs text-muted-foreground" 
                                    tick={{ fontSize: 10 }}
                                />
                                <YAxis 
                                    className="text-xs text-muted-foreground" 
                                    tick={{ fontSize: 10 }}
                                />
                                <Tooltip 
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-card/95 p-4 rounded-xl shadow-xl backdrop-blur-md border border-border text-foreground min-w-[280px]">
                                                    <div className="border-b border-border pb-2 mb-3">
                                                        <p className="font-bold text-sm text-foreground">{label}</p>
                                                        <p className="text-xs text-muted-foreground">Nutrition Overview</p>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-muted-foreground">🔥 Calories:</span>
                                                            <span className="font-semibold text-sm text-orange-600">{data.calories} kcal</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-muted-foreground">🥩 Protein:</span>
                                                            <span className="font-semibold text-sm text-blue-600">{data.protein}g</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-muted-foreground">🍞 Carbs:</span>
                                                            <span className="font-semibold text-sm text-green-600">{data.carbs}g</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-muted-foreground">🥑 Fats:</span>
                                                            <span className="font-semibold text-sm text-purple-600">{data.fat}g</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 pt-2 border-t border-border">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-xs text-muted-foreground">📊 Goal Progress:</span>
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

                {/* Weight Journey with Monthly Time Ranges */}
                <Card className="rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl bg-card border border-border p-3 sm:p-4 lg:p-6 md:col-span-full lg:col-span-full xl:col-span-full">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-lg sm:text-xl font-bold text-foreground">Weight Journey ⚖️</h3>
                        {/* Weight Range Selector */}
                        <div className="flex gap-1">
                            {['1m', '3m', '6m', '12m'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setWeightRange(range)}
                                    className={`px-2 py-1 rounded-full text-xs transition-colors ${
                                        weightRange === range
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted hover:bg-muted/80'
                                    }`}
                                >
                                    {range === '1m' ? '1M' : range === '3m' ? '3M' : range === '6m' ? '6M' : '12M'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <CardContent className="p-0 h-64 sm:h-72 lg:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={aggregateWeightData} 
                                key={`weight-chart-${weightRange}`}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                <XAxis 
                                    dataKey="label" 
                                    className="text-xs text-muted-foreground" 
                                    tick={{ fontSize: 10 }}
                                />
                                <YAxis 
                                    className="text-xs text-muted-foreground" 
                                    tick={{ fontSize: 10 }}
                                    domain={['dataMin - 2', 'dataMax + 2']}
                                />
                                <Tooltip 
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            const goalWeight = 160; // You can make this dynamic
                                            const progress = Math.round(((180 - data.weight) / (180 - goalWeight)) * 100);
                                            const weightLoss = 180 - data.weight;
                                            
                                            // Determine period description
                                            const getPeriodDescription = () => {
                                                switch (data.periodType) {
                                                    case 'week':
                                                        return `Week ${label}`;
                                                    case 'biweek':
                                                        return `2-Week Period: ${data.periodStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${data.periodEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                                                    case 'triweek':
                                                        return `3-Week Period: ${data.periodStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${data.periodEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                                                    case 'month':
                                                        return `${data.periodStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
                                                    default:
                                                        return label;
                                                }
                                            };
                                            
                                            return (
                                                <div className="bg-card/95 p-4 rounded-xl shadow-xl backdrop-blur-md border border-border text-foreground min-w-[280px]">
                                                    <div className="border-b border-border pb-2 mb-3">
                                                        <p className="font-bold text-sm text-foreground">{getPeriodDescription()}</p>
                                                        <p className="text-xs text-muted-foreground">Average Weight</p>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-muted-foreground">⚖️ Average:</span>
                                                            <span className="font-semibold text-sm text-purple-600">{data.weight.toFixed(1)} lbs</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-muted-foreground">🎯 Goal:</span>
                                                            <span className="font-semibold text-sm text-blue-600">{goalWeight} lbs</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-muted-foreground">📉 Lost:</span>
                                                            <span className="font-semibold text-sm text-green-600">{weightLoss.toFixed(1)} lbs</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-muted-foreground">📊 Progress:</span>
                                                            <span className="font-semibold text-sm text-green-600">{progress}%</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 pt-2 border-t border-border">
                                                        <p className="text-xs text-center font-medium">
                                                            {data.weight <= goalWeight ? '🎉 Goal achieved! Amazing work!' : 
                                                             progress >= 80 ? '💪 So close to your goal!' : 
                                                             progress >= 50 ? '🔥 Halfway there, keep going!' :
                                                             '📈 Every step counts!'}
                                                        </p>
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
        </>
    );
};

export default ProgressProgramsTab;
