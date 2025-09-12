// src/components/coach/clientCard/ClientPersonalInfo.tsx
import React from 'react';
import { User, Calendar, Ruler, Weight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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

const ClientPersonalInfo = ({ personalInfo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="space-y-4"
    >
      {/* Section header */}
      <div className="flex items-center gap-2">
        <User size={20} className="text-primary" />
        <h3 className="text-base font-semibold tracking-tight">Client Details</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatItem icon={Calendar} label="Age" value={personalInfo.age} />
        <StatItem icon={Ruler} label="Height" value={personalInfo.height} />
        <StatItem icon={Weight} label="Weight" value={personalInfo.weight} />
        <StatItem icon={Heart} label="Gender" value={personalInfo.gender} />
      </div>
    </motion.div>
  );
};

export default ClientPersonalInfo;
