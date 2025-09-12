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
        <TabsList className="grid w-full grid-cols-4 bg-gray-200 dark:bg-gray-800 rounded-xl">
          <TabsTrigger value="insights" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-lg shadow-sm transition-all">Insights</TabsTrigger>
          <TabsTrigger value="programs" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-lg shadow-sm transition-all">Programs</TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-lg shadow-sm transition-all">Details</TabsTrigger>
          <TabsTrigger value="actions" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-lg shadow-sm transition-all">Actions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ClientProgress insights={client.insights} />
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 h-96 rounded-xl shadow-lg flex items-center justify-center text-muted-foreground">
                [Detailed Insights Graph goes here]
              </div>
            </div>
            <div className="lg:col-span-1 space-y-8">
              <ClientKeyMetrics stats={client.stats} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="programs" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <CurrentProgram />
              {/* This is a placeholder for program list/details */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 h-96 rounded-xl shadow-lg flex items-center justify-center text-muted-foreground">
                [Program List & Details]
              </div>
            </div>
            <div className="lg:col-span-1 space-y-8">
              {/* This is a placeholder for a program overview */}
              <Card className="shadow-lg rounded-xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold">Program Overview</h3>
                  <p className="text-sm text-muted-foreground mt-2">View the client's full program details here.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <ClientPersonalInfo personalInfo={client.personalInfo} />
            </div>
            <div className="space-y-8">
              <Card className="shadow-lg rounded-xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold">Goals & Preferences 💪</h3>
                  <div className="mt-4 space-y-4">
                    <p className="font-semibold text-muted-foreground">Goals: <span className="text-foreground font-normal">{client.goals.join(', ')}</span></p>
                    <p className="font-semibold text-muted-foreground">Injuries: <span className="text-foreground font-normal">{client.preferences.injuries.join(', ') || 'None'}</span></p>
                    <p className="font-semibold text-muted-foreground">Allergies: <span className="text-foreground font-normal">{client.preferences.allergies.join(', ') || 'None'}</span></p>
                    <p className="font-semibold text-muted-foreground">Preferred Programs: <span className="text-foreground font-normal">{client.preferences.preferredProgramType.join(', ')}</span></p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Client Actions ⚙️</h2>
            <p className="text-muted-foreground">Quickly manage client check-ins, program assignment, and communication.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 bg-card rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold">Respond to Feedback</h3>
                <p className="text-muted-foreground text-sm mt-1">Review and reply to recent client feedback.</p>
                <div className="mt-4">[Feedback Response UI]</div>
              </Card>
              <Card className="p-6 bg-card rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold">Assign New Program</h3>
                <p className="text-muted-foreground text-sm mt-1">Schedule or assign a new program to this client.</p>
                <div className="mt-4">[Program Assignment UI]</div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientCard;
