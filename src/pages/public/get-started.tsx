import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { toast } from 'sonner'; // Using Sonner for a cleaner toast experience
import { supabase } from '@/integrations/supabase/client';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { AuthCard } from '@/components/shared/AuthCard';
import { useRedirectIfAuthenticated } from '@/hooks/useRedirectIfAuthenticated';
import { Loader2, MailCheck } from 'lucide-react'; // For better icons

// This function can be moved to a dedicated `auth.actions.ts` file
async function sendMagicLink(email: string) {
  const redirectUrl = `${window.location.origin}/onboarding/step-1`;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // This is where the user will be redirected AFTER clicking the link in their email
      emailRedirectTo: redirectUrl, 
    },
  });
  return { error };
}

const GetStartedPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Custom hook handles all redirection logic
  const { loading: authLoading } = useRedirectIfAuthenticated();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    const { error } = await sendMagicLink(email);

    if (error) {
      toast.error(error.message || 'Failed to send login link. Please try again.');
    } else {
      setIsSuccess(true);
      toast.success('Check your email for your magic link!');
    }
    setIsLoading(false);
  };

  // Show a spinner while checking if the user is already logged in
  if (authLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  // The "Success" view after submitting the form
  if (isSuccess) {
    return (
      <AuthLayout>
        <AuthCard>
          <div className="text-center space-y-6">
            <MailCheck className="h-16 w-16 mx-auto text-green-500" />
            <h1 className="text-2xl font-bold">Check Your Email</h1>
            <p className="text-muted-foreground">
              We've sent a magic link to <strong>{email}</strong>. Click it to continue.
            </p>
            <Button variant="outline" onClick={() => setIsSuccess(false)} className="w-full">
              Use a different email
            </Button>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  // The main form view
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
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? 'Sending...' : 'Continue with Email'}
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground mt-6">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default GetStartedPage;
