// src/components/coach/clientCard/ClientHeader.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, ClipboardCheck, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface ClientHeaderProps {
  client: {
    name: string;
    profilePicture?: string; // Updated to be optional
    plan: string;
    status: string;
    color: string; // Tailwind color class
    insights: { adherence: string };
  };
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ client }) => {
  const profilePicture = client.profilePicture || 'https://i.pravatar.cc/150'; // Fallback image
  const clientName = client.name || 'Unknown Client';
  const clientPlan = client.plan || 'No Plan';
  const clientStatus = client.status || 'Unknown';
  const clientColor = client.color || 'bg-gray-500';

  return (
    <motion.div
      className="relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1">
          <span className="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white dark:border-primary shadow-lg">
            <img
              className="aspect-square h-full w-full object-cover"
              src={profilePicture}
              alt={clientName}
            />
          </span>
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">{clientName}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/40 backdrop-blur-sm text-primary dark:text-gray-100">
                {clientPlan} Plan
              </span>
              <span
                className={cn("px-3 py-1 text-xs font-semibold rounded-full text-white", clientColor)}>
                {clientStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
          <Button variant="outline" className="w-full bg-white/90 text-foreground hover:bg-white">
            <MessageCircle size={18} className="mr-2" />
            Respond to Feedback
          </Button>
          <Button className="w-full bg-primary text-white hover:bg-primary/90">
            <ClipboardCheck size={18} className="mr-2" />
            Check-in
          </Button>
        </div>
      </div>
      
      {/* Elevated Insight Card */}
      <Card className="absolute top-4 right-4 bg-white/50 backdrop-blur-md rounded-xl shadow-lg p-4 hidden lg:block">
        <CardContent className="p-0 flex items-center space-x-2">
          <Award size={24} className="text-amber-500" />
          <div>
            <p className="text-sm font-semibold">Program Adherence</p>
            <p className="text-xl font-bold">{client.insights?.adherence || 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientHeader;
