import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import FitnessTrendChart from "./charts/FitnessTrendChart";
import MentalHealthTrendChart from "./charts/MentalHealthTrendChart";

// --- Types ---
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

// --- Utilities & Components ---
const Trend = ({ value }: { value: number }) => {
  if (value > 0)
    return (
      <span className="text-green-500 flex items-center text-xs font-medium">
        <ArrowUpRight className="w-3 h-3" />
        {value.toFixed(1)}%
      </span>
    );
  if (value < 0)
    return (
      <span className="text-red-500 flex items-center text-xs font-medium">
        <ArrowDownRight className="w-3 h-3" />
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  return <span className="text-muted-foreground text-xs">0%</span>;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 p-2 rounded-lg shadow-lg backdrop-blur-sm border border-border text-foreground">
        <p className="font-semibold text-xs mb-1">{label}</p>
        {payload.map((p: any) => (
          <p
            key={p.name}
            className="text-xs flex items-center"
            style={{ color: p.color }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: p.color }}
            ></span>
            {`${p.name}: `} <span className="font-medium ml-1">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Radial Progress Card ---
const RadialProgressCard: React.FC<{
  title: string;
  value: number;
  maxValue?: number;
  unit: string;
  color: string;
  emoji?: string;
  subText?: string;
  size?: number;
}> = ({
  title,
  value,
  maxValue = 100,
  unit,
  color,
  emoji,
  subText,
  size = 100,
}) => {
  const data = [{ name: title, value: (value / maxValue) * 100 }];
  const percentage = Math.round((value / maxValue) * 100);

  return (
    <Card className="rounded-3xl shadow-lg bg-card/50 backdrop-blur-md border-border p-4 flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105 duration-300">
      <div className="flex items-center justify-center text-lg font-semibold text-foreground mb-2">
        {emoji && <span className="mr-2 text-xl">{emoji}</span>}
        <p className="text-sm">{title}</p>
      </div>
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
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
            <RadialBar
              background
              dataKey="value"
              cornerRadius={size / 10}
              fill={color}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xl font-bold text-foreground leading-none">{value}</p>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
      {subText && <p className="text-xs text-muted-foreground mt-2">{subText}</p>}
    </Card>
  );
};

// --- Daily Trend Card ---
const DailyTrendCard: React.FC<{
  title: string;
  data: any[];
  dataKey: string;
  color: string;
  emoji?: string;
  unit?: string;
  selectedRange: string;
}> = ({ title, data, dataKey, color, emoji, unit = "", selectedRange }) => {
  const filteredData = useMemo(() => {
    const now = new Date();
    let rangeInDays = 7;
    if (selectedRange === "1m") rangeInDays = 30;
    if (selectedRange === "6m") rangeInDays = 180;

    return data.filter((d) => {
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

  const currentValue =
    filteredData.length > 0 ? filteredData[filteredData.length - 1][dataKey] : 0;

  return (
    <Card className="rounded-3xl shadow-lg bg-card/50 backdrop-blur-md border-border p-4 flex flex-col justify-between transition-transform transform hover:scale-105 duration-300">
      <div className="flex items-center space-x-2 mb-2">
        {emoji && <span className="mr-1 text-lg">{emoji}</span>}
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="flex justify-between items-end mb-2">
        <p className="text-2xl font-bold text-foreground">
          {currentValue} <span className="text-sm text-muted-foreground">{unit}</span>
        </p>
        <Trend value={trendChange} />
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <AreaChart
          data={filteredData}
          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" hide />
          <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            fill={`url(#color${dataKey})`}
            fillOpacity={0.5}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

// --- Main Dashboard ---
const ProgressProgramsTab: React.FC<DashboardProps> = ({ client }) => {
  const [selectedRange, setSelectedRange] = useState("4w");
  const [weightRange, setWeightRange] = useState("1m");

  const dailyCheckIns = client.dailyCheckIn || [];
  const fitness = client.fitness || { adherence: 0, progression: [] };
  const weight = client.weightTrend || [];
  const nutrition = Array.isArray(client.nutrition)
    ? client.nutrition
    : client.nutrition
    ? [client.nutrition]
    : [];
  const mentalHealth = Array.isArray(client.mentalHealth)
    ? client.mentalHealth
    : client.mentalHealth
    ? [client.mentalHealth]
    : [];

  // Mock data for when client data is empty
  const dummyDailyCheckIns: DailyCheckInData[] = [
    { date: "2024-01-01", water: 8, sleep: 7, mood: 8, energy: 7, stress: 3, anxiety: 2 },
    { date: "2024-01-02", water: 6, sleep: 6, mood: 7, energy: 6, stress: 4, anxiety: 3 },
    { date: "2024-01-03", water: 9, sleep: 8, mood: 9, energy: 8, stress: 2, anxiety: 1 },
    { date: "2024-01-04", water: 7, sleep: 7, mood: 8, energy: 7, stress: 3, anxiety: 2 },
    { date: "2024-01-05", water: 8, sleep: 8, mood: 8, energy: 8, stress: 2, anxiety: 2 },
    { date: "2024-01-06", water: 5, sleep: 5, mood: 6, energy: 5, stress: 5, anxiety: 4 },
    { date: "2024-01-07", water: 9, sleep: 9, mood: 9, energy: 9, stress: 1, anxiety: 1 },
  ];

  const dummyNutrition: NutritionData[] = [
    { date: "2024-01-01", protein: 120, carbs: 200, fat: 80, calories: 2000, adherence: 85 },
    { date: "2024-01-02", protein: 110, carbs: 180, fat: 75, calories: 1850, adherence: 78 },
    { date: "2024-01-03", protein: 130, carbs: 220, fat: 85, calories: 2150, adherence: 92 },
    { date: "2024-01-04", protein: 125, carbs: 210, fat: 82, calories: 2050, adherence: 88 },
    { date: "2024-01-05", protein: 118, carbs: 195, fat: 78, calories: 1950, adherence: 82 },
    { date: "2024-01-06", protein: 135, carbs: 225, fat: 88, calories: 2200, adherence: 95 },
    { date: "2024-01-07", protein: 122, carbs: 205, fat: 80, calories: 2025, adherence: 86 },
  ];

  const dummyWeightTrend: WeightData[] = [
    { date: "Week 1", weight: 75 },
    { date: "Week 2", weight: 74.5 },
    { date: "Week 3", weight: 74.2 },
    { date: "Week 4", weight: 73.8 },
    { date: "Week 5", weight: 73.5 },
    { date: "Week 6", weight: 73.1 },
  ];

  const aggregateWeightData = (data: WeightData[], range: string) => {
    const now = new Date();
    let rangeInDays = 30;
    if (range === "6m") rangeInDays = 180;
    if (range === "1y") rangeInDays = 365;

    return data.filter((d) => {
      const date = new Date(d.date);
      const diffInTime = now.getTime() - date.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24);
      return diffInDays <= rangeInDays;
    });
  };

  const colors = {
    water: "#60A5FA",
    sleep: "#A78BFA",
    mood: "#FCD34D",
    energy: "#F87171",
    fitness: "#60A5FA",
    nutritionCalories: "#EF4444",
    mentalStress: "#FB923C",
    mentalAnxiety: "#F87171",
    weight: "#A78BFA",
    caloriesBurned: "#FCD34D",
  };

  const dailyData = dailyCheckIns.length > 0 ? dailyCheckIns : dummyDailyCheckIns;
  const nutritionData = nutrition.length > 0 ? nutrition : dummyNutrition;
  const weightData = weight.length > 0 ? weight : dummyWeightTrend;
  const mentalData = mentalHealth.length > 0 ? mentalHealth : [];

  // Calculate averages for RadialProgressCard
  const avgWater = dailyData.reduce((sum, d) => sum + d.water, 0) / dailyData.length;
  const avgSleep = dailyData.reduce((sum, d) => sum + d.sleep, 0) / dailyData.length;
  const avgMood = dailyData.reduce((sum, d) => sum + d.mood, 0) / dailyData.length;
  const avgEnergy = dailyData.reduce((sum, d) => sum + d.energy, 0) / dailyData.length;

  return (
    <div className="font-sans antialiased bg-transparent space-y-6 p-4">
      {/* Time Range Selector */}
      <div className="flex justify-center space-x-2 mb-6">
        {["4w", "1m", "6m"].map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedRange === range
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
            }`}
          >
            {range === "4w" ? "4 Weeks" : range === "1m" ? "1 Month" : "6 Months"}
          </button>
        ))}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <RadialProgressCard
          title="Fitness Adherence"
          value={fitness.adherence || 85}
          maxValue={100}
          unit="%"
          color={colors.fitness}
          emoji="💪"
          subText="Weekly Goal"
        />
        <RadialProgressCard
          title="Sleep Quality"
          value={avgSleep}
          maxValue={10}
          unit="hrs"
          color={colors.sleep}
          emoji="😴"
          subText="Daily Average"
        />
        <RadialProgressCard
          title="Water Intake"
          value={avgWater}
          maxValue={10}
          unit="cups"
          color={colors.water}
          emoji="💧"
          subText="Daily Average"
        />
        <RadialProgressCard
          title="Mood Average"
          value={avgMood}
          maxValue={10}
          unit="/10"
          color={colors.mood}
          emoji="😊"
          subText="This Week"
        />
      </div>

      {/* Daily Trends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <DailyTrendCard
          title="Water Intake"
          data={dailyData}
          dataKey="water"
          color={colors.water}
          emoji="💧"
          unit="cups"
          selectedRange={selectedRange}
        />
        <DailyTrendCard
          title="Sleep Hours"
          data={dailyData}
          dataKey="sleep"
          color={colors.sleep}
          emoji="😴"
          unit="hrs"
          selectedRange={selectedRange}
        />
        <DailyTrendCard
          title="Mood Score"
          data={dailyData}
          dataKey="mood"
          color={colors.mood}
          emoji="😊"
          unit="/10"
          selectedRange={selectedRange}
        />
        <DailyTrendCard
          title="Energy Level"
          data={dailyData}
          dataKey="energy"
          color={colors.energy}
          emoji="⚡"
          unit="/10"
          selectedRange={selectedRange}
        />
        {dailyData.some(d => d.stress !== undefined) && (
          <DailyTrendCard
            title="Stress Level"
            data={dailyData}
            dataKey="stress"
            color={colors.mentalStress}
            emoji="😰"
            unit="/10"
            selectedRange={selectedRange}
          />
        )}
        {dailyData.some(d => d.anxiety !== undefined) && (
          <DailyTrendCard
            title="Anxiety Level"
            data={dailyData}
            dataKey="anxiety"
            color={colors.mentalAnxiety}
            emoji="😟"
            unit="/10"
            selectedRange={selectedRange}
          />
        )}
      </div>

      {/* Weight Journey Chart */}
      <Card className="rounded-3xl shadow-lg bg-card/50 backdrop-blur-md border-border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">Weight Journey</h3>
          <div className="flex space-x-2">
            {["1m", "6m", "1y"].map((range) => (
              <button
                key={range}
                onClick={() => setWeightRange(range)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  weightRange === range
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                {range === "1m" ? "1M" : range === "6m" ? "6M" : "1Y"}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={aggregateWeightData(weightData, weightRange)}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="weight"
              fill={colors.weight}
              radius={[4, 4, 0, 0]}
              name="Weight (kg)"
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Fitness and Mental Health Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FitnessTrendChart data={fitness.progression || []} selectedRange={selectedRange} />
        <MentalHealthTrendChart data={mentalData} selectedRange={selectedRange} />
      </div>
    </div>
  );
};

export default ProgressProgramsTab;
