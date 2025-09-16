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
  Heart,
  Copy,
  Target,
  Activity,
  Crown,
  Play,
  Clock
} from 'lucide-react';

interface ClientProfileTabProps {
  client: {
    name: string;
    age: number;
    height: number;
    weight: number;
    goals: string[];
    plan: string;
    daysRemaining: number;
    programs: Program[]; // Updated client type to include programs
    trends?: {
      moodValue: number;
      moodChange: number;
      sleepValue: number;
      sleepChange: number;
      energyValue: number;
      energyChange: number;
      waterValue: number;
      waterChange: number;
    };
  };
}

// ✅ New type definition for Program
interface Program {
  id: string;
  name: string;
  status: 'active' | 'scheduled';
  startDate?: string;
}

const ClientProfileTab: React.FC<ClientProfileTabProps> = ({ client }) => {
  const handleCopyInfo = () => {
    const info = `Client: ${client.name}\nAge: 28\nHeight: 180cm\nWeight: 72kg\nGoals: Build muscle, Lose fat`;
    navigator.clipboard.writeText(info);
  };

  // ✅ Mock programs data for demonstration
  const programs: Program[] = [
    { id: '1', name: '30-Day Strength Builder', status: 'active' },
    { id: '2', name: 'Beginner Yoga Flow', status: 'active' },
    { id: '3', name: 'Summer Shred Program', status: 'scheduled', startDate: '2025-10-01' },
    { id: '4', name: 'Marathon Training Plan', status: 'scheduled', startDate: '2025-11-15' },
  ];

  const activePrograms = programs.filter(p => p.status === 'active');
  const scheduledPrograms = programs.filter(p => p.status === 'scheduled');

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ✅ New Programs Container */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-5 w-5" />
            Programs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Current Active Program(s)</h4>
            {activePrograms.length > 0 ? (
              <div className="flex flex-col gap-2">
                {activePrograms.map(p => (
                  <div key={p.id} className="flex items-center gap-2 p-3 rounded-xl border bg-muted/30">
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      <Play className="h-3 w-3 mr-1" /> Active
                    </Badge>
                    <span className="font-medium text-sm">{p.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No active programs.</div>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Scheduled Program(s)</h4>
            {scheduledPrograms.length > 0 ? (
              <div className="flex flex-col gap-2">
                {scheduledPrograms.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        <Clock className="h-3 w-3 mr-1" /> Scheduled
                      </Badge>
                      <span className="font-medium text-sm">{p.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{new Date(p.startDate!).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No scheduled programs.</div>
            )}
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
            <Button size="sm" variant="ghost" onClick={handleCopyInfo} className="gap-2">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
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
            {/* Premium Plan Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Crown className="h-4 w-4 text-yellow-500" />
                Membership
              </div>
              <Badge className="rounded-full px-3 py-1 text-xs bg-yellow-100 text-yellow-700 border-yellow-200">
                {client.plan || 'Premium'} • {client.daysRemaining || 28} days left
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
        </CardContent>
      </Card>

      {/* Health Information */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Heart className="h-5 w-5 text-rose-500" />
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
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Generic info item
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
