// src/components/coach/dashboard/ClientOverview.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ClientOverview = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      // Pull up to 5 recent clients assigned to this coach
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, plan, avatar_url')
        .eq('coach_id', user.id)
        .eq('role', 'customer')
        .order('updated_at', { ascending: false })
        .limit(5);
      setClients(data || []);
    };
    run();
  }, [user]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Client Statuses</h2>
      <p className="text-sm text-muted-foreground -mt-2">An overview of all your clients and their current status.</p>
      <div className="space-y-4">
        {clients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow duration-300 rounded-xl">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <Link to={`/coach/clients/${client.id}`} className="flex items-center flex-1 gap-3">
                <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                  <img className="aspect-square h-full w-full" src={client.avatar_url || `https://i.pravatar.cc/150?u=${client.id}`} alt={client.full_name || 'Client'} />
                </span>
                <div className="flex-1">
                  <p className="text-base font-semibold">{client.full_name || 'Client'}</p>
                  <p className="text-xs text-muted-foreground">{client.plan || 'Free'} Plan</p>
                </div>
              </Link>
              <Badge variant="secondary" className={cn("rounded-full", client.plan ? 'bg-green-500' : 'bg-red-500')}>
                {client.plan ? 'Active' : 'No Plan'}
              </Badge>
              <ArrowRight size={16} className="text-muted-foreground shrink-0" />
            </CardContent>
          </Card>
        ))}
        {clients.length === 0 && (
          <div className="text-sm text-muted-foreground">No clients yet.</div>
        )}
      </div>
    </div>
  );
};

export default ClientOverview;
