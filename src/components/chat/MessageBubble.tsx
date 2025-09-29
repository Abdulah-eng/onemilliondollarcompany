import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { MessageWithSender } from '@/hooks/useMessages';
import { OfferMessage } from './OfferMessage';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: MessageWithSender;
  isOwn: boolean;
  userRole?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  userRole
}) => {
  const isOffer = message.message_type === 'offer';
  const isSystem = message.message_type === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <Badge variant="secondary" className="text-xs px-3 py-1">
          {message.content}
        </Badge>
      </div>
    );
  }

  if (isOffer) {
    return (
      <OfferMessage
        message={message}
        isOwn={isOwn}
        userRole={userRole}
      />
    );
  }

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
        
        <div className={cn(
          "rounded-lg px-3 py-2 max-w-full break-words",
          isOwn 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground"
        )}>
          <p className="text-sm">{message.content}</p>
        </div>
        
        <span className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
};