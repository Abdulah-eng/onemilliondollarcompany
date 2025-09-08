import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { customerProfile } from '@/mockdata/profile/profileData';

const PaymentHistoryTable = () => {
  const { payment } = customerProfile;
  return (
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
  );
};

export default PaymentHistoryTable;
