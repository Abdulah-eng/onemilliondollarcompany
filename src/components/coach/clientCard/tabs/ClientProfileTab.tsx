import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Ruler, 
  Weight, 
  Target, 
  AlertTriangle,
  Heart,
  Copy,
  Edit,
  Award,
  Clock,
  Activity,
  TrendingUp, 
  TrendingDown, 
  Minus
} from 'lucide-react';

interface ClientProfileTabProps {
  client: any;
}

const ClientProfileTab: React.FC<ClientProfileTabProps> = ({ client }) => {
  // Calculate overview metrics
  const overviewMetrics = {
    programAdherence: parseInt(client.insights.adherence),
    checkInStreak: Math.floor(Math.random() * 14) + 1,
    weeklyGoalProgress: Math.floor(Math.random() * 100) + 1,
    lastActivity: '2 hours ago'
  };

  const handleCopyInfo = () => {
    const info = `Client: ${client.name}\nAge: 28\nHeight: 180cm\nWeight: 72kg\nGoals: Build muscle, Lose fat`;
    navigator.clipboard.writeText(info);
  };

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

      {/* Personal Information */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={handleCopyInfo} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button size="sm" variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem icon={User} label="Name" value={client.name} />
            <InfoItem icon={Calendar} label="Age" value="28 years old" />
            <InfoItem icon={Heart} label="Gender" value="Male" />
            <InfoItem icon={Ruler} label="Height" value="180 cm" />
            <InfoItem icon={Weight} label="Weight" value="72 kg" />
            <InfoItem icon={Phone} label="Phone" value="+47 12345678" />
            <InfoItem icon={Mail} label="Email" value="john@example.com" />
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Plan Status</div>
              <Badge className="rounded-full px-3 py-1 text-xs bg-primary/10 text-primary border-primary/20">
                {client.plan} Plan
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Onboarding</div>
              <Badge className="rounded-full px-3 py-1 text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
                Complete
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals & Preferences */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-5 w-5" />
            Goals & Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Primary Goals</h4>
            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full px-3 py-1 text-xs bg-blue-100 text-blue-700 border-blue-200">
                Build muscle
              </Badge>
              <Badge className="rounded-full px-3 py-1 text-xs bg-blue-100 text-blue-700 border-blue-200">
                Lose fat
              </Badge>
              <Badge className="rounded-full px-3 py-1 text-xs bg-blue-100 text-blue-700 border-blue-200">
                Improve endurance
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Preferences</h4>
            <p className="text-sm">Low-carb diet, Morning workouts, Strength training focus</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Dislikes</h4>
            <p className="text-sm">Sugar, Late-night snacks, Cardio-only sessions</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Meditation Experience</h4>
            <p className="text-sm">2 years of daily practice</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Current Focus</h4>
            <div className="flex flex-wrap gap-2">
              {(client.goals || ['Weight Loss', 'Muscle Gain']).slice(0, 2).map((goal: string, index: number) => (
                <Badge key={index} className="rounded-full px-3 py-1 text-xs bg-primary/10 text-primary border-primary/20">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Plan Details</h4>
            <p className="text-sm">
              <Badge className="rounded-full px-3 py-1 text-xs bg-secondary/10 text-secondary-foreground border-secondary/20">
                {client.plan || 'Premium'} Plan
              </Badge>
              <span className="ml-2 text-muted-foreground">• 28 days remaining</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Health Information */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Health Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Allergies</h4>
            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full px-3 py-1 text-xs bg-amber-100 text-amber-700 border-amber-200">
                Peanuts
              </Badge>
              <Badge className="rounded-full px-3 py-1 text-xs bg-amber-100 text-amber-700 border-amber-200">
                Gluten
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Past Injuries</h4>
            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full px-3 py-1 text-xs bg-rose-100 text-rose-700 border-rose-200">
                Knee injury (2022)
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Medical Notes</h4>
            <p className="text-sm text-muted-foreground">
              Client has recovered well from knee injury. No current limitations on movement.
              Cleared for full weight training by physiotherapist.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Phone className="h-5 w-5 text-red-500" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem icon={User} label="Name" value="Sarah Doe" />
            <InfoItem icon={Heart} label="Relationship" value="Spouse" />
            <InfoItem icon={Phone} label="Phone" value="+47 98765432" />
            <InfoItem icon={Mail} label="Email" value="sarah@example.com" />
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

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

export default ClientProfileTab;