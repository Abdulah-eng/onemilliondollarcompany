// src/components/coach/client-overview/ClientFilters.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Filter } from 'lucide-react';

// Mapped from system logic
/*
TODO: Backend Integration Notes
- This component will control the filtering logic for the ClientList.
- `statuses`: should be 'Missing Program', 'Needs Feedback', 'Off Track', 'On Track', etc.
*/
const ClientFilters = () => {
  return (
    <Card className="shadow-lg rounded-xl sticky top-0 z-10 bg-background">
      <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full md:w-auto">
          <p className="font-semibold text-sm text-muted-foreground mb-2">Filter Clients</p>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-muted-foreground" />
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on-track">On Track</SelectItem>
                <SelectItem value="needs-feedback">Needs Feedback</SelectItem>
                <SelectItem value="off-track">Off Track</SelectItem>
                <SelectItem value="missing-program">Missing Program</SelectItem>
                <SelectItem value="soon-to-expire">Soon to Expire</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex-1 w-full md:w-auto">
          <p className="font-semibold text-sm text-muted-foreground mb-2">Sort By</p>
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Last Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-active">Last Active</SelectItem>
              <SelectItem value="signup-date">Sign-up Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientFilters;
