'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dumbbell, Utensils, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgramCategory } from '@/mockdata/createprogram/mockExercises';

// Form data structure
interface ProgramDetailsForm {
  category: ProgramCategory;
  title: string;
  description: string;
}

interface ProgramDetailsProps {
  onNext: (data: ProgramDetailsForm) => void;
  initialData?: Partial<ProgramDetailsForm>;
}

// Non-premium categories with clear icons
const categoryOptions = [
  {
    value: 'fitness',
    label: 'Fitness',
    icon: Dumbbell,
    description: 'Workouts, strength, and cardio plans.',
    bgColor: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    value: 'nutrition',
    label: 'Nutrition',
    icon: Utensils,
    description: 'Meal plans and dietary guidance.',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-700',
  },
  {
    value: 'mental health',
    label: 'Mental Health',
    icon: Heart,
    description: 'Mindfulness and stress management.',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-700',
  },
];

const ProgramDetails: React.FC<ProgramDetailsProps> = ({ onNext, initialData }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProgramDetailsForm>({
    defaultValues: initialData,
  });

  const selectedCategory = watch('category');

  const handleCategorySelect = (category: ProgramCategory) => {
    setValue('category', category);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Category Selection */}
      <div className="space-y-4">
        <Label className="text-lg">Select Program Category</Label>
        <p className="text-muted-foreground text-sm">Choose the primary focus of your new program.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categoryOptions.map(option => (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
            >
              <Card
                className={cn(
                  "flex flex-col items-center gap-4 p-6 transition-all duration-200 text-center",
                  selectedCategory === option.value
                    ? "border-primary ring-2 ring-primary/50"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => handleCategorySelect(option.value as ProgramCategory)}
              >
                <div className={cn("p-4 rounded-full", option.bgColor)}>
                  <option.icon className={cn("h-8 w-8", option.iconColor)} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">{option.label}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Program Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Program Title</Label>
        <Input
          id="title"
          placeholder="e.g., 30-Day Strength Builder"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      {/* Program Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Program Description</Label>
        <Textarea
          id="description"
          placeholder="A comprehensive plan to build foundational strength..."
          {...register('description')}
        />
      </div>

      {/* Next Button */}
      <Button
        onClick={handleSubmit(onNext)}
        className="w-full md:w-fit"
        disabled={!selectedCategory || !!errors.title}
      >
        Next: Start Building
      </Button>
    </motion.div>
  );
};

export default ProgramDetails;
