// src/components/coach/dashboard/ClientOverview.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <h2 className="text-xl font-bold text-foreground">Client Statuses</h2>
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {mockClients.map((client) => (
              <li key={client.id} className="p-4 hover:bg-muted/50 transition-colors">
                <Link href={`/coach/clients/${client.id}`} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border">
                      <img className="aspect-square h-full w-full" src={`https://i.pravatar.cc/150?u=${client.id}`} alt={client.name} />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.plan} Plan</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={cn("rounded-full", client.color)}>
                      {client.status}
                    </Badge>
                    <ArrowRight size={16} className="text-muted-foreground" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientOverview;
