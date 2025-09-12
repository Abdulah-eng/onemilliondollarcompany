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
    profilePicture: string;
    plan: string;
    status: string;
    color: string; // Tailwind color class
    insights: { adherence: string };
  };
}

const ClientHeader: React.FC<ClientHeaderProps> = ({ client }) => {
  return (
    <motion.div
      className="relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Client Info */}
        <div className="flex items-center gap-4 flex-1">
          <span className="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white dark:border-primary shadow-lg">
            <img
              className="aspect-square h-full w-full object-cover"
              src={client.profilePicture}
              alt={client.name}
            />
          </span>
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              {client.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/40 backdrop-blur-sm text-primary dark:text-gray-100">
                {client.plan} Plan
              </span>
              <span
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-full text-white",
                  client.color
                )}
              >
                {client.status}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 lg:mt-0">
          <Button
            variant="default"
            className="flex-1 sm:flex-none w-full sm:w-auto bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow-sm transition"
          >
            <MessageCircle size={18} className="mr-2" />
            Respond
          </Button>
          <Button className="flex-1 sm:flex-none w-full sm:w-auto bg-primary text-white hover:bg-primary/90 transition">
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
            <p className="text-xl font-bold">{client.insights.adherence}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientHeader;
