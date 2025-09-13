import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar,
  Award,
  Clock,
  Activity,
  Target,
  User,
  AlertTriangle,
  MessageSquare,
  Copy
} from 'lucide-react';

interface OverviewTabProps {
  client: any;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ client }) => {
  // Calculate overview metrics
  const overviewMetrics = {
    programAdherence: parseInt(client.insights.adherence),
    checkInStreak: Math.floor(Math.random() * 14) + 1,
    weeklyGoalProgress: Math.floor(Math.random() * 100) + 1,
    lastActivity: '2 hours ago'
  };

  const alerts = [
    { type: 'attention', message: 'Missed 2 consecutive check-ins', urgent: true },
    { type: 'feedback', message: 'Requested feedback on nutrition plan', urgent: false },
  ].filter(() => Math.random() > 0.5);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Program Adherence</p>
                <p className="text-2xl font-bold text-primary">{overviewMetrics.programAdherence}%</p>
              </div>
              <Award className="h-8 w-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Check-in Streak</p>
                <p className="text-2xl font-bold text-emerald-600">{overviewMetrics.checkInStreak} days</p>
              </div>
              <Calendar className="h-8 w-8 text-emerald-600/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Goals</p>
                <p className="text-2xl font-bold text-orange-600">{overviewMetrics.weeklyGoalProgress}%</p>
              </div>
              <Target className="h-8 w-8 text-orange-600/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Activity</p>
                <p className="text-lg font-bold text-muted-foreground">{overviewMetrics.lastActivity}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Notifications */}
      {alerts.length > 0 && (
        <Card className="rounded-2xl border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  alert.urgent 
                    ? 'bg-destructive/5 border-destructive/20' 
                    : 'bg-muted/30 border-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  {alert.urgent ? (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  ) : (
                    <MessageSquare className="h-4 w-4 text-primary" />
                  )}
                  <span className="text-sm">{alert.message}</span>
                </div>
                <Button size="sm" variant="outline" className="rounded-full">
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Trends */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-5 w-5" />
            Quick Trends (7 days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <TrendPill label="Mood" value={client.trends?.mood || '↑'} />
            <TrendPill label="Sleep" value={client.trends?.sleep || '→'} />
            <TrendPill label="Energy" value={client.trends?.energy || '↑'} />
            <TrendPill label="Water" value={client.trends?.water || '↓'} />
          </div>
        </CardContent>
      </Card>

      {/* Client Summary */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-5 w-5" />
              Client Summary
            </CardTitle>
            <Button size="sm" variant="ghost" className="gap-2">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Focus</p>
              <div className="flex flex-wrap gap-2">
                {(client.goals || ['Weight Loss', 'Muscle Gain']).slice(0, 2).map((goal: string, index: number) => (
                  <Badge key={index} className="rounded-full px-3 py-1 text-xs bg-primary/10 text-primary border-primary/20">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Plan Details</p>
              <p className="text-sm">
                <Badge className="rounded-full px-3 py-1 text-xs bg-secondary/10 text-secondary-foreground border-secondary/20">
                  {client.plan || 'Premium'} Plan
                </Badge>
                <span className="ml-2 text-muted-foreground">• 28 days remaining</span>
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Recent Highlights</p>
            <ul className="space-y-1 text-sm">
              <li>• Completed 5 workouts this week</li>
              <li>• Improved sleep score by 15%</li>
              <li>• Consistent with daily check-ins</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

function TrendPill({ label, value }: { label: string; value: string }) {
  const getIcon = () => {
    if (value === '↑') return <TrendingUp className="h-4 w-4 text-emerald-600" />;
    if (value === '↓') return <TrendingDown className="h-4 w-4 text-rose-600" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1">
        {getIcon()}
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}

export default OverviewTab;