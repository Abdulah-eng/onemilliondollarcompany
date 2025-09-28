'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/coach/income/StatCard';
import ClientTable from '@/components/coach/income/ClientTable';
import TransactionHistory from '@/components/coach/income/TransactionHistory';
import WithdrawalModal from '@/components/coach/income/WithdrawalModal';
import WithdrawFAB from '@/components/coach/income/WithdrawFAB'; // Import the new FAB
import { mockIncomeStats, mockClientEarnings, mockTransactions, IncomeStats, Transaction } from '@/mockdata/income/mockIncome';
import { DollarSign, Clock, ArrowUp, Wallet, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const IncomePage: React.FC = () => {
  const [stats, setStats] = useState<IncomeStats>(mockIncomeStats);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

  const handleWithdraw = useCallback((amount: number) => {
    if (amount > 0 && amount <= stats.currentBalance) {
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

      alert(`Withdrawal request for $${amount.toFixed(2)} submitted successfully! Processing may take 1-3 days.`);
    }
  }, [stats.currentBalance]);

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
      <div className="grid gap-4 **grid-cols-2** lg:grid-cols-4">
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
        </div>

        {/* Client Earnings Table (Mobile: Full width, Desktop: 3/5 width) */}
        <div className="lg:col-span-3">
          <ClientTable earnings={mockClientEarnings} />
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
