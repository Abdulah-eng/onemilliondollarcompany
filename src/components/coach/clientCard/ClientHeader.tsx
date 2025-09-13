// src/components/coach/clientCard/ClientHeader.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClientHeaderProps {
  client: {
    name: string;
    profilePicture: string;
    plan: string;
    status: string;
    color: string;
    insights: { adherence: string };
    dailyCheckIn?: any[];
    trends?: any;
  };
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ client }) => {
  const lastCheckInDate = new Date();
  lastCheckInDate.setDate(lastCheckInDate.getDate() - 1);
  const lastCheckIn = lastCheckInDate.toLocaleDateString('en-GB');

  const hasNewFeedback = true;
  const onTrack = true;

  return (
    <motion.div
      className="bg-card/70 backdrop-blur-md rounded-2xl border border-border shadow-md p-4 sm:p-6 overflow-hidden flex flex-col gap-6"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center w-full justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <motion.img
            className="h-16 w-16 sm:h-18 sm:w-18 rounded-full object-cover border border-border shadow-sm"
            src={client.profilePicture}
            alt={client.name}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
              {client.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {onTrack && (
                <Badge className="rounded-full px-2 py-0.5 text-xs sm:text-sm font-medium bg-green-500/10 text-green-600 border-green-500/20">
                  On Track
                </Badge>
              )}
              {hasNewFeedback && (
                <Badge className="rounded-full px-2 py-0.5 text-xs sm:text-sm font-medium bg-yellow-500/10 text-yellow-600 border-yellow-500/20 animate-pulse">
                  💬 New Feedback
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
        {[
          { icon: Calendar, label: 'Last Check-in', value: lastCheckIn },
          { icon: Award, label: 'Adherence', value: client.insights.adherence },
          { icon: Clock, label: 'Program Days', value: '28 remaining' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center justify-center"
            whileHover={{ y: -2 }}
          >
            <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mb-1" />
            <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
            <div className="font-semibold text-sm sm:text-base">{stat.value}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ClientHeader;
