// src/components/coach/clientCard/CurrentProgram.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const CurrentProgram = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="shadow-lg rounded-xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Current Program 🏋️</h3>
            <Button variant="ghost" className="text-primary">View Details</Button>
          </div>
          {/* Placeholder for Program Detail/Calendar View */}
          <div className="bg-muted h-64 rounded-xl flex items-center justify-center text-muted-foreground">
            [Program Calendar/Progress Graph goes here]
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CurrentProgram;
