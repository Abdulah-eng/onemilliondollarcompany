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
  Edit
} from 'lucide-react';

interface DetailsTabProps {
  client: any;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ client }) => {
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

export default DetailsTab;