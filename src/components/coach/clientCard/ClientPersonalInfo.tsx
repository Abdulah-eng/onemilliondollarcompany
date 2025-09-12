// src/components/coach/clientCard/ClientPersonalInfo.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, Ruler, Weight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

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

const ClientPersonalInfo = ({ personalInfo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="shadow-lg rounded-xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">Client Details <User size={20} className="text-primary" /></h3>
          <div className="grid grid-cols-2 gap-4">
            <StatItem icon={Calendar} label="Age" value={personalInfo.age} />
            <StatItem icon={Ruler} label="Height" value={personalInfo.height} />
            <StatItem icon={Weight} label="Weight" value={personalInfo.weight} />
            <StatItem icon={Heart} label="Gender" value={personalInfo.gender} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientPersonalInfo;
