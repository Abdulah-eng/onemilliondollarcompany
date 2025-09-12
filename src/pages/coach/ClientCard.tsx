import React from 'react';
import { useParams } from 'react-router-dom';
import ClientHeader from '@/components/coach/clientCard/ClientHeader';
import ClientPersonalInfo from '@/components/coach/clientCard/ClientPersonalInfo';
import ClientKeyMetrics from '@/components/coach/clientCard/ClientKeyMetrics';
import CurrentProgram from '@/components/coach/clientCard/CurrentProgram';
import { mockClientData } from '@/mockdata/clientCard/mockClientData';

const ClientCard = () => {
  const { clientId } = useParams();
  
  // For now, we'll use the mock data regardless of clientId
  // In a real app, you'd fetch the client data based on clientId
  const client = mockClientData;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <ClientHeader client={client} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <ClientPersonalInfo personalInfo={client.personalInfo} />
          <ClientKeyMetrics stats={client.stats} />
          <div className="lg:col-span-2 xl:col-span-1">
            <CurrentProgram />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
