// src/components/coach/client-overview/ClientList.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Mapped from system logic
/*
TODO: Backend Integration Notes
- `clients`: Fetch from a 'profiles' table where 'role' is 'customer'.
- The statuses and colors are derived from the 'Customer Status Tags' logic.
*/
const mockClients = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    plan: 'Trial',
    status: 'Missing Program',
    color: 'bg-red-500',
    link: '/coach/clients/sarah-jenkins'
  },
  {
    id: 2,
    name: 'Mark Robertson',
    plan: 'Premium',
    status: 'Needs Feedback',
    color: 'bg-orange-500',
    link: '/coach/clients/mark-robertson'
  },
  {
    id: 3,
    name: 'Emily Chen',
    plan: 'Standard',
    status: 'Off Track',
    color: 'bg-orange-500',
    link: '/coach/clients/emily-chen'
  },
  {
    id: 4,
    name: 'Chris Miller',
    plan: 'Standard',
    status: 'Soon to Expire',
    color: 'bg-orange-500',
    link: '/coach/clients/chris-miller'
  },
  {
    id: 5,
    name: 'Jessica Lee',
    plan: 'Premium',
    status: 'On Track',
    color: 'bg-green-500',
    link: '/coach/clients/jessica-lee'
  },
  {
    id: 6,
    name: 'Tom Green',
    plan: 'Standard',
    status: 'On Track',
    color: 'bg-green-500',
    link: '/coach/clients/tom-green'
  },
  {
    id: 7,
    name: 'Linda Scott',
    plan: 'Premium',
    status: 'On Track',
    color: 'bg-green-500',
    link: '/coach/clients/linda-scott'
  },
  {
    id: 8,
    name: 'Paul Wilson',
    plan: 'OTP',
    status: 'Program Expired',
    color: 'bg-red-500',
    link: '/coach/clients/paul-wilson'
  },
];

const ClientList = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">My Clients 🏋️</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockClients.map((client, index) => (
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
                <Link to={client.link} className="flex items-center flex-1 gap-3">
                  <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                    <img className="aspect-square h-full w-full" src={`https://i.pravatar.cc/150?u=${client.id}`} alt={client.name} />
                  </span>
                  <div className="flex-1">
                    <p className="text-base font-semibold">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.plan} Plan</p>
                  </div>
                </Link>
                <Badge variant="secondary" className={cn("rounded-full", client.color)}>
                  {client.status}
                </Badge>
                <ArrowRight size={16} className="text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;
