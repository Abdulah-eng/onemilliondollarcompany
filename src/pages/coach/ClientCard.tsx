import React from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockClientData } from '@/mockdata/clientCard/mockClientData';
import ClientHeader from '@/components/coach/clientCard/ClientHeader';
import ClientProfileTab from '@/components/coach/clientCard/tabs/ClientProfileTab';
import ProgressProgramsTab from '@/components/coach/clientCard/tabs/ProgressProgramsTab';
import CommunicationTab from '@/components/coach/clientCard/tabs/CommunicationTab';
import ClientActionButton from '@/components/coach/clientCard/ClientActionButton';

const ClientCard = () => {
  const location = useLocation();
  const client = location.state?.client || mockClientData;

  return (
    <div className="relative w-full px-4 py-6 space-y-6">
      {/* Header */}
      <ClientHeader client={client} />

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full rounded-2xl bg-muted p-1 flex flex-col sm:flex-row gap-1 sm:gap-0 h-auto sm:h-10">
          <TabsTrigger
            value="profile"
            className="w-full rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-xs sm:text-sm font-medium py-3 sm:py-1.5 px-4 sm:px-3 h-auto"
          >
            <span className="hidden sm:inline">Client Profile</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            className="w-full rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-xs sm:text-sm font-medium py-3 sm:py-1.5 px-4 sm:px-3 h-auto"
          >
            <span className="hidden sm:inline">Progress & Programs</span>
            <span className="sm:hidden">Progress</span>
          </TabsTrigger>
          <TabsTrigger
            value="communication"
            className="w-full rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-xs sm:text-sm font-medium py-3 sm:py-1.5 px-4 sm:px-3 h-auto"
          >
            <span className="hidden sm:inline">Communication</span>
            <span className="sm:hidden">Messages</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ClientProfileTab client={client} />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <ProgressProgramsTab client={client} />
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
