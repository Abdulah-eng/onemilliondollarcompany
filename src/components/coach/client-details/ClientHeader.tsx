// src/components/coach/client-details/ClientHeader.tsx
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, ClipboardCheck, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ClientDetailData } from '@/hooks/useClientDetail';
import ClientSummaryBar from './ClientSummaryBar'; // Re-using this as the header's core logic

interface ClientHeaderProps {
  client: ClientDetailData;
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
        <ClientSummaryBar client={client} />
      </div>

      {/* Elevated Insight Card */}
      <Card className="absolute top-4 right-4 bg-white/50 backdrop-blur-md rounded-xl shadow-lg p-4 hidden lg:block">
        <CardContent className="p-0 flex items-center space-x-2">
          <Award size={24} className="text-amber-500" />
          <div>
            <p className="text-sm font-semibold">Program Adherence</p>
            <p className="text-xl font-bold">{client.adherence_pct || 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientHeader;
