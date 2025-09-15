import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// Types (same as before)
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

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/80 p-3 rounded-lg shadow-xl backdrop-blur-sm">
                <p className="font-semibold text-gray-800">{label}</p>
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
  
  // Transform nutrition and mental health objects into array format for charts
  const nutrition = client.nutrition 
    ? Object.entries(client.nutrition).map(([key, value]) => ({
        metric: key,
        value: typeof value === 'number' ? value : 0
      }))
    : [];
  
  const mentalHealth = client.mentalHealth
    ? Object.entries(client.mentalHealth).map(([key, value]) => ({
        metric: key,
        value: typeof value === 'number' ? value : 0
      }))
    : [];

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-sans antialiased bg-gray-50 text-gray-800">
      
      {/* Daily Check-ins */}
      <Card className="rounded-3xl shadow-xl border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-blue-800">Daily Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyCheckIns}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="water" stroke="#4a90e2" strokeWidth={3} name="Water" />
              <Line type="monotone" dataKey="sleep" stroke="#50e3c2" strokeWidth={3} name="Sleep" />
              <Line type="monotone" dataKey="mood" stroke="#f5a623" strokeWidth={3} name="Mood" />
              <Line type="monotone" dataKey="energy" stroke="#e24a4a" strokeWidth={3} name="Energy" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Fitness Performance */}
      <Card className="rounded-3xl shadow-xl border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-blue-800">Fitness Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-4xl font-extrabold text-gray-900">{fitness.adherence}%</p>
            <span className="text-lg text-gray-500">Adherence</span>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={fitness.progression || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#d1d5db" />
              <YAxis stroke="#d1d5db" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="adherence" stroke="#4a90e2" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Nutrition Insights */}
      <Card className="rounded-3xl shadow-xl border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-blue-800">Nutrition Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nutrition.length > 0 ? (
              nutrition.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700 capitalize">{item.metric}</span>
                  <span className="font-bold text-blue-600">{item.value}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No nutrition data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mental Health */}
      <Card className="rounded-3xl shadow-xl border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-blue-800">Mental Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mentalHealth.length > 0 ? (
              mentalHealth.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700 capitalize">{item.metric}</span>
                  <span className="font-bold text-blue-600">{item.value}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No mental health data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weight Trend */}
      <Card className="rounded-3xl shadow-xl border-none md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-blue-800">Weight Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weight}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#d1d5db" />
              <YAxis stroke="#d1d5db" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="weight" stroke="#4a90e2" strokeWidth={4} name="Weight" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
