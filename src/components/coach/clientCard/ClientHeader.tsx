// src/components/coach/clientCard/ClientHeader.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, ClipboardCheck, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const ClientHeader = ({ client }) => {
  return (
    <motion.div
      className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 sm:p-8 overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top row: Profile + Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Profile Section */}
        <div className="flex items-center gap-4 flex-1">
          <span className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
            <img
              className="aspect-square h-full w-full object-cover"
              src={client.profilePicture}
              alt={client.name}
            />
          </span>
          <div className="flex flex-col flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {client.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-3 py-1 text-xs sm:text-sm font-semibold rounded-full bg-indigo-50 text-indigo-600">
                {client.plan} Plan
              </span>
              <span
                className={cn(
                  'px-3 py-1 text-xs sm:text-sm font-semibold rounded-full text-white',
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
            variant="outline"
            className="flex-1 sm:flex-none w-full sm:w-auto bg-white shadow hover:shadow-md text-gray-700 dark:text-gray-100"
          >
            <MessageCircle size={18} className="mr-2" />
            Respond
          </Button>
          <Button className="flex-1 sm:flex-none w-full sm:w-auto bg-primary text-white hover:bg-primary/90">
            <ClipboardCheck size={18} className="mr-2" />
            Check-in
          </Button>
        </div>
      </div>

      {/* Desktop Insight Card */}
      <Card className="absolute lg:top-6 lg:right-6 w-48 sm:w-56 bg-white dark:bg-slate-800 shadow-lg rounded-xl p-4 hidden lg:flex flex-col items-start justify-center">
        <CardContent className="p-0 flex items-center space-x-3">
          <Award size={28} className="text-amber-500" />
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Program Adherence
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {client.insights.adherence}%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Insight Card */}
      <Card className="flex lg:hidden mt-4 w-full bg-white dark:bg-slate-800 shadow-md rounded-xl p-4">
        <CardContent className="p-0 flex items-center space-x-3">
          <Award size={24} className="text-amber-500" />
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Program Adherence
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {client.insights.adherence}%
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientHeader;
