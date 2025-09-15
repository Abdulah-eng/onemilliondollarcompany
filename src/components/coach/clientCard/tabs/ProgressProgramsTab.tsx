import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// Types
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

// Utility for trend arrows
const Trend = ({ value }: { value: number }) => {
  if (value > 0)
    return <span className="text-green-500 flex items-center text-sm font-medium"><ArrowUpRight className="w-4 h-4" />{value}%</span>;
  if (value < 0)
    return <span className="text-red-500 flex items-center text-sm font-medium"><ArrowDownRight className="w-4 h-4" />{Math.abs(value)}%</span>;
  return <span className="text-gray-400 text-sm">0%</span>;
};

// Custom Tooltip for better visualization
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/80 dark:bg-gray-800/80 p-3 rounded-lg shadow-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                <p className="font-semibold">{label}</p>
                {payload.map((p: any) => (
                    <p key={p.name} style={{ color: p.color }}>{`${p.name}: ${p.value}`}</p>
                ))}
            </div>
        );
    }
    return null;
};

// Main dashboard component
const ClientDashboard: React.FC<DashboardProps> = ({ client }) => {
  // Extract and transform data from client object
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

  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans antialiased bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      
      {/* Daily Check-ins */}
      <Card className="rounded-2xl shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Daily Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dailyCheckIns}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="water" stroke="#1f2937" strokeWidth={2} name="Water" />
              <Line type="monotone" dataKey="sleep" stroke="#4b5563" strokeWidth={2} name="Sleep" />
              <Line type="monotone" dataKey="mood" stroke="#6b7280" strokeWidth={2} name="Mood" />
              <Line type="monotone" dataKey="energy" stroke="#9ca3af" strokeWidth={2} name="Energy" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Fitness Performance */}
      <Card className="rounded-2xl shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Fitness Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{fitness.adherence}%</p>
            <span className="text-sm text-gray-500">Adherence</span>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={fitness.progression.map((val, i) => ({ week: i + 1, val }))}>
              <XAxis dataKey="week" stroke="#d1d5db" />
              <YAxis stroke="#d1d5db" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Nutrition Insights */}
      <Card className="rounded-2xl shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Nutrition Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={nutrition}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="protein" stroke="#10b981" strokeWidth={2} name="Protein" />
              <Line type="monotone" dataKey="carbs" stroke="#3b82f6" strokeWidth={2} name="Carbs" />
              <Line type="monotone" dataKey="fat" stroke="#f59e0b" strokeWidth={2} name="Fat" />
              <Line type="monotone" dataKey="calories" stroke="#ef4444" strokeWidth={2} name="Calories" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Mental Health */}
      <Card className="rounded-2xl shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Mental Health</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mentalHealth}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} name="Stress" />
              <Line type="monotone" dataKey="anxiety" stroke="#f59e0b" strokeWidth={2} name="Anxiety" />
              <Line type="monotone" dataKey="meditation" stroke="#10b981" strokeWidth={2} name="Meditation" />
              <Line type="monotone" dataKey="yoga" stroke="#3b82f6" strokeWidth={2} name="Yoga" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weight Trend */}
      <Card className="rounded-2xl shadow-lg border-none lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Weight Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weight}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#d1d5db" />
              <YAxis stroke="#d1d5db" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} name="Weight" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
