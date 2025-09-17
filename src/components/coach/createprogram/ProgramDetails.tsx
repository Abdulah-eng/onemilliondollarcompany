'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProgramCategory } from '@/mockdata/createprogram/mockExercises';

// Define form data structure
interface ProgramDetailsForm {
  category: ProgramCategory;
  title: string;
  description: string;
}

interface ProgramDetailsProps {
  onNext: (data: ProgramDetailsForm) => void;
  initialData?: Partial<ProgramDetailsForm>;
}

// Only non-premium categories
const categoryOptions: ProgramCategory[] = ['fitness', 'nutrition', 'mental health'];

const ProgramDetails: React.FC<ProgramDetailsProps> = ({ onNext, initialData }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProgramDetailsForm>({
    defaultValues: initialData,
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          onValueChange={(value: ProgramCategory) => setValue('category', value)}
          defaultValue={initialData?.category}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      <Button onClick={handleSubmit(onNext)} className="w-full md:w-fit">
        Next: Start Building
      </Button>
    </motion.div>
  );
};

export default ProgramDetails;
