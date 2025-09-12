import ClientRequests from '@/components/coach/client-overview/ClientRequests';
import ClientList from '@/components/coach/client-overview/ClientList';

const ClientOverviewPage = () => {
  return (
    <div className="w-full">
      <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Client Management 🚀</h1>
          <p className="text-md text-muted-foreground">
            A detailed overview of all your clients, their status, and new requests.
          </p>
        </div>

        <ClientRequests />
      </div>
      
      <div className="w-full max-w-7xl mx-auto px-4 space-y-6">
        <ClientList />
      </div>
    </div>
  );
};

export default ClientOverviewPage;
