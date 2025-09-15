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
  dailyCheckIns: DailyCheckInData[];
  fitness: FitnessData;
  nutrition: NutritionData[];
  mentalHealth: MentalHealthData[];
  weight: WeightData[];
}

// Utility for trend arrows
const Trend = ({ value }: { value: number }) => {
  if (value > 0)
    return <span className="text-green-600 flex items-center text-sm"><ArrowUpRight className="w-4 h-4" />{value}%</span>;
  if (value < 0)
    return <span className="text-red-600 flex items-center text-sm"><ArrowDownRight className="w-4 h-4" />{Math.abs(value)}%</span>;
  return <span className="text-gray-500 text-sm">0%</span>;
};

// Main dashboard component
const ClientDashboard: React.FC<DashboardProps> = ({ dailyCheckIns, fitness, nutrition, mentalHealth, weight }) => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Daily Check-ins */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Daily Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyCheckIns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="water" stroke="#3b82f6" name="Water" />
              <Line type="monotone" dataKey="sleep" stroke="#10b981" name="Sleep" />
              <Line type="monotone" dataKey="mood" stroke="#f59e0b" name="Mood" />
              <Line type="monotone" dataKey="energy" stroke="#ef4444" name="Energy" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Fitness Performance */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Fitness Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-lg font-semibold">Adherence: {fitness.adherence}%</p>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={fitness.progression.map((val, i) => ({ week: i + 1, val }))}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="val" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Nutrition Insights */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Nutrition Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={nutrition}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="protein" stroke="#10b981" name="Protein" />
              <Line type="monotone" dataKey="carbs" stroke="#3b82f6" name="Carbs" />
              <Line type="monotone" dataKey="fat" stroke="#f59e0b" name="Fat" />
              <Line type="monotone" dataKey="calories" stroke="#ef4444" name="Calories" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Mental Health */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Mental Health</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mentalHealth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="stress" stroke="#ef4444" name="Stress" />
              <Line type="monotone" dataKey="anxiety" stroke="#f59e0b" name="Anxiety" />
              <Line type="monotone" dataKey="meditation" stroke="#10b981" name="Meditation" />
              <Line type="monotone" dataKey="yoga" stroke="#3b82f6" name="Yoga" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weight Trend */}
      <Card className="rounded-2xl shadow-md md:col-span-2">
        <CardHeader>
          <CardTitle>Weight Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weight}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#6366f1" name="Weight" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
