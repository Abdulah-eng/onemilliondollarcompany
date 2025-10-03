'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/coach/income/StatCard';
import ClientTable from '@/components/coach/income/ClientTable';
import TransactionHistory from '@/components/coach/income/TransactionHistory';
import WithdrawalModal from '@/components/coach/income/WithdrawalModal';
import { useCoachPayouts } from '@/hooks/useCoachPayouts';
import WithdrawFAB from '@/components/coach/income/WithdrawFAB'; // Import the new FAB
import { useCoachClientEarnings } from '@/hooks/useCoachClientEarnings';
import { IncomeStats, Transaction } from '@/mockdata/income/mockIncome';
import { DollarSign, Clock, ArrowUp, Wallet, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const IncomePage: React.FC = () => {
  const [stats, setStats] = useState<IncomeStats>({ currentBalance: 0, totalEarned: 0, lastMonthIncome: 0, pendingPayout: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const { payouts, refetch, requestWithdrawal } = useCoachPayouts();
  const { rows: clientEarnings } = useCoachClientEarnings();

  // Compute balances from payouts (net amounts) as a basic polish
  const computed = useMemo(() => {
    const totalNet = payouts.reduce((acc, p) => acc + (p.net_amount_cents || 0), 0) / 100;
    const pending = payouts.filter(p => p.status === 'pending').reduce((acc, p) => acc + (p.net_amount_cents || 0), 0) / 100;
    return { totalNet, pending };
  }, [payouts]);

  useEffect(() => {
    setStats(prev => ({
      ...prev,
      totalEarned: computed.totalNet,
      pendingPayout: computed.pending,
    }));
  }, [computed.totalNet, computed.pending]);

  const handleWithdraw = useCallback(async (amount: number) => {
    if (amount > 0 && amount <= stats.currentBalance) {
      await requestWithdrawal(Math.round(amount * 100));
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'Withdrawal',
        clientName: null,
        amount: -amount,
        date: new Date().toISOString(),
        status: 'Pending',
      };
      setStats(prev => ({
        ...prev,
        currentBalance: prev.currentBalance - amount,
        pendingPayout: prev.pendingPayout + amount,
      }));
      setTransactions(prev => [newTransaction, ...prev]);
      refetch();
    }
  }, [stats.currentBalance, requestWithdrawal, refetch]);

  const openWithdrawalModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl space-y-8 relative"> {/* Ensure relative for FAB positioning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold mb-2">Income Dashboard 💰</h1>
        <p className="text-muted-foreground text-lg">Manage your earnings, track client payments, and request payouts.</p>
      </motion.div>

      {/* Stats Section (Mobile: 2 cols, Desktop: 4 cols) */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Current Balance"
          value={stats.currentBalance}
          icon={Wallet}
        />
        <StatCard
          title="Total Earned (All Time)"
          value={stats.totalEarned}
          icon={DollarSign}
        />
        <StatCard
          title="Last Month Income"
          value={stats.lastMonthIncome}
          icon={ArrowUp}
        />
        <StatCard
          title="Pending Payouts"
          value={stats.pendingPayout}
          icon={Clock}
        />
      </div>

      {/* Detailed Sections (Mobile: Stacks, Desktop: Side-by-Side) */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Transaction History (Mobile: Full width, Desktop: 2/5 width) */}
        <div className="lg:col-span-2">
          <TransactionHistory transactions={transactions} />
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Payouts</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              {payouts.map(p => (
                <div key={p.id} className="flex justify-between border rounded-lg p-3">
                  <span>{p.period_start} - {p.period_end}</span>
                  <span>${(p.net_amount_cents/100).toFixed(2)} ({p.status})</span>
                </div>
              ))}
              {payouts.length === 0 && (
                <div className="text-muted-foreground">No payouts yet.</div>
              )}
              <Button variant="outline" size="sm" onClick={() => refetch()}>Refresh</Button>
            </div>
          </div>
        </div>

        {/* Client Earnings Table (Mobile: Full width, Desktop: 3/5 width) */}
        <div className="lg:col-span-3">
          <ClientTable earnings={clientEarnings.map(r => ({
            id: r.customer_id,
            name: r.customer_name || 'Customer',
            totalEarnings: r.total_earned_cents / 100,
            activeContracts: r.active_contracts,
            lastPaymentDate: r.last_payout_at || new Date().toISOString(),
          }))} />
        </div>
      </div>
      
      {/* FAB - Withdrawal Funds */}
      <WithdrawFAB onFabClick={openWithdrawalModal} />

      {/* Withdrawal Modal (Controlled Programmatically) */}
      <WithdrawalModal 
        stats={stats} 
        onWithdraw={handleWithdraw} 
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
    </div>
  );
};

export default IncomePage;
