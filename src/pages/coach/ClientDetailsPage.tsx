// src/pages/coach/ClientDetailsPage.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useClientDetail } from '@/hooks/useClientDetail';
import ClientHeader from '@/components/coach/client-details/ClientHeader';
import ProgramsTab from '@/components/coach/client-details/tabs/ProgramsTab';
import CommunicationTab from '@/components/coach/client-details/tabs/CommunicationTab';
import DetailsTab from '@/components/coach/client-details/tabs/DetailsTab';

const ClientDetailsPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { data: client, isLoading, error, refetch } = useClientDetail(clientId!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-muted-foreground">Loading client details...</span>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Client Not Found</h3>
          <p className="text-muted-foreground">
            The client you're looking for doesn't exist or you don't have access.
          </p>
          <div className="flex space-x-2">
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
            <Button asChild>
              <Link to="/coach/clients">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Clients
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-10">
      <ClientHeader client={client} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 bg-gray-200 dark:bg-gray-800 rounded-xl">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-lg shadow-sm transition-all">Overview</TabsTrigger>
          <TabsTrigger value="programs" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-lg shadow-sm transition-all">Programs</TabsTrigger>
          <TabsTrigger value="communication" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-lg shadow-sm transition-all">Communication</TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-lg shadow-sm transition-all hidden md:flex">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {/* Overview content, similar to the old CustomerTab */}
        </TabsContent>

        <TabsContent value="programs" className="mt-6">
          <ProgramsTab client={client} />
        </TabsContent>

        <TabsContent value="communication" className="mt-6">
          <CommunicationTab client={client} />
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <DetailsTab client={client} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetailsPage;
