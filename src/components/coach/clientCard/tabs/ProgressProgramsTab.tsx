import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar, Legend } from "recharts";
import { ArrowUpRight, ArrowDownRight, Droplet, Moon, Smile, Zap, Dumbbell, Apple, Heart, Brain, Scale, CalendarDays, TrendingUp, Sparkles, SunDim, Snowflake } from "lucide-react";

// --- Types (remain the same) ---
interface DailyCheckInData {
    date: string;
    water: number;
    sleep: number;
    mood: number;
    energy: number;
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
        return <span className="text-green-500 flex items-center text-xs font-medium"><ArrowUpRight className="w-3 h-3" />{value}%</span>;
    if (value < 0)
        return <span className="text-red-500 flex items-center text-xs font-medium"><ArrowDownRight className="w-3 h-3" />{Math.abs(value)}%</span>;
    return <span className="text-gray-400 text-xs">0%</span>;
};

// Custom Tooltip for Recharts - Glassmorphism style
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/70 p-2 rounded-lg shadow-lg backdrop-blur-sm border border-gray-200/50 text-gray-800 animate-fade-in">
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
    value: number; // percentage or main value
    maxValue?: number; // for percentage calculation if value is raw
    unit: string;
    color: string;
    icon: React.ElementType;
    emoji?: string;
    subText?: string;
    size?: number;
}> = ({ title, value, maxValue = 100, unit, color, icon: Icon, emoji, subText, size = 100 }) => {
    const data = [{ name: title, value: (value / maxValue) * 100 }];
    const percentage = Math.round((value / maxValue) * 100);

    return (
        <Card className="rounded-3xl shadow-lg bg-white/40 backdrop-blur-md border-none p-4 flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105 duration-300">
            <div className="flex items-center justify-center text-lg font-semibold text-gray-700 mb-2">
                {emoji && <span className="mr-2 text-xl">{emoji}</span>}
                <Icon className="w-5 h-5 mr-1" style={{ color }} />
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

// Mini Sparkline Card (for quick trends like heart rate)
const MiniSparklineCard: React.FC<{
    title: string;
    value: string | number;
    unit: string;
    data: any[];
    dataKey: string;
    color: string;
    icon: React.ElementType;
    emoji?: string;
}> = ({ title, value, unit, data, dataKey, color, icon: Icon, emoji }) => (
    <Card className="rounded-3xl shadow-lg bg-white/40 backdrop-blur-md border-none p-4 transition-transform transform hover:scale-105 duration-300">
        <div className="flex items-center space-x-1 mb-2">
            {emoji && <span className="mr-1 text-lg">{emoji}</span>}
            <Icon className="w-4 h-4" style={{ color }} />
            <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value} <span className="text-sm text-gray-500">{unit}</span></p>
        <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <defs>
                    <linearGradient id={`color${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#color${title.replace(/\s/g, '')})`} fillOpacity={0.5} strokeWidth={2} />
            </AreaChart>
        </ResponsiveContainer>
    </Card>
);

// Main dashboard component
const ProgressProgramsTab: React.FC<DashboardProps> = ({ client }) => {
    // Extract and transform data
    const dailyCheckIns = client.dailyCheckIn || [];
    const fitness = client.fitness || { adherence: 0, progression: [] };
    const weight = client.weightTrend || [];
    const nutrition = Array.isArray(client.nutrition) ? client.nutrition : client.nutrition ? [client.nutrition] : [];
    const mentalHealth = Array.isArray(client.mentalHealth) ? client.mentalHealth : client.mentalHealth ? [client.mentalHealth] : [];

    // Dummy data for visualization if client data is sparse/empty
    const dummyDailyCheckIns = [
        { date: 'Mon', water: 3, sleep: 7, mood: 4, energy: 6 },
        { date: 'Tue', water: 5, sleep: 6, mood: 5, energy: 7 },
        { date: 'Wed', water: 4, sleep: 8, mood: 6, energy: 5 },
        { date: 'Thu', water: 6, sleep: 7, mood: 7, energy: 8 },
        { date: 'Fri', water: 7, sleep: 7, mood: 6, energy: 7 },
        { date: 'Sat', water: 6, sleep: 8, mood: 5, energy: 6 },
        { date: 'Sun', water: 5, sleep: 7, mood: 4, energy: 5 },
    ].map((d, i) => ({ ...d, date: `${i + 1}/${new Date().getMonth() + 1}` }));

    const dummyFitnessProgression = [
        { week: 'W1', val: 60 }, { week: 'W2', val: 65 }, { week: 'W3', val: 70 }, { week: 'W4', val: 72 }, { week: 'W5', val: 75 },
    ];

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

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 min-h-screen p-6 md:p-10 font-sans antialiased bg-gray-50 text-gray-900">

            {/* Featured Card: Daily Check-ins - Now a grid of mini-charts */}
            <Card className="rounded-3xl shadow-xl bg-white/40 backdrop-blur-md border-none p-6 md:col-span-2 lg:col-span-3 xl:col-span-4 animate-fade-in">
                <CardHeader className="p-0 mb-4 flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center">Daily Vitals 🌟</CardTitle>
                    <CalendarDays className="w-5 h-5 text-gray-500" />
                </CardHeader>
                <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Water Chart */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                            <Droplet className="w-5 h-5" style={{ color: colors.water }} />
                            <h4 className="text-md font-semibold text-gray-700">Water Intake</h4>
                        </div>
                        <ResponsiveContainer width="100%" height={100}>
                            <BarChart data={dailyCheckIns.length > 0 ? dailyCheckIns : dummyDailyCheckIns} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                                <XAxis dataKey="date" hide />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="water" fill={colors.water} radius={[5, 5, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Sleep Chart */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                            <Moon className="w-5 h-5" style={{ color: colors.sleep }} />
                            <h4 className="text-md font-semibold text-gray-700">Sleep Quality</h4>
                        </div>
                        <ResponsiveContainer width="100%" height={100}>
                            <BarChart data={dailyCheckIns.length > 0 ? dailyCheckIns : dummyDailyCheckIns} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                                <XAxis dataKey="date" hide />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="sleep" fill={colors.sleep} radius={[5, 5, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Mood Chart */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                            <Smile className="w-5 h-5" style={{ color: colors.mood }} />
                            <h4 className="text-md font-semibold text-gray-700">Mood</h4>
                        </div>
                        <ResponsiveContainer width="100%" height={100}>
                            <AreaChart data={dailyCheckIns.length > 0 ? dailyCheckIns : dummyDailyCheckIns} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={colors.mood} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={colors.mood} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" hide />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="mood" stroke={colors.mood} fill="url(#colorMood)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Energy Chart */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                            <Zap className="w-5 h-5" style={{ color: colors.energy }} />
                            <h4 className="text-md font-semibold text-gray-700">Energy</h4>
                        </div>
                        <ResponsiveContainer width="100%" height={100}>
                            <AreaChart data={dailyCheckIns.length > 0 ? dailyCheckIns : dummyDailyCheckIns} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={colors.energy} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={colors.energy} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" hide />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="energy" stroke={colors.energy} fill="url(#colorEnergy)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            
            {/* Small Radial Progress Cards (e.g., Fitness Adherence, Calories, Steps) */}
            <RadialProgressCard
                title="Fitness Adherence"
                value={fitness.adherence || 75}
                unit="%"
                color={colors.fitness}
                icon={Dumbbell}
                emoji="💪"
                subText="Last 7 days"
                size={120}
            />

            <RadialProgressCard
                title="Daily Steps"
                value={client.steps || 7235} // Example from your image
                maxValue={10000}
                unit="Steps"
                color={colors.steps}
                icon={Sparkles}
                emoji="🚶"
                subText="Goal: 10,000"
                size={120}
            />
            
            <RadialProgressCard
                title="Calories Burned"
                value={client.caloriesBurned || 245} // Example from your image
                maxValue={500}
                unit="Kcal"
                color={colors.caloriesBurned}
                icon={SunDim}
                emoji="🔥"
                subText="Today"
                size={120}
            />

            {/* Mini Sparkline Cards (e.g., Sleep, Heart Rate) */}
            <MiniSparklineCard
                title="Sleep Quality"
                value={client.sleepHours || 7.4} // Example from your image
                unit="Hours"
                data={dailyCheckIns.length > 0 ? dailyCheckIns : dummyDailyCheckIns}
                dataKey="sleep"
                color={colors.sleep}
                icon={Moon}
                emoji="😴"
            />

            <MiniSparklineCard
                title="Heart Rate"
                value={client.heartRate || 73} // Example from your image
                unit="bpm"
                data={dailyCheckIns.length > 0 ? dailyCheckIns.map(d => ({ date: d.date, heart: Math.floor(Math.random() * 20) + 60 })) : dummyDailyCheckIns.map(d => ({ date: d.date, heart: Math.floor(Math.random() * 20) + 60 }))} // Dummy heart rate
                dataKey="heart"
                color={colors.heartRate}
                icon={Heart}
                emoji="❤️"
            />

            {/* Nutrition Insights - More detailed graph */}
            <Card className="rounded-3xl shadow-xl bg-white/40 backdrop-blur-md border-none p-6 md:col-span-2 lg:col-span-2 animate-fade-in-up">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center">Nutrition Fuel 🍎</CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={nutrition.length > 0 ? nutrition : dummyNutrition}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                            <XAxis dataKey="date" className="text-xs text-gray-500" />
                            <YAxis className="text-xs text-gray-500" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                            <Bar dataKey="protein" fill={colors.nutritionProtein} name="Protein (g)" radius={[10, 10, 0, 0]} />
                            <Bar dataKey="carbs" fill={colors.nutritionCarbs} name="Carbs (g)" radius={[10, 10, 0, 0]} />
                            <Bar dataKey="fat" fill={colors.nutritionFat} name="Fat (g)" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Mental Health - Area Chart for trends */}
            <Card className="rounded-3xl shadow-xl bg-white/40 backdrop-blur-md border-none p-6 md:col-span-2 lg:col-span-2 animate-fade-in-up">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center">Mind Matters 🧠</CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mentalHealth.length > 0 ? mentalHealth : dummyMentalHealth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                            <XAxis dataKey="date" className="text-xs text-gray-500" />
                            <YAxis className="text-xs text-gray-500" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                            <Area type="monotone" dataKey="stress" stroke={colors.mentalStress} fill={colors.mentalStress} fillOpacity={0.3} strokeWidth={3} name="Stress (1-10)" />
                            <Area type="monotone" dataKey="anxiety" stroke={colors.mentalAnxiety} fill={colors.mentalAnxiety} fillOpacity={0.3} strokeWidth={3} name="Anxiety (1-10)" />
                            <Area type="monotone" dataKey="meditation" stroke={colors.mentalMeditation} fill={colors.mentalMeditation} fillOpacity={0.3} strokeWidth={3} name="Meditation (min)" />
                            <Area type="monotone" dataKey="yoga" stroke={colors.mentalYoga} fill={colors.mentalYoga} fillOpacity={0.3} strokeWidth={3} name="Yoga (min)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Weight Trend - Prominent line chart with fill */}
            <Card className="rounded-3xl shadow-xl bg-white/40 backdrop-blur-md border-none p-6 md:col-span-full lg:col-span-full xl:col-span-full animate-fade-in-up">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center">Weight Journey ⚖️</CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weight.length > 0 ? weight : dummyWeightTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                            <XAxis dataKey="date" className="text-xs text-gray-500" />
                            <YAxis className="text-xs text-gray-500" />
                            <Tooltip content={<CustomTooltip />} />
                            <defs>
                                <linearGradient id="colorWeightGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colors.weight} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={colors.weight} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="weight" stroke={colors.weight} fill="url(#colorWeightGradient)" fillOpacity={1} strokeWidth={3} name="Weight (lbs)" dot={{ r: 5 }} activeDot={{ r: 8 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

        </div>
    );
};

export default ProgressProgramsTab;
