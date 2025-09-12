// src/components/coach/clientCard/ClientHeader.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const ClientHeader = ({ client }) => {
  return (
    <motion.div
      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4">
        <span className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-primary shadow-lg">
          <img className="aspect-square h-full w-full" src={client.profilePicture} alt={client.name} />
        </span>
        <div>
          <h1 className="text-3xl font-bold">{client.name}</h1>
          <p className="text-sm font-semibold text-muted-foreground">{client.plan} Plan</p>
        </div>
        <span className={cn("px-3 py-1 text-xs font-semibold rounded-full text-white mt-auto md:mt-0", client.color)}>
          {client.status}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <Button variant="outline" className="w-full md:w-auto">
          <MessageCircle size={18} className="mr-2" />
          Respond to Feedback
        </Button>
        <Button className="w-full md:w-auto">
          <ClipboardCheck size={18} className="mr-2" />
          Check-in
        </Button>
      </div>
    </motion.div>
  );
};

export default ClientHeader;
