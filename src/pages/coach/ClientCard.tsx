// src/pages/coach/ClientCard.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { mockClientData } from '@/mockdata/clientCard/mockClientData';

import ClientHeader from '@/components/coach/clientCard/ClientHeader';
import ClientProgress from '@/components/coach/clientCard/ClientProgress';
import CurrentProgram from '@/components/coach/clientCard/CurrentProgram';
import ClientPersonalInfo from '@/components/coach/clientCard/ClientPersonalInfo';
import ClientKeyMetrics from '@/components/coach/clientCard/ClientKeyMetrics';

const ClientCard = () => {
  const location = useLocation();
  // Retrieves client data from the Link's state, falls back to mock data
  const client = location.state?.client || mockClientData;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-10">
      <ClientHeader client={client} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <ClientProgress insights={client.insights} />
          <CurrentProgram />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-8">
          <ClientPersonalInfo personalInfo={client.personalInfo} />
          <ClientKeyMetrics stats={client.stats} />
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
