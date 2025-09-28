// src/components/coach/client-overview/ClientRequests.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCoachRequests } from '@/hooks/useCoachRequests';

interface ClientRequestsProps {
  onClientClick: (clientId: string) => void;
}

const ClientRequests = ({ onClientClick }: ClientRequestsProps) => {
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());
  const { requests, loading, acceptRequest, rejectRequest } = useCoachRequests();

  const handleRequestAction = async (requestId: string, action: 'accepted' | 'rejected') => {
    setProcessingRequests(prev => new Set([...prev, requestId]));

    try {
      let success = false;
      if (action === 'accepted') {
        success = await acceptRequest(requestId);
      } else {
        success = await rejectRequest(requestId);
      }

      if (!success) {
        // Handle error - could show toast notification
        console.error('Failed to process request');
      }
    } catch (error) {
      console.error('Error handling request:', error);
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (!requests.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Incoming Requests 👋</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div onClick={() => onClientClick(request.customer_id)} className="block">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl cursor-pointer">
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle className="text-md font-semibold text-primary">
                     New Request
                   </CardTitle>
                   <ArrowRight className="h-4 w-4 text-muted-foreground" />
                 </CardHeader>
                <CardContent className="space-y-3">
                   <div className="flex items-center gap-3">
                     <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                       <img 
                         className="aspect-square h-full w-full" 
                         src={request.customer?.avatar_url || `https://i.pravatar.cc/150?u=${request.customer_id}`} 
                         alt={request.customer?.full_name || 'Customer'} 
                       />
                     </span>
                     <div className="flex flex-col">
                       <p className="text-lg font-bold">{request.customer?.full_name || 'New Customer'}</p>
                       <p className="text-sm text-muted-foreground">{request.customer?.email || 'No email provided'}</p>
                       <p className="text-xs text-muted-foreground">{request.customer?.plan || 'Free Plan'}</p>
                     </div>
                   </div>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-green-600 hover:text-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestAction(request.id, 'accepted');
                      }}
                      disabled={processingRequests.has(request.id)}
                    >
                      {processingRequests.has(request.id) ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Accept
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-red-600 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestAction(request.id, 'rejected');
                      }}
                      disabled={processingRequests.has(request.id)}
                    >
                      {processingRequests.has(request.id) ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClientRequests;