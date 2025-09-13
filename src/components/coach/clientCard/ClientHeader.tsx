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
      className="bg-card/70 backdrop-blur-md rounded-2xl border border-border shadow-lg p-6 overflow-hidden space-y-6 flex flex-col items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Section: Profile, Name, Badges, and Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center w-full justify-between gap-6 sm:gap-4">
        {/* Profile and Name */}
        <div className="flex flex-col items-center sm:items-start gap-4 flex-1">
          <motion.img
            className="h-24 w-24 rounded-full object-cover border-2 border-green-500 shadow-md"
            src={client.profilePicture}
            alt={client.name}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="text-3xl font-bold text-foreground">{client.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {onTrack && (
                <Badge className="rounded-full px-2 py-1 text-xs font-semibold bg-green-500/10 text-green-500 border-green-500/20">
                  On Track
                </Badge>
              )}
              {hasNewFeedback && (
                <Badge className="rounded-full px-2 py-1 text-xs font-semibold bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                  💬 New Feedback
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          <Button className="flex-1 rounded-full text-base h-12">
            <MessageCircle className="h-5 w-5 mr-2" />
            Give Feedback
          </Button>
          <Button variant="outline" className="flex-1 rounded-full text-base h-12">
            <ClipboardCheck className="h-5 w-5 mr-2" />
            Check In
          </Button>
        </div>
      </div>
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-6 w-full mt-6">
        <div className="flex flex-col items-center text-center">
          <Calendar className="h-6 w-6 text-green-500 mb-2" />
          <div className="text-sm text-muted-foreground">Last Check-in</div>
          <div className="font-bold text-base">{lastCheckIn}</div>
        </div>
        <div className="flex flex-col items-center text-center">
          <Award className="h-6 w-6 text-green-500 mb-2" />
          <div className="text-sm text-muted-foreground">Adherence</div>
          <div className="font-bold text-base">{client.insights.adherence}</div>
        </div>
        <div className="flex flex-col items-center text-center">
          <Clock className="h-6 w-6 text-green-500 mb-2" />
          <div className="text-sm text-muted-foreground">Program Days</div>
          <div className="font-bold text-base">28 remaining</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientHeader;
