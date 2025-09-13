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
      className="bg-card/70 backdrop-blur-md rounded-2xl border border-border shadow-lg p-6 overflow-hidden space-y-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Section: Profile, Name, and Badges */}
      <div className="flex flex-col items-center text-center">
        {/* Profile Picture */}
        <motion.img
          className="h-24 w-24 rounded-full object-cover border-2 border-green-500 shadow-md mb-4"
          src={client.profilePicture}
          alt={client.name}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        {/* Name and Badges */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{client.name}</h1>
          <div className="flex flex-wrap justify-center items-center gap-2">
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

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          className="w-full rounded-2xl h-14 text-base font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors"
          style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Give Feedback
        </Button>
        <Button
          variant="outline"
          className="w-full rounded-2xl h-14 text-base font-semibold border-2 border-primary/20 bg-background hover:bg-muted/50 transition-colors"
        >
          <ClipboardCheck className="h-5 w-5 mr-2" />
          Check In
        </Button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center text-center">
          <Calendar className="h-8 w-8 text-green-500 mb-2" />
          <div className="text-sm text-muted-foreground font-medium">Last Check-in</div>
          <div className="font-bold text-lg">{lastCheckIn}</div>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <Award className="h-8 w-8 text-green-500 mb-2" />
          <div className="text-sm text-muted-foreground font-medium">Adherence</div>
          <div className="font-bold text-lg">{client.insights.adherence}</div>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <Clock className="h-8 w-8 text-green-500 mb-2" />
          <div className="text-sm text-muted-foreground font-medium">Program Days</div>
          <div className="font-bold text-lg">28 remaining</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientHeader;
