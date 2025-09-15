import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Play,
  Clock,
  CheckCircle,
  Calendar,
  Plus,
  Edit,
  MessageSquare,
  Award,
  Target,
  Activity,
  TrendingUp,
  Camera,
  Dumbbell,
  Utensils,
  Brain
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ProgressProgramsTabProps {
  client: any;
}

// Internal Components
const DailyCheckIn: React.FC<{ dailyCheckIn: any[]; timeRange: '1week' | '1month' | '6months' }> = ({ dailyCheckIn, timeRange }) => {
  const filteredData = React.useMemo(() => {
    if (!dailyCheckIn || dailyCheckIn.length === 0) return [];
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (timeRange) {
      case '1week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '1month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
    }
    
    return dailyCheckIn
      .filter((entry) => new Date(entry.date) >= cutoffDate)
      .map((entry) => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: entry.mood || 0,
        energy: entry.energy || 0,
        sleep: entry.sleep || 0,
        water: entry.water || 0,
      }))
      .slice(-10);
  }, [dailyCheckIn, timeRange]);

  if (filteredData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No check-in data available for this period.</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
            axisLine={false} 
            tickLine={false}
            domain={[0, 10]}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="mood" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
            name="Mood"
          />
          <Line 
            type="monotone" 
            dataKey="energy" 
            stroke="hsl(var(--destructive))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 3 }}
            name="Energy"
          />
          <Line 
            type="monotone" 
            dataKey="sleep" 
            stroke="hsl(var(--secondary))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 3 }}
            name="Sleep"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const WeightTrend: React.FC<{ weightTrend: Array<{ date: string; weight: number }> }> = ({ weightTrend }) => {
  const chartData = weightTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: item.weight
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="date" 
            className="text-muted-foreground"
            fontSize={12}
          />
          <YAxis 
            className="text-muted-foreground"
            fontSize={12}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
            formatter={(value) => [`${value} lbs`, 'Weight']}
          />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            name="Weight"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const ProgramCompletion: React.FC<{ programFill: any }> = ({ programFill }) => {
  const sections = [
    { label: 'Fitness', value: programFill.fitness, color: '#2563eb' },
    { label: 'Nutrition', value: programFill.nutrition, color: '#f59e0b' },
    { label: 'Mental Health', value: programFill.mentalHealth, color: '#10b981' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-around">
      {sections.map((section, index) => (
        <motion.div
          key={section.label}
          className="w-24 h-24 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
        >
          <CircularProgressbar
            value={section.value}
            text={`${section.value}%`}
            strokeWidth={8}
            styles={buildStyles({
              pathColor: section.color,
              trailColor: 'hsl(var(--muted))',
              textColor: 'hsl(var(--foreground))',
              textSize: '18px',
            })}
          />
          <p className="text-sm font-semibold text-center mt-3 text-foreground">
            {section.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

const NutritionInsights: React.FC<{ nutritionData: any }> = ({ nutritionData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-foreground">{nutritionData.adherence}%</span>
          <span className="text-sm text-muted-foreground">Meal Adherence</span>
          <p className="text-xs text-center text-muted-foreground mt-1">
            {nutritionData.adherenceMessage}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-foreground">
            <span className="text-xl">~</span>{nutritionData.portionsPerDay}
          </span>
          <span className="text-sm text-muted-foreground">Portions/Day</span>
          <p className="text-xs text-center text-muted-foreground mt-1">
            {nutritionData.portionMessage}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-muted-foreground">Micronutrient Status:</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(nutritionData.micronutrientStatus).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1 text-sm">
              <span className={`text-lg ${value === 'adequate' ? 'text-green-500' : 'text-orange-500'}`}>
                {value === 'adequate' ? '✅' : '⚠️'}
              </span>
              <span className="text-foreground capitalize">{key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MentalWellness: React.FC<{ mentalHealthData: any }> = ({ mentalHealthData }) => {
  const sections = [
    { label: 'Avg. Stress', value: mentalHealthData.avgStress, trend: mentalHealthData.stressTrend, unit: '/5' },
    { label: 'Avg. Anxiety', value: mentalHealthData.avgAnxiety, trend: mentalHealthData.anxietyTrend, unit: '/5' },
    { label: 'Meditation', value: mentalHealthData.meditationTime, trend: mentalHealthData.meditationTrend, unit: ' min' },
    { label: 'Yoga', value: mentalHealthData.yogaTime, trend: mentalHealthData.yogaTrend, unit: ' min' },
  ];

  const getTrendColor = (trend: string) => {
    if (trend === '↑') return 'text-rose-500';
    if (trend === '↓') return 'text-emerald-500';
    return 'text-muted-foreground';
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {sections.map((section, index) => (
        <div key={index} className="space-y-1">
          <div className="text-sm text-muted-foreground">{section.label}</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">
              {section.value}
              <span className="text-sm font-normal text-muted-foreground">{section.unit}</span>
            </span>
            <span className={`text-lg font-bold ${getTrendColor(section.trend)}`}>{section.trend}</span>
          </div>
          {section.label === 'Meditation' && (
            <p className="text-xs text-muted-foreground">{mentalHealthData.meditationValue}</p>
          )}
          {section.label === 'Yoga' && (
            <p className="text-xs text-muted-foreground">{mentalHealthData.yogaValue}</p>
          )}
        </div>
      ))}
    </div>
  );
};

const ProgressProgramsTab: React.FC<ProgressProgramsTabProps> = ({ client }) => {
  const [timeRange, setTimeRange] = useState<'1week' | '1month' | '6months'>('1month');

  // Mock program data
  const currentProgram = {
    id: 'prog_001',
    name: 'Strength Building Phase 1',
    startDate: '2024-09-01',
    endDate: '2024-09-28',
    status: 'active',
    adherence: parseInt(client.insights.adherence),
    daysRemaining: 15,
    type: 'Fitness'
  };

  const scheduledProgram = {
    id: 'prog_002',
    name: 'Cardio Endurance Phase',
    startDate: '2024-09-29',
    endDate: '2024-10-26',
    status: 'scheduled',
    type: 'Fitness'
  };

  const pastPrograms = [
    {
      id: 'prog_003',
      name: 'Foundation Program',
      startDate: '2024-08-01',
      endDate: '2024-08-31',
      status: 'completed',
      adherence: 92,
      type: 'Fitness'
    },
    {
      id: 'prog_004',
      name: 'Nutrition Reset',
      startDate: '2024-07-15',
      endDate: '2024-08-15',
      status: 'completed',
      adherence: 87,
      type: 'Nutrition'
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-4xl mx-auto">
      {/* Page Header and Time Range */}
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Your Progress</h2>
        <div className="flex rounded-full bg-muted p-1">
          {['1week', '1month', '6months'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                timeRange === range
                  ? 'bg-background text-primary shadow'
                  : 'text-muted-foreground'
              }`}
            >
              {range === '1week' ? 'Week' : range === '1month' ? 'Month' : '6 Months'}
            </button>
          ))}
        </div>
      </div>

      {/* Current Program */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="rounded-3xl border-none shadow-lg">
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-base font-semibold">Active Program</CardTitle>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 text-muted-foreground hover:bg-muted">
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 text-muted-foreground hover:bg-muted">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-xl">{currentProgram.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    <Calendar className="inline h-4 w-4 mr-1 text-muted-foreground" />
                    Sept 1, 2024 – Sept 28, 2024
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-700">
                    <Play className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                  <Badge className="rounded-full text-xs font-semibold px-3 py-1 bg-purple-100 text-purple-700">
                    {currentProgram.type}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-primary">{currentProgram.adherence}%</div>
                  <div className="text-xs text-muted-foreground">Adherence</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-orange-600">{currentProgram.daysRemaining}</div>
                  <div className="text-xs text-muted-foreground">Days Left</div>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>Program Progress</span>
                  <span>{Math.round(((28 - currentProgram.daysRemaining) / 28) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${((28 - currentProgram.daysRemaining) / 28) * 100}%` }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${((28 - currentProgram.daysRemaining) / 28) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* --- */}

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Check-ins */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="rounded-3xl border-none shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-5 w-5 text-blue-500" />
                Daily Check-ins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DailyCheckIn dailyCheckIn={client.dailyCheckIn} timeRange={timeRange} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Weight Trend */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="rounded-3xl border-none shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Weight Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeightTrend weightTrend={client.weightTrend} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Program Completion */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="rounded-3xl border-none shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Dumbbell className="h-5 w-5 text-purple-500" />
                Program Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProgramCompletion programFill={client.programFill} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Nutrition Insights */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card className="rounded-3xl border-none shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Utensils className="h-5 w-5 text-orange-500" />
                Nutrition Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NutritionInsights nutritionData={client.nutrition} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Mental Wellness */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <Card className="rounded-3xl border-none shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="h-5 w-5 text-indigo-500" />
                Mental Wellness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MentalWellness mentalHealthData={client.mentalHealth} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Photos */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
          <Card className="rounded-3xl border-none shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Camera className="h-5 w-5 text-pink-500" />
                Progress Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {client.progressPhotos && client.progressPhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {client.progressPhotos.slice(0, 6).map((photo: string, index: number) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={photo}
                        alt={`Progress photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No progress photos available.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* --- */}

      {/* Scheduled Program */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
        <Card className="rounded-3xl border-none shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-amber-500" />
              Scheduled Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-semibold">{scheduledProgram.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Starts Sept 29, 2024
                </p>
                <Badge className="rounded-full px-3 py-1 text-xs bg-amber-100 text-amber-700 border-amber-200 mt-2">
                  <Clock className="mr-1 h-3 w-3" />
                  Scheduled
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-600">14</div>
                <div className="text-xs text-muted-foreground">days until start</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* --- */}

      {/* Quick Actions */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
        <Card className="rounded-3xl border-none shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-5 w-5 text-purple-500" />
              Program Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button className="rounded-full justify-start h-12" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create New Program
              </Button>
              <Button className="rounded-full justify-start h-12" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Program
              </Button>
              <Button className="rounded-full justify-start h-12" variant="outline">
                <Award className="mr-2 h-4 w-4" />
                View Templates
              </Button>
              <Button className="rounded-full justify-start h-12" variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                Track Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* --- */}

      {/* Past Programs */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}>
        <Card className="rounded-3xl border-none shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              Past Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastPrograms.map((program) => (
                <div
                  key={program.id}
                  className="flex items-center justify-between rounded-xl border bg-muted/20 p-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium">{program.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(program.startDate).toLocaleDateString()} – {new Date(program.endDate).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="rounded-full px-2 py-1 text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
                        Completed
                      </Badge>
                      <Badge className="rounded-full px-2 py-1 text-xs bg-muted text-muted-foreground">
                        {program.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-center ml-4">
                    <div className="text-sm font-bold text-emerald-600">{program.adherence}%</div>
                    <div className="text-xs text-muted-foreground">Adherence</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProgressProgramsTab;
