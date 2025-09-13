import React from 'react';
import { User, Calendar, Ruler, Weight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
}

const StatItem = ({ icon: Icon, label, value }: StatItemProps) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-muted flex items-center justify-center">
      <Icon size={18} className="text-muted-foreground" />
    </div>
    <div className="flex flex-col">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

// MOCK PERSONAL INFO
const mockPersonalInfo = {
  name: 'John Doe',
  age: 28,
  gender: 'Male',
  height: 180,
  weight: 72,
  phone: '+47 12345678',
  email: 'john@example.com',
  preferences: 'Low-carb, Morning workouts',
  dislikes: 'Sugar, Late-night snacks',
  allergies: ['Peanuts', 'Gluten'],
  injuries: ['Knee'],
  meditation_experience: '2 years',
  goals: ['Build muscle', 'Lose fat'],
  payment_plan: 'premium',
  onboarding_complete: true,
};

const ClientPersonalInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <User size={20} className="text-primary" />
        <h3 className="text-base font-semibold tracking-tight">Client Details</h3>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatItem icon={Calendar} label="Age" value={mockPersonalInfo.age} />
        <StatItem icon={Ruler} label="Height (cm)" value={mockPersonalInfo.height} />
        <StatItem icon={Weight} label="Weight (kg)" value={mockPersonalInfo.weight} />
        <StatItem icon={Heart} label="Gender" value={mockPersonalInfo.gender} />
      </div>

      {/* Preferences & Goals */}
      <div className="space-y-3">
        <div className="text-sm font-semibold">Preferences & Goals</div>
        <p><strong>Preferences:</strong> {mockPersonalInfo.preferences}</p>
        <p><strong>Dislikes:</strong> {mockPersonalInfo.dislikes}</p>
        <div className="flex flex-wrap gap-2">
          <strong>Allergies:</strong>
          {mockPersonalInfo.allergies.map(a => <Badge key={a}>{a}</Badge>)}
        </div>
        <div className="flex flex-wrap gap-2">
          <strong>Injuries:</strong>
          {mockPersonalInfo.injuries.map(i => <Badge key={i} variant="destructive">{i}</Badge>)}
        </div>
        <p><strong>Meditation Experience:</strong> {mockPersonalInfo.meditation_experience}</p>
        <div className="flex flex-wrap gap-2">
          <strong>Goals:</strong>
          {mockPersonalInfo.goals.map(g => <Badge key={g} variant="secondary">{g}</Badge>)}
        </div>
      </div>

      {/* Contact & Payment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <p><strong>Phone:</strong> {mockPersonalInfo.phone}</p>
        <p><strong>Email:</strong> {mockPersonalInfo.email}</p>
        <p><strong>Payment Plan:</strong> <Badge variant="secondary">{mockPersonalInfo.payment_plan}</Badge></p>
        <p><strong>Onboarding:</strong> {mockPersonalInfo.onboarding_complete ? 'Complete' : 'Pending'}</p>
      </div>
    </motion.div>
  );
};

export default ClientPersonalInfo;
