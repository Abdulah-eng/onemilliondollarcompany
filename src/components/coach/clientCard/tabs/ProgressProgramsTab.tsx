import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Heart,
  Apple,
  Brain,
  Camera,
  Dumbbell,
  Utensils
} from 'lucide-react';
import DailyCheckIn from '@/components/coach/clientCard/ClientInsights/DailyCheckIn';
import WeightTrend from '@/components/coach/clientCard/ClientInsights/WeightTrend';
import ProgramCompletion from '@/components/coach/clientCard/ClientInsights/ProgramCompletion';
import NutritionInsights from '@/components/coach/clientCard/ClientInsights/NutritionInsights';
import MentalWellness from '@/components/coach/clientCard/ClientInsights/MentalWellness';

interface ProgressProgramsTabProps {
  client: any;
}

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
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Progress & Programs</h2>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-48 rounded-xl">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1week">Last Week</SelectItem>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Current Program */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <Play className="h-5 w-5 text-emerald-500" />
              Current Program
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full">
                <Edit className="mr-2 h-4 w-4" />
                Update
              </Button>
              <Button size="sm" variant="outline" className="rounded-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Comment
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg">{currentProgram.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Sept 1, 2024 – Sept 28, 2024
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="rounded-full px-3 py-1 text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
                    <Play className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                  <Badge className="rounded-full px-3 py-1 text-xs bg-blue-100 text-blue-700 border-blue-200">
                    {currentProgram.type}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {currentProgram.adherence}%
                  </div>
                  <div className="text-xs text-muted-foreground">Adherence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {currentProgram.daysRemaining}
                  </div>
                  <div className="text-xs text-muted-foreground">Days Left</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round((28 - currentProgram.daysRemaining) / 28 * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(28 - currentProgram.daysRemaining) / 28 * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Check-ins */}
        <Card className="rounded-2xl border bg-card">
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

        {/* Weight Trend */}
        <Card className="rounded-2xl border bg-card">
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

        {/* Program Completion */}
        <Card className="rounded-2xl border bg-card">
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

        {/* Nutrition Insights */}
        <Card className="rounded-2xl border bg-card">
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

        {/* Mental Wellness */}
        <Card className="rounded-2xl border bg-card">
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

        {/* Progress Photos */}
        <Card className="rounded-2xl border bg-card">
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
              <p className="text-sm text-muted-foreground">No progress photos available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Program */}
      <Card className="rounded-2xl border bg-card">
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

      {/* Quick Actions */}
      <Card className="rounded-2xl border bg-card">
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

      {/* Past Programs */}
      <Card className="rounded-2xl border bg-card">
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
  );
};

export default ProgressProgramsTab;