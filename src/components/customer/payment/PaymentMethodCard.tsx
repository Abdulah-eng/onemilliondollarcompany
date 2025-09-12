import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Check } from 'lucide-react';
import { customerProfile } from '@/mockdata/profile/profileData';

interface PaymentMethodCardProps {
  showUpdateButton?: boolean;
  onUpdate?: () => void;
}

const PaymentMethodCard = ({ showUpdateButton = true, onUpdate }: PaymentMethodCardProps) => {
  const { payment } = customerProfile;

  return (
    <Card className="shadow-sm border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="space-y-1">
            <p className="font-medium">{payment.paymentMethod.brand} •••• {payment.paymentMethod.last4}</p>
            <p className="text-sm text-muted-foreground">Expires {payment.paymentMethod.expiry}</p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Check className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
        
        {showUpdateButton && (
          <Button variant="outline" onClick={onUpdate} className="w-full">
            Update Payment Method
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;