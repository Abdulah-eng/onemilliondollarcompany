import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface ClientRow { id: string; full_name: string | null; plan: string | null; avatar_url: string | null; }

const ClientList = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<ClientRow[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      // Customers assigned to this coach via profiles.coach_id
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, plan, avatar_url')
        .eq('coach_id', user.id)
        .eq('role', 'customer');
      if (!error) setClients((data || []) as ClientRow[]);
    };
    run();
  }, [user]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">My Clients 🏋️</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {clients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
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
                <Badge variant="secondary" className={cn("rounded-full", 'bg-green-500')}>
                  Active
                </Badge>
                <ArrowRight size={16} className="text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {clients.length === 0 && (
          <div className="text-sm text-muted-foreground">No clients yet.</div>
        )}
      </div>
    </div>
  );
};

export default ClientList;
