import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ClientRequests from '@/components/coach/client-overview/ClientRequests';
import ClientFilters from '@/components/coach/client-overview/ClientFilters';
import ClientList from '@/components/coach/client-overview/ClientList';
import ClientDetailModal from '@/components/coach/client-detail/ClientDetailModal';
import { useCustomerDetail } from '@/hooks/useCustomerDetail';

const ClientOverviewPage = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { customer: selectedClient, loading: customerLoading } = useCustomerDetail(selectedClientId);
  
  console.log('ClientOverviewPage: selectedClientId:', selectedClientId);
  console.log('ClientOverviewPage: selectedClient:', selectedClient);
  console.log('ClientOverviewPage: customerLoading:', customerLoading);

  const handleClientRequestClick = (clientId: string) => {
    console.log('ClientOverviewPage: Client clicked, setting selectedClientId:', clientId);
    setSelectedClientId(clientId);
  };

  const handleCloseModal = () => {
    setSelectedClientId(null);
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Client Management 🚀</h1>
          <p className="text-md text-muted-foreground">
            A detailed overview of all your clients, their status, and new requests.
          </p>
        </div>

        <ClientRequests onClientClick={handleClientRequestClick} />

        <div className="space-y-6">
          <ClientFilters />
          <ClientList />
        </div>
      </div>

      <ClientDetailModal
        client={selectedClient}
        isMobile={isMobile}
        onClose={handleCloseModal}
        loading={customerLoading}
      />
    </>
  );
};

export default ClientOverviewPage;
