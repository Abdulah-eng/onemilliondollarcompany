import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { MessageWithSender } from '@/hooks/useMessages';
import { useOfferActions } from '@/hooks/useOfferActions';
import { toast } from 'sonner';
import { DollarSign, Clock, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfferMessageProps {
  message: MessageWithSender;
  isOwn: boolean;
  userRole?: string;
}

export const OfferMessage: React.FC<OfferMessageProps> = ({
  message,
  isOwn,
  userRole
}) => {
  const { acceptOffer, rejectOffer, loading } = useOfferActions();

  const offer = message.coach_offer;
  const isExpired = offer && new Date(offer.expires_at) < new Date();

  const handleAcceptOffer = async () => {
    if (!offer) return;

    try {
      await acceptOffer(offer.id);
      toast.success("You are now working with this coach!");
    } catch (error) {
      toast.error("Failed to accept offer. Please try again.");
    }
  };

  const handleRejectOffer = async () => {
    if (!offer) return;

    try {
      await rejectOffer(offer.id);
      toast.success("The offer has been declined.");
    } catch (error) {
      toast.error("Failed to reject offer. Please try again.");
    }
  };

  const getStatusBadge = () => {
    if (!offer) return null;

    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const },
      accepted: { label: 'Accepted', variant: 'default' as const },
      rejected: { label: 'Rejected', variant: 'destructive' as const },
      expired: { label: 'Expired', variant: 'outline' as const }
    };

    const status = isExpired ? 'expired' : offer.status;
    const config = statusConfig[status];

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const canRespond = !isOwn && userRole === 'customer' && 
                     offer?.status === 'pending' && !isExpired;

  return (
    <div className={cn(
      "flex gap-3 max-w-[80%]",
      isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
    )}>
      {!isOwn && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={message.sender.avatar_url} />
          <AvatarFallback>
            {message.sender.full_name?.split(' ').map(n => n[0]).join('') || '?'}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col",
        isOwn ? "items-end" : "items-start"
      )}>
        {!isOwn && (
          <span className="text-xs text-muted-foreground mb-1">
            {message.sender.full_name}
          </span>
        )}
        
        <Card className={cn(
          "w-full max-w-sm",
          isOwn ? "bg-primary/5" : "bg-muted/50"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Coaching Offer</span>
              </div>
              {getStatusBadge()}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{message.content}</p>
            
            {offer && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">${offer.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{offer.duration_months} months</span>
                </div>
                
                {offer.status === 'pending' && !isExpired && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Expires {formatDistanceToNow(new Date(offer.expires_at), { addSuffix: true })}
                  </div>
                )}
                
                {canRespond && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={handleAcceptOffer}
                      disabled={loading}
                      className="flex-1"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRejectOffer}
                      disabled={loading}
                      className="flex-1"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <span className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
};