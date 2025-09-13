import React from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockClientData } from '@/mockdata/clientCard/mockClientData';
import ClientHeader from '@/components/coach/clientCard/ClientHeader';
import OverviewTab from '@/components/coach/clientCard/tabs/OverviewTab';
import InsightsTab from '@/components/coach/clientCard/tabs/InsightsTab';
import ProgramsTab from '@/components/coach/clientCard/tabs/ProgramsTab';
import DetailsTab from '@/components/coach/clientCard/tabs/DetailsTab';
import CommunicationTab from '@/components/coach/clientCard/tabs/CommunicationTab';
import ClientActionButton from '@/components/coach/clientCard/ClientActionButton';

const ClientCard = () => {
  const location = useLocation();
  const client = location.state?.client || mockClientData;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <ClientHeader client={client} />

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 rounded-2xl bg-muted p-1">
          <TabsTrigger
            value="overview"
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-sm font-medium"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-sm font-medium"
          >
            Insights
          </TabsTrigger>
          <TabsTrigger
            value="programs"
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-sm font-medium"
          >
            Programs
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-sm font-medium"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="communication"
            className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-sm font-medium"
          >
            Communication
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab client={client} />
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <InsightsTab client={client} />
        </TabsContent>

        <TabsContent value="programs" className="mt-6">
          <ProgramsTab client={client} />
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <DetailsTab client={client} />
        </TabsContent>

        <TabsContent value="communication" className="mt-6">
          <CommunicationTab client={client} />
        </TabsContent>
      </Tabs>

      {/* Floating Action Button */}
      <ClientActionButton />
    </div>
  );
};

export default ClientCard;
