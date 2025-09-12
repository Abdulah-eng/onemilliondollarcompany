// src/components/coach/clientCard/ClientHeader.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, ClipboardCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const ClientHeader = ({ client }) => {
  return (
    <motion.div
      className="bg-card shadow-lg rounded-xl overflow-hidden p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1">
          <span className="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-primary shadow-lg">
            <img className="aspect-square h-full w-full" src={client.profilePicture} alt={client.name} />
          </span>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                {client.plan} Plan
              </span>
              <span className={cn("px-2 py-0.5 text-xs font-semibold rounded-full text-white", client.color)}>
                {client.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 md:flex-none">
          <Button variant="outline" className="w-full">
            <MessageCircle size={18} className="mr-2" />
            Respond to Feedback
          </Button>
          <Button className="w-full">
            <ClipboardCheck size={18} className="mr-2" />
            Check-in
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientHeader;
