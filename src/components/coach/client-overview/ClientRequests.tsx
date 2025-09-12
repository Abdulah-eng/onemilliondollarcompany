// src/components/coach/client-overview/ClientRequests.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Mapped from system logic and notifications
/*
TODO: Backend Integration Notes
- `newRequests`: Fetch from a 'requests' table where 'status' is 'pending'.
- `goals`: These should be linked to the onboarding flow and stored in the database.
*/
const mockRequests = [
  {
    id: 1,
    clientName: 'Emily Clark',
    plan: 'Trial',
    goals: ['Weight Loss', 'Increased Energy'],
    link: '/coach/requests/1',
  },
  {
    id: 2,
    clientName: 'David Rodriguez',
    plan: 'Standard',
    goals: ['Muscle Gain', 'Improve Nutrition'],
    link: '/coach/requests/2',
  },
  {
    id: 3,
    clientName: 'Jessica Williams',
    plan: 'Trial',
    goals: ['Better Sleep', 'Stress Reduction'],
    link: '/coach/requests/3',
  },
];

const ClientRequests = () => {
  if (mockRequests.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Incoming Requests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockRequests.map((request) => (
          <Card key={request.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-semibold text-primary">
                New {request.plan} Plan
              </CardTitle>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                  <img className="aspect-square h-full w-full" src={`https://i.pravatar.cc/150?u=${request.id}`} alt={request.clientName} />
                </span>
                <div className="flex flex-col">
                  <p className="text-lg font-bold">{request.clientName}</p>
                  <p className="text-sm text-muted-foreground">Goals: {request.goals.join(', ')}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" size="sm" className="w-full text-green-600 hover:text-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button variant="ghost" size="sm" className="w-full text-red-600 hover:text-red-700">
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientRequests;
