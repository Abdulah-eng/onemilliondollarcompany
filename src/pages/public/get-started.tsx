// src/pages/public/get-started.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { AuthCard } from '@/components/shared/AuthCard';
import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated';
import { Loader2, MailCheck } from 'lucide-react';

// Simplified helper function, no role needed.
async function sendMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/onboarding/step-1`,
    },
  });
  return { error };
}

const GetStartedPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { loading: authLoading } = useRedirectIfAuthenticated();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // The role is no longer passed; it will be handled by the database.
    const { error } = await sendMagicLink(email);

    if (error) {
      toast.error(error.message || 'Failed to send login link.');
    } else {
      setIsSuccess(true);
      toast.success('Check your email for your magic link!');
    }
    setIsLoading(false);
  };

  if (authLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  // The Success View remains the same.
  if (isSuccess) {
    // ... same success JSX as before ...
  }

  // MAIN FORM VIEW (Now simpler without the role toggle)
  return (
    <AuthLayout>
      <AuthCard>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Join TrainWiseStudio</h1>
          <p className="text-muted-foreground">Enter your email to get started.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="h-10"
          />
          <Button type="submit" className="w-full" size="lg" disabled={isLoading || !email}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue with Email
          </Button>
        </form>
        
        <div className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log In
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default GetStartedPage;
