import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ClientRequests from '@/components/coach/client-overview/ClientRequests';
import ClientFilters from '@/components/coach/client-overview/ClientFilters';
import ClientList from '@/components/coach/client-overview/ClientList';
import ClientDetailModal from '@/components/coach/client-detail/ClientDetailModal';
import { useCustomerDetail } from '@/hooks/useCustomerDetail';
import { useTranslation } from 'react-i18next';

const ClientOverviewPage = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isMobile = useIsMobile();
  const { customer: selectedClient, loading: customerLoading } = useCustomerDetail(selectedClientId);
  const { t } = useTranslation();
  
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

  const handleRequestAccepted = () => {
    // Trigger refresh of client list when a request is accepted
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{t('clients.management')} 🚀</h1>
          <p className="text-md text-muted-foreground">
            {t('clients.description')}
          </p>
        </div>

        <ClientRequests 
          onClientClick={handleClientRequestClick} 
          onRequestAccepted={handleRequestAccepted}
        />

        <div className="space-y-6">
          <ClientFilters onFilterChange={() => {}} />
          <ClientList refreshTrigger={refreshTrigger} />
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
