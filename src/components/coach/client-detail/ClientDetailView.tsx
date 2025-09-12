// src/components/coach/client-detail/ClientDetailView.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Weight, Heart, Ruler, Calendar, MapPin, Target,
  Flame, Salad, BrainCircuit,
  Dumbbell, Utensils, Zap, Bed, Droplet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const mockClientData = {
  name: 'Mark Robertson',
  plan: 'Premium',
  status: 'Needs Feedback',
  color: 'bg-orange-500',
  profilePicture: 'https://i.pravatar.cc/150?u=mark-robertson',
  personalInfo: {
    age: 28,
    gender: 'Male',
    height: '180 cm',
    weight: '85 kg',
    location: 'Oslo, Norway',
  },
  goals: ['Muscle Gain', 'Increase Strength'],
  preferences: {
    injuries: ['Knee (old injury)'],
    allergies: ['Peanuts'],
    likes: ['Spicy food', 'HIIT workouts'],
    dislikes: ['Running', 'Boring exercises'],
    preferredProgramType: ['Fitness'],
  },
  vitalStats: {
    avgHeartRate: '75 bpm',
    avgSleep: '7.2 hours',
    avgHydration: '2.5 L',
    avgMood: 'Great',
  },
};

const ClientDetailView = ({ client = mockClientData }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <span className="relative flex h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-primary shadow-lg">
          <img className="aspect-square h-full w-full" src={client.profilePicture} alt={client.name} />
        </span>
        <h1 className="text-3xl font-bold">{client.name}</h1>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-muted-foreground">{client.plan} Plan</p>
          <span className={cn("px-3 py-1 text-xs font-semibold rounded-full text-white", client.color)}>
            {client.status}
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} className="text-primary" />
              Client Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {client.goals.map((goal, index) => (
                <span key={index} className="px-4 py-2 text-sm font-medium rounded-full bg-accent text-accent-foreground">
                  {goal}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell size={20} className="text-primary" />
              Personal Info & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatItem icon={Calendar} label="Age" value={client.personalInfo.age} />
              <StatItem icon={Ruler} label="Height" value={client.personalInfo.height} />
              <StatItem icon={Weight} label="Weight" value={client.personalInfo.weight} />
              <StatItem icon={MapPin} label="Location" value={client.personalInfo.location} />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-muted-foreground">Injuries: <span className="text-foreground">{client.preferences.injuries.join(', ') || 'None'}</span></p>
              <p className="font-semibold text-muted-foreground">Allergies: <span className="text-foreground">{client.preferences.allergies.join(', ') || 'None'}</span></p>
              <p className="font-semibold text-muted-foreground">Preferred Programs: <span className="text-foreground">{client.preferences.preferredProgramType.join(', ')}</span></p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart size={20} className="text-primary" />
              Vital Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <StatItem icon={Heart} label="Heart Rate" value={client.vitalStats.avgHeartRate} />
              <StatItem icon={Bed} label="Sleep" value={client.vitalStats.avgSleep} />
              <StatItem icon={Droplet} label="Hydration" value={client.vitalStats.avgHydration} />
              <StatItem icon={Zap} label="Mood" value={client.vitalStats.avgMood} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// Reusable component for displaying a single stat item
const StatItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2">
    <div className="flex-shrink-0">
      <Icon size={20} className="text-muted-foreground" />
    </div>
    <div className="flex flex-col">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  </div>
);

export default ClientDetailView;
