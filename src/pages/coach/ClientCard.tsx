// src/pages/coach/ClientCard.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockClientData } from '@/mockdata/clientCard/mockClientData';
import ClientHeader from '@/components/coach/clientCard/ClientHeader';
import ClientProgress from '@/components/coach/clientCard/ClientProgress';
import CurrentProgram from '@/components/coach/clientCard/CurrentProgram';
import ClientPersonalInfo from '@/components/coach/clientCard/ClientPersonalInfo';
import ClientKeyMetrics from '@/components/coach/clientCard/ClientKeyMetrics';

const ClientCard = () => {
  const location = useLocation();
  const client = location.state?.client || mockClientData;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-10">
      <ClientHeader client={client} />
      
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ClientProgress insights={client.insights} />
              {/* This is a placeholder for a detailed insights graph */}
              <div className="bg-muted h-96 rounded-xl flex items-center justify-center text-muted-foreground">
                [Detailed Insights Graph goes here]
              </div>
            </div>
            <div className="lg:col-span-1 space-y-8">
              <ClientKeyMetrics stats={client.stats} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="programs" className="mt-6">
          <CurrentProgram />
        </TabsContent>
        
        <TabsContent value="details" className="mt-6">
          <ClientPersonalInfo personalInfo={client.personalInfo} />
        </TabsContent>

        <TabsContent value="actions" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Client Actions ⚙️</h2>
            <p className="text-muted-foreground">Quickly manage client check-ins, program assignment, and communication.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-card rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold">Respond to Feedback</h3>
                <p className="text-muted-foreground text-sm mt-1">Review and reply to recent client feedback.</p>
                <div className="mt-4">[Feedback Response UI]</div>
              </div>
              <div className="p-6 bg-card rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold">Assign New Program</h3>
                <p className="text-muted-foreground text-sm mt-1">Schedule or assign a new program to this client.</p>
                <div className="mt-4">[Program Assignment UI]</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientCard;
