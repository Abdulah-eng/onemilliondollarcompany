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
  // Use current date for mock data to make it feel fresh
  const lastCheckInDate = new Date();
  lastCheckInDate.setDate(lastCheckInDate.getDate() - 1);
  const lastCheckIn = lastCheckInDate.toLocaleDateString('en-GB'); // Formats as 8.9.2025

  // Mock booleans for feedback and status, as per your request
  const hasNewFeedback = true;
  const onTrack = true;

  return (
    <motion.div
      className="rounded-2xl border bg-card/60 shadow-sm backdrop-blur-sm p-6 overflow-hidden space-y-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Profile Picture */}
        <div className="relative mb-4">
          <motion.img
            className="h-24 w-24 rounded-full object-cover border-2 border-primary shadow-lg"
            src={client.profilePicture}
            alt={client.name}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>

        {/* Name and Badges */}
        <h1 className="text-3xl font-bold text-foreground">
          {client.name}
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-2 mt-2">
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

      {/* Quick Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b py-4 sm:border-t-0 sm:border-b-0 sm:py-0">
        <div className="flex flex-col items-center justify-center text-center">
          <Calendar className="h-6 w-6 text-primary mb-2" />
          <div className="text-sm text-muted-foreground">Last Check-in</div>
          <div className="text-lg font-bold">{lastCheckIn}</div>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <Award className="h-6 w-6 text-primary mb-2" />
          <div className="text-sm text-muted-foreground">Adherence</div>
          <div className="text-lg font-bold">{client.insights.adherence}</div>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <Clock className="h-6 w-6 text-primary mb-2" />
          <div className="text-sm text-muted-foreground">Program Days</div>
          <div className="text-lg font-bold">28 remaining</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button size="lg" className="flex-1 rounded-full text-base py-6">
          <MessageCircle className="h-5 w-5 mr-2" />
          Give Feedback
        </Button>
        <Button size="lg" variant="outline" className="flex-1 rounded-full text-base py-6">
          <ClipboardCheck className="h-5 w-5 mr-2" />
          Check In
        </Button>
      </div>
    </motion.div>
  );
};

export default ClientHeader;
