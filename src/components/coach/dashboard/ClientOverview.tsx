// src/components/coach/dashboard/ClientOverview.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockClients = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    plan: 'Trial',
    status: 'Missing Program',
    color: 'bg-red-500',
  },
  {
    id: 2,
    name: 'Mark Robertson',
    plan: 'Premium',
    status: 'Needs Feedback',
    color: 'bg-orange-500',
  },
  {
    id: 3,
    name: 'Emily Chen',
    plan: 'Standard',
    status: 'Off Track',
    color: 'bg-orange-500',
  },
  {
    id: 4,
    name: 'Chris Miller',
    plan: 'Standard',
    status: 'Soon to Expire',
    color: 'bg-orange-500',
  },
  {
    id: 5,
    name: 'Jessica Lee',
    plan: 'Premium',
    status: 'On Track',
    color: 'bg-green-500',
  },
];

const ClientOverview = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Client Statuses</h2>
      <p className="text-sm text-muted-foreground -mt-2">An overview of all your clients and their current status.</p>
      <div className="space-y-4">
        {mockClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow duration-300 rounded-xl">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <Link href={`/coach/clients/${client.id}`} className="flex items-center flex-1 gap-3">
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
        ))}
      </div>
    </div>
  );
};

export default ClientOverview;
