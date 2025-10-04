import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePaymentHistory } from '@/hooks/usePaymentHistory';

const PaymentHistoryTable = () => {
  const { paymentHistory, loading } = usePaymentHistory();
  return (
    <Card className="shadow-md rounded-2xl p-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-xl font-semibold">Payment History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="text-center py-4">Loading payment history...</div>
        ) : paymentHistory.length > 0 ? (
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
              {paymentHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>
                    <span className={`capitalize ${
                      item.status === 'succeeded' ? 'text-green-600' : 
                      item.status === 'failed' ? 'text-red-600' : 
                      item.status === 'pending' ? 'text-yellow-600' : 
                      'text-gray-600'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4 text-muted-foreground">No payment history available</div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistoryTable;
