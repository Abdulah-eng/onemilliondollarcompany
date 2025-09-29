'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { MultiSelect } from '@/components/ui/multi-select';
import { MUSCLE_GROUPS, EQUIPMENT_OPTIONS } from '@/constants/fitness';
import { cn } from '@/lib/utils';
import { ProgramCategory } from '@/mockdata/createprogram/mockExercises';

// Form data structure
interface ProgramDetailsForm {
  category: ProgramCategory;
  title: string;
  description: string;
  muscleGroups?: string[];
  equipment?: string[];
  benefits?: string;
  allergies?: string;
}

interface ProgramDetailsProps {
  onNext: (data: ProgramDetailsForm) => void;
  initialData?: Partial<ProgramDetailsForm>;
}

// Categories with emojis
const categoryOptions = [
  { value: 'fitness', label: 'Fitness', emoji: '💪', description: 'Workouts, strength, and cardio plans.' },
  { value: 'nutrition', label: 'Nutrition', emoji: '🥗', description: 'Meal plans and dietary guidance.' },
  { value: 'mental health', label: 'Mental Health', emoji: '🧘‍♂️', description: 'Mindfulness and stress management.' },
];

const ProgramDetails: React.FC<ProgramDetailsProps> = ({ onNext, initialData }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProgramDetailsForm>({
    defaultValues: {
      ...initialData,
      muscleGroups: initialData?.muscleGroups || [],
      equipment: initialData?.equipment || [],
    },
  });

  const selectedCategory = watch('category');
  const muscleGroups = watch('muscleGroups') || [];
  const equipment = watch('equipment') || [];

  const handleCategorySelect = (category: ProgramCategory) => {
    setValue('category', category);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Category Selection */}
      <div className="space-y-2">
        <Label className="text-lg">Select Program Category</Label>
        <p className="text-muted-foreground text-sm">Choose the primary focus of your new program.</p>
        <div className="flex gap-3 flex-wrap justify-start">
          {categoryOptions.map(option => (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
              onClick={() => handleCategorySelect(option.value as ProgramCategory)}
            >
              <Card
                className={cn(
                  "flex flex-col items-center justify-center gap-1 p-3 w-20 h-20 text-center transition-all duration-200",
                  selectedCategory === option.value
                    ? "border-primary ring-2 ring-primary/50"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="text-2xl">{option.emoji}</div>
                <h3 className="font-semibold text-xs">{option.label}</h3>
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
          placeholder="A comprehensive plan..."
          {...register('description')}
        />
      </div>

      {/* Dynamic Fields based on Category */}
      {selectedCategory === 'fitness' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="muscleGroups">Muscle Groups</Label>
            <MultiSelect
              options={MUSCLE_GROUPS}
              selected={muscleGroups}
              onChange={(selected) => setValue('muscleGroups', selected)}
              placeholder="Select muscle groups..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment Needed</Label>
            <MultiSelect
              options={EQUIPMENT_OPTIONS}
              selected={equipment}
              onChange={(selected) => setValue('equipment', selected)}
              placeholder="Select equipment..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits</Label>
            <Textarea
              id="benefits"
              placeholder="e.g., Strength, endurance..."
              {...register('benefits')}
            />
          </div>
        </>
      )}

      {selectedCategory === 'nutrition' && (
        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies / Restrictions</Label>
          <Input
            id="allergies"
            placeholder="e.g., Gluten, Dairy"
            {...register('allergies')}
          />
        </div>
      )}

      {selectedCategory === 'mental health' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment Needed</Label>
            <MultiSelect
              options={EQUIPMENT_OPTIONS}
              selected={equipment}
              onChange={(selected) => setValue('equipment', selected)}
              placeholder="Select equipment..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits</Label>
            <Textarea
              id="benefits"
              placeholder="e.g., Mindfulness, relaxation"
              {...register('benefits')}
            />
          </div>
        </>
      )}

      {/* Inline Next Button (kept) */}
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
