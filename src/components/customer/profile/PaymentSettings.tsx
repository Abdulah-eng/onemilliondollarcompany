import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { customerProfile } from '@/mockdata/profile/profileData';

const PaymentSettings = () => {
  const { payment } = customerProfile;
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="shadow-md rounded-2xl p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl font-semibold">Payment Plan</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <div className="text-sm">
            <p><strong>Current Plan:</strong> {payment.currentPlan.name}</p>
            <p><strong>Price:</strong> {payment.currentPlan.price} / {payment.currentPlan.billingCycle}</p>
            <p><strong>Next Billing:</strong> {payment.currentPlan.nextBillingDate}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Update Plan</Button>
            <Button variant="destructive" size="sm">Cancel Subscription</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md rounded-2xl p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl font-semibold">Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <div className="text-sm">
            <p><strong>Card:</strong> {payment.paymentMethod.brand} ending in {payment.paymentMethod.last4}</p>
            <p><strong>Expires:</strong> {payment.paymentMethod.expiry}</p>
          </div>
          <Dialog open={isUpdating} onOpenChange={setIsUpdating}>
            <DialogTrigger asChild>
              <Button size="sm">Update Payment Method</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Payment Method</DialogTitle>
                <DialogDescription>
                  Enter your new payment details below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Card Number" />
                <div className="flex gap-4">
                  <Input placeholder="MM/YY" className="w-1/2" />
                  <Input placeholder="CVC" className="w-1/2" />
                </div>
                <Button className="w-full" onClick={() => setIsUpdating(false)}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="shadow-md rounded-2xl p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl font-semibold">Payment History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payment.history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSettings;
