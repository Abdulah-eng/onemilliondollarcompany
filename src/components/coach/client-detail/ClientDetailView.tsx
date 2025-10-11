// src/components/coach/client-detail/ClientDetailView.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Weight, Heart, Ruler, Calendar, MapPin, Target,
  Dumbbell, Utensils, XCircle, CheckCircle, Loader2,
  DollarSign, Clock, AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useClientStatus } from '@/hooks/useClientStatus';
import ClientProgramsDisplay from './ClientProgramsDisplay';

const ClientDetailView = ({ client, onClose, loading = false }) => {
  const { clientStatus, loading: statusLoading } = useClientStatus(client?.id);
  
  if (loading || statusLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading customer details...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6">
        <p className="text-muted-foreground">No customer data available</p>
      </div>
    );
  }

  const handleAccept = () => {
    // TODO: Implement logic to accept the client request
    // This should update the database (e.g., set request status to 'accepted')
    // and trigger a welcome PDF and 3-day countdown for program assignment. [cite: 195, 198]
    console.log(`Accepted client: ${client.name}`);
    onClose();
  };

  const handleDecline = () => {
    // TODO: Implement logic to decline the client request
    // This might set the request status to 'declined' and notify the user.
    console.log(`Declined client: ${client.name}`);
    onClose();
  };

  const getStatusBadge = () => {
    if (!clientStatus) return null;

    const statusConfig = {
      waiting_offer: { 
        label: 'Waiting Offer', 
        variant: 'secondary' as const, 
        icon: Clock,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      has_offer: { 
        label: 'Offer Sent', 
        variant: 'default' as const, 
        icon: DollarSign,
        className: 'bg-blue-100 text-blue-800 border-blue-200'
      },
      active: { 
        label: 'Active', 
        variant: 'default' as const, 
        icon: CheckCircle,
        className: 'bg-green-100 text-green-800 border-green-200'
      },
      inactive: { 
        label: 'Inactive', 
        variant: 'destructive' as const, 
        icon: AlertCircle,
        className: 'bg-red-100 text-red-800 border-red-200'
      }
    };

    const config = statusConfig[clientStatus.status];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium", config.className)}>
        <Icon className="w-4 h-4" />
        {config.label}
      </div>
    );
  };

  const showTabs = clientStatus && (clientStatus.status === 'active' || clientStatus.status === 'has_offer');

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <span className="relative flex h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-primary shadow-lg">
          <img className="aspect-square h-full w-full" src={client.profilePicture} alt={client.name} />
        </span>
        <h1 className="text-3xl font-bold">{client.name}</h1>
        <p className="text-sm font-semibold text-muted-foreground">{client.plan} Plan</p>
        {getStatusBadge()}
      </div>

      {clientStatus?.status === 'waiting_offer' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg rounded-xl border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Clock size={20} className="text-yellow-600" />
                Waiting for Offer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700">
                This client is waiting for you to send them a coaching offer. 
                Click "Send Offer" to create a personalized coaching package.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {clientStatus?.has_pending_offer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg rounded-xl border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <DollarSign size={20} className="text-blue-600" />
                Pending Offer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-blue-700">
                  You have sent an offer to this client:
                </p>
                <div className="bg-white p-3 rounded border">
                  <div className="flex justify-between">
                    <span className="font-medium">Price:</span>
                    <span className="font-bold">${clientStatus.latest_offer_price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Duration:</span>
                    <span className="font-bold">{clientStatus.latest_offer_duration} weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={cn(
                      "font-bold",
                      clientStatus.latest_offer_status === 'pending' ? 'text-blue-600' : 
                      clientStatus.latest_offer_status === 'accepted' ? 'text-green-600' :
                      clientStatus.latest_offer_status === 'rejected' ? 'text-red-600' : 'text-gray-600'
                    )}>
                      {clientStatus.latest_offer_status || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {showTabs ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target size={20} className="text-primary" />
                    Client Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {client.goals.map((goal, index) => (
                      <span key={index} className="px-4 py-2 text-sm font-medium rounded-full bg-accent text-accent-foreground">
                        {goal}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="shadow-lg rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell size={20} className="text-primary" />
                    Personal Info & Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <StatItem icon={Calendar} label="Age" value={client.personalInfo.age} />
                    <StatItem icon={Ruler} label="Height" value={client.personalInfo.height} />
                    <StatItem icon={Weight} label="Weight" value={client.personalInfo.weight} />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-muted-foreground">Injuries: <span className="text-foreground">{client.preferences.injuries.join(', ') || 'None'}</span></p>
                    <p className="font-semibold text-muted-foreground">Allergies: <span className="text-foreground">{client.preferences.allergies.join(', ') || 'None'}</span></p>
                    <p className="font-semibold text-muted-foreground">Dislikes: <span className="text-foreground">{client.preferences.dislikes.join(', ') || 'None'}</span></p>
                    <p className="font-semibold text-muted-foreground">Preferred Programs: <span className="text-foreground">{client.preferences.preferredProgramType.join(', ')}</span></p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="progress">
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Progress data will be shown here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="programs">
            <ClientProgramsDisplay 
              programs={client.programs || []} 
              clientId={client.id} 
            />
          </TabsContent>
        </Tabs>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} className="text-primary" />
                Client Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {client.goals.map((goal, index) => (
                  <span key={index} className="px-4 py-2 text-sm font-medium rounded-full bg-accent text-accent-foreground">
                    {goal}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {clientStatus?.status === 'waiting_offer' && (
        <div className="flex gap-4 mt-8 pt-4 border-t border-border">
          <Button onClick={handleAccept} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-base">
            <DollarSign className="h-5 w-5 mr-2" /> Send Offer
          </Button>
          <Button onClick={handleDecline} variant="outline" className="w-full text-red-600 border-red-600 font-bold text-base hover:bg-red-50">
            <XCircle className="h-5 w-5 mr-2" /> Decline
          </Button>
        </div>
      )}
    </div>
  );
};

// Reusable component for displaying a single stat item
const StatItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2">
    <div className="flex-shrink-0">
      <Icon size={20} className="text-muted-foreground" />
    </div>
    <div className="flex flex-col">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  </div>
);

export default ClientDetailView;
