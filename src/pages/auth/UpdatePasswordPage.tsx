'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { updateUserPassword } from '@/lib/supabase/actions';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { AuthCard } from '@/components/shared/AuthCard';
import { Loader2 } from 'lucide-react';

const formSchema = z
  .object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await updateUserPassword(values.password);
      if (error) {
        // Handle specific error cases
        if (error.message.includes('Password should be at least')) {
          toast.error('Password must be at least 8 characters long.');
        } else if (error.message.includes('Invalid password')) {
          toast.error('Password does not meet security requirements.');
        } else if (error.message.includes('session_not_found')) {
          toast.error('Session expired. Please request a new password reset link.');
          navigate('/forgot-password');
        } else {
          toast.error(error.message || 'Failed to update password.');
        }
      } else {
        toast.success('Password updated successfully. Please log in.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Set a New Password</h1>
          <p className="text-muted-foreground">Enter and confirm your new password.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="New password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </form>
        </Form>
      </AuthCard>
    </AuthLayout>
  );
};

export default UpdatePasswordPage;


