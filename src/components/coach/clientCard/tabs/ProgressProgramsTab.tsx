import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Defs, LinearGradient, Stop } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// Types (same as before)
// ...

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
            <LineChart data={fitness.progression.map((val, i) => ({ week: i + 1, val }))}>
              <Defs>
                <LinearGradient id="colorProgression" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="5%" stopColor="#4a90e2" stopOpacity={0.8}/>
                  <Stop offset="95%" stopColor="#4a90e2" stopOpacity={0}/>
                </LinearGradient>
              </Defs>
              <XAxis dataKey="week" stroke="#d1d5db" />
              <YAxis stroke="#d1d5db" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="val" stroke="#4a90e2" strokeWidth={4} fillOpacity={1} fill="url(#colorProgression)" />
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
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={nutrition}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="protein" stroke="#50e3c2" strokeWidth={3} name="Protein" />
              <Line type="monotone" dataKey="carbs" stroke="#4a90e2" strokeWidth={3} name="Carbs" />
              <Line type="monotone" dataKey="fat" stroke="#f5a623" strokeWidth={3} name="Fat" />
              <Line type="monotone" dataKey="calories" stroke="#e24a4a" strokeWidth={3} name="Calories" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Mental Health */}
      <Card className="rounded-3xl shadow-xl border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-blue-800">Mental Health</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mentalHealth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="stress" stroke="#e24a4a" strokeWidth={3} name="Stress" />
              <Line type="monotone" dataKey="anxiety" stroke="#f5a623" strokeWidth={3} name="Anxiety" />
              <Line type="monotone" dataKey="meditation" stroke="#50e3c2" strokeWidth={3} name="Meditation" />
              <Line type="monotone" dataKey="yoga" stroke="#4a90e2" strokeWidth={3} name="Yoga" />
            </LineChart>
          </ResponsiveContainer>
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
              <Defs>
                <LinearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="5%" stopColor="#4a90e2" stopOpacity={0.8}/>
                  <Stop offset="95%" stopColor="#4a90e2" stopOpacity={0}/>
                </LinearGradient>
              </Defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#d1d5db" />
              <YAxis stroke="#d1d5db" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="weight" stroke="#4a90e2" strokeWidth={4} fillOpacity={1} fill="url(#colorWeight)" name="Weight" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
