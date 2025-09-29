import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, DollarSign } from 'lucide-react';

interface OfferComposerProps {
  onSend: (price: number, duration: number, message: string) => void;
  onCancel: () => void;
  sending?: boolean;
}

export const OfferComposer: React.FC<OfferComposerProps> = ({
  onSend,
  onCancel,
  sending = false
}) => {
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceNum = parseFloat(price);
    const durationNum = parseInt(duration);
    
    if (priceNum > 0 && durationNum > 0 && message.trim()) {
      onSend(priceNum, durationNum, message.trim());
    }
  };

  const isValid = price && duration && message.trim() && 
                  parseFloat(price) > 0 && parseInt(duration) > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Send Coaching Offer
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={sending}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                disabled={sending}
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (months)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="3"
                disabled={sending}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your coaching offer..."
              rows={3}
              disabled={sending}
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || sending}
            >
              {sending ? "Sending..." : "Send Offer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};