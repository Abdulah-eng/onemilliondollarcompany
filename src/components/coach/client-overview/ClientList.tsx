import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ClientRow { 
  id: string; 
  full_name: string | null; 
  plan: string | null; 
  avatar_url: string | null;
  isNewlyAccepted?: boolean;
}

interface ClientListProps {
  refreshTrigger?: number;
}

const ClientList = ({ refreshTrigger }: ClientListProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Customers assigned to this coach via profiles.coach_id
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, plan, avatar_url')
        .eq('coach_id', user.id)
        .eq('role', 'customer')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }
      
      setClients((data || []) as ClientRow[]);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user, refreshTrigger]);

  const handleChatClick = (clientId: string, clientName: string) => {
    // Navigate to messages page with this specific client
    navigate(`/coach/messages?client=${clientId}&name=${encodeURIComponent(clientName)}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">My Clients 🏋️</h2>
        <div className="text-center py-8">
          <div className="text-sm text-muted-foreground">Loading clients...</div>
        </div>
      </div>
    );
  }

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
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                    <img className="aspect-square h-full w-full" src={client.avatar_url || `https://i.pravatar.cc/150?u=${client.id}`} alt={client.full_name || 'Client'} />
                  </span>
                  <div className="flex-1">
                    <p className="text-base font-semibold">{client.full_name || 'Client'}</p>
                    <p className="text-xs text-muted-foreground">{client.plan || 'Free'} Plan</p>
                  </div>
                  <Badge variant="secondary" className={cn("rounded-full", 'bg-green-500')}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleChatClick(client.id, client.full_name || 'Client')}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <Link to={`/coach/clients/${client.id}`}>
                      <ArrowRight size={16} className="text-muted-foreground" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {clients.length === 0 && (
          <div className="col-span-full text-center py-8">
            <div className="text-sm text-muted-foreground">No clients yet. Accept requests to see them here.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;
