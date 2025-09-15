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
  RadialBarChart,
  RadialBar,
} from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

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

// --- Utilities ---
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
      <div className="bg-card text-card-foreground p-2 rounded-lg shadow-lg border border-border">
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
}> = ({
  title,
  value,
  maxValue = 100,
  unit = "",
  color,
  emoji,
  subText,
  size = 120,
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border p-4 flex flex-col items-center justify-center min-h-[200px]">
      <div className="relative" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="90%"
            data={[{ value: percentage }]}
          >
            <RadialBar dataKey="value" cornerRadius={10} fill={color} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl">{emoji}</div>
          <div className="text-lg font-bold text-foreground">
            {value}
            {unit}
          </div>
        </div>
      </div>
      <div className="text-center mt-3">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        {subText && (
          <p className="text-xs text-muted-foreground mt-1">{subText}</p>
        )}
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
}> = ({ title, data, dataKey, color, emoji, unit = "", selectedRange }) => {
  const rangeInDays =
    selectedRange === "4w" ? 28 : selectedRange === "12w" ? 84 : 168;
  const filteredData = data.slice(-rangeInDays);

  const currentValue = filteredData[filteredData.length - 1]?.[dataKey] || 0;
  const previousValue = filteredData[filteredData.length - 8]?.[dataKey] || 0;
  const trend = ((currentValue - previousValue) / previousValue) * 100;

  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border p-4 min-h-[200px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {emoji && <span className="text-lg">{emoji}</span>}
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        </div>
        <Trend value={trend} />
      </div>
      <div className="mb-3">
        <span className="text-2xl font-bold text-foreground">
          {currentValue.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground ml-1">{unit}</span>
      </div>
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData.slice(-14)}>
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// Main Dashboard
const ProgressProgramsTab: React.FC<DashboardProps> = ({ client }) => {
  const [selectedRange, setSelectedRange] = useState("4w");
  const [weightRange, setWeightRange] = useState("1m");

  // Dummy data
  const dummyDailyCheckIns = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 0; i < 180; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      data.push({
        date: d.toISOString().split("T")[0],
        water: Math.floor(Math.random() * 6) + 1,
        sleep: parseFloat((Math.random() * (9 - 6) + 6).toFixed(1)),
        mood: Math.floor(Math.random() * 10) + 1,
        energy: Math.floor(Math.random() * 10) + 1,
        stress: Math.floor(Math.random() * 10) + 1,
        anxiety: Math.floor(Math.random() * 10) + 1,
      });
    }
    return data.reverse();
  }, []);

  const dailyData = client.dailyCheckIn?.length
    ? client.dailyCheckIn
    : dummyDailyCheckIns;

  const colors = {
    water: "#60A5FA",
    sleep: "#A78BFA",
    mood: "#FCD34D",
    energy: "#F87171",
    mentalStress: "#FB923C",
    mentalAnxiety: "#F87171",
    fitness: "#60A5FA",
    caloriesBurned: "#FCD34D",
  };

  return (
    <>
      {/* Time Range Selector */}
      <div className="flex justify-center sm:justify-end mb-6">
        <div className="bg-card rounded-full border border-border p-1 flex shadow-sm">
          {["4w", "12w", "24w"].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`text-xs sm:text-sm font-medium px-3 py-1 rounded-full transition-all duration-300 ${
                selectedRange === range
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {range === "4w"
                ? "4 Weeks"
                : range === "12w"
                ? "12 Weeks"
                : "24 Weeks"}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <DailyTrendCard
          title="Water Intake"
          data={dailyData}
          dataKey="water"
          color={colors.water}
          emoji="💧"
          unit="L"
          selectedRange={selectedRange}
        />
        <DailyTrendCard
          title="Energy"
          data={dailyData}
          dataKey="energy"
          color={colors.energy}
          emoji="⚡"
          selectedRange={selectedRange}
        />
        <DailyTrendCard
          title="Mood"
          data={dailyData}
          dataKey="mood"
          color={colors.mood}
          emoji="😊"
          selectedRange={selectedRange}
        />
        <DailyTrendCard
          title="Stress"
          data={dailyData}
          dataKey="stress"
          color={colors.mentalStress}
          emoji="🧠"
          selectedRange={selectedRange}
        />
        <DailyTrendCard
          title="Sleep"
          data={dailyData}
          dataKey="sleep"
          color={colors.sleep}
          emoji="😴"
          unit="hrs"
          selectedRange={selectedRange}
        />
        <DailyTrendCard
          title="Anxiety"
          data={dailyData}
          dataKey="anxiety"
          color={colors.mentalAnxiety}
          emoji="💔"
          selectedRange={selectedRange}
        />

        <RadialProgressCard
          title="Fitness Adherence"
          value={75}
          unit="%"
          color={colors.fitness}
          emoji="💪"
          subText="Last 7 days"
          size={120}
        />

        <RadialProgressCard
          title="Calories Burned"
          value={245}
          maxValue={500}
          unit="Kcal"
          color={colors.caloriesBurned}
          emoji="🔥"
          subText="Today"
          size={120}
        />
      </div>
    </>
  );
};

export default ProgressProgramsTab;
