// src/components/coach/programs/ProgramsHeader.tsx
import React from 'react';
import { motion } from 'framer-motion';

const ProgramsHeader = () => {
  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold">Programs</h1>
      <p className="text-muted-foreground max-w-lg">
        Manage all your created programs. Assign, schedule, and edit them with ease.
      </p>
    </motion.div>
  );
};

export default ProgramsHeader;
