import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ClipboardCheck, Award, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

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
  // Calculate status indicators
  const lastCheckIn = client.dailyCheckIn?.length > 0 
    ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    : 'Never';
  
  const needsAttention = Math.random() > 0.7; // Mock logic
  const hasRecentFeedback = Math.random() > 0.8; // Mock logic

  return (
    <motion.div
      className="rounded-2xl border bg-card/60 shadow-sm backdrop-blur-sm p-6 overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        {/* Client Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          <span className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-border shadow-sm">
            <img
              className="aspect-square h-full w-full object-cover"
              src={client.profilePicture}
              alt={client.name}
            />
          </span>
          <div className="flex flex-col space-y-3 flex-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {client.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                  {client.plan} Plan
                </Badge>
                <Badge 
                  className="rounded-full px-3 py-1 text-xs font-semibold bg-secondary/10 text-secondary-foreground border-secondary/20"
                >
                  {client.status}
                </Badge>
                {needsAttention && (
                  <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-destructive/10 text-destructive border-destructive/20">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Needs Attention
                  </Badge>
                )}
                {hasRecentFeedback && (
                  <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-accent/10 text-accent-foreground border-accent/20">
                    💬 New Feedback
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Last Check-in</div>
                  <div className="text-sm font-medium">{lastCheckIn}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Adherence</div>
                  <div className="text-sm font-medium">{client.insights.adherence}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Program Days</div>
                  <div className="text-sm font-medium">28 remaining</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto lg:w-auto">
          <Button size="sm" className="rounded-full px-4">
            <MessageCircle className="h-4 w-4 mr-2" />
            Send Message
          </Button>
          <Button size="sm" variant="outline" className="rounded-full px-4">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Request Check-in
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientHeader;
