// src/components/coach/clientCard/ClientHeader.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ClipboardCheck, Award, Clock, Calendar } from 'lucide-react';
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
        {/* Profile & Name */}
        <div className="flex items-center gap-4 flex-1">
          <motion.img
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border border-border shadow-sm"
            src={client.profilePicture}
            alt={client.name}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-foreground">{client.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {onTrack && (
                <Badge className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-green-500/10 text-green-600 border-green-500/20">
                  On Track
                </Badge>
              )}
              {hasNewFeedback && (
                <Badge className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-yellow-500/10 text-yellow-600 border-yellow-500/20 animate-pulse">
                  💬 New Feedback
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-2">
          <motion.div whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.05 }}>
            <Button
              size="sm"
              className="rounded-full text-xs h-8 px-3 flex items-center gap-1 shadow-sm"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Feedback
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.05 }}>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full text-xs h-8 px-3 flex items-center gap-1 shadow-sm"
            >
              <ClipboardCheck className="h-3.5 w-3.5" />
              Check In
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-5 w-full">
        {[
          { icon: Calendar, label: 'Last Check-in', value: lastCheckIn },
          { icon: Award, label: 'Adherence', value: client.insights.adherence },
          { icon: Clock, label: 'Program Days', value: '28 remaining' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center justify-center bg-muted/30 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition"
            whileHover={{ y: -2 }}
          >
            <stat.icon className="h-4 w-4 text-green-500 mb-1.5" />
            <div className="text-[11px] text-muted-foreground">{stat.label}</div>
            <div className="font-semibold text-sm">{stat.value}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ClientHeader;
