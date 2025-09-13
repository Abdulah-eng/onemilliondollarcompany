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
      className="bg-card/70 backdrop-blur-md rounded-2xl border-b border-border shadow-lg p-6 overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4">
        {/* Profile Info and Badges Section */}
        <div className="flex items-center gap-4 flex-1">
          {/* Profile Picture */}
          <motion.img
            className="h-20 w-20 rounded-full object-cover border-2 border-primary shadow-lg"
            src={client.profilePicture}
            alt={client.name}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          {/* Name and Badges */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {onTrack && (
                <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-green-500/10 text-green-500 border-green-500/20">
                  On Track
                </Badge>
              )}
              {hasNewFeedback && (
                <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                  💬 New Feedback
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button className="flex-1 rounded-full text-sm h-10 px-4 py-2">
            <MessageCircle className="h-4 w-4 mr-2" />
            Give Feedback
          </Button>
          <Button variant="outline" className="flex-1 rounded-full text-sm h-10 px-4 py-2">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Check In
          </Button>
        </div>
      </div>
      
      {/* Quick Stats Grid */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6 p-4 rounded-xl bg-card/50">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-2">
          <Calendar className="h-6 w-6 text-primary mb-1" />
          <div className="text-xs text-muted-foreground font-medium">Last Check-in</div>
          <div className="text-sm font-bold text-foreground mt-1">{lastCheckIn}</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-2">
          <Award className="h-6 w-6 text-primary mb-1" />
          <div className="text-xs text-muted-foreground font-medium">Adherence</div>
          <div className="text-sm font-bold text-foreground mt-1">{client.insights.adherence}</div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-2">
          <Clock className="h-6 w-6 text-primary mb-1" />
          <div className="text-xs text-muted-foreground font-medium">Program Days</div>
          <div className="text-sm font-bold text-foreground mt-1">28 remaining</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientHeader;
