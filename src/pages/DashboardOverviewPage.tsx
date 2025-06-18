import React from 'react';
import { Link } from 'react-router-dom';

// Custom Layout Components
import Header from '@/components/layout/Header';
import CollapsibleSidebar from '@/components/layout/CollapsibleSidebar';
import Footer from '@/components/layout/Footer';

// Custom Dashboard Components
import AccountSummaryCard from '@/components/AccountSummaryCard';
import RecentTransactionItemFixed as RecentTransactionItem from '@/components/RecentTransactionItem'; // Aliased from RecentTransactionItemFixed
import SpendingAnalysisChart from '@/components/SpendingAnalysisChart';
import BalanceHistoryChart from '@/components/BalanceHistoryChart';

// Shadcn/ui Components
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Lucide Icons
import { ArrowRightLeft, ReceiptText, Send, ShoppingBag, Gift, Banknote } from 'lucide-react';

// Sample data for the dashboard
const accountSummariesData = [
  {
    accountId: 'acc_chk_001',
    accountName: 'Primary Checking',
    accountType: 'Checking',
    balance: 12530.75,
    accountNumber: '**** **** **** 1234',
    currencySymbol: '$',
  },
  {
    accountId: 'acc_sav_002',
    accountName: 'High-Yield Savings',
    accountType: 'Savings',
    balance: 45800.20,
    accountNumber: '**** **** **** 5678',
    currencySymbol: '$',
  },
  {
    accountId: 'acc_cc_003',
    accountName: 'Platinum Rewards Card',
    accountType: 'Credit Card',
    balance: -750.90, // Negative for credit card balance due
    accountNumber: '**** **** **** 9012',
    currencySymbol: '$',
  },
];

const recentTransactionsData = [
  {
    id: 'tx_001',
    date: 'Oct 26, 2023',
    description: 'Online Shopping - TechStore',
    amount: 199.99,
    type: 'debit' as 'debit' | 'credit',
    category: 'Shopping',
    categoryIcon: ShoppingBag,
  },
  {
    id: 'tx_002',
    date: 'Oct 25, 2023',
    description: 'Salary Deposit - Acme Corp',
    amount: 3500.00,
    type: 'credit' as 'debit' | 'credit',
    category: 'Income',
    categoryIcon: Banknote,
  },
  {
    id: 'tx_003',
    date: 'Oct 24, 2023',
    description: 'Utility Bill - PowerNet',
    amount: 75.50,
    type: 'debit' as 'debit' | 'credit',
    category: 'Utilities',
    categoryIcon: ReceiptText,
  },
  {
    id: 'tx_004',
    date: 'Oct 23, 2023',
    description: 'Birthday Gift Sent',
    amount: 50.00,
    type: 'debit' as 'debit' | 'credit',
    category: 'Gifts',
    categoryIcon: Gift,
  },
];

const spendingAnalysisData = [
  { category: 'Groceries', spent: 450 },
  { category: 'Dining Out', spent: 320 },
  { category: 'Shopping', spent: 600 },
  { category: 'Utilities', spent: 150 },
  { category: 'Transport', spent: 120 },
];

const DashboardOverviewPage = () => {
  console.log('DashboardOverviewPage loaded');

  // Note: The ml-64 on the main content wrapper is based on the CollapsibleSidebar's expanded width (16rem).
  // If the sidebar's collapsed state needs to dynamically adjust this margin,
  // a shared state (e.g., via Context or Zustand) would be required, which is beyond this component's scope.
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-slate-900">
      <Header />
      <div className="flex flex-1">
        <CollapsibleSidebar />
        
        <div className="flex flex-col flex-1 ml-64"> {/* Adjust ml-64 (16rem) if sidebar default width/state changes */}
          <ScrollArea className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40 dark:bg-slate-800/50">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's your financial snapshot.</p>
            </header>

            <section aria-labelledby="accounts-summary-heading" className="mb-8">
              <h2 id="accounts-summary-heading" className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Your Accounts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {accountSummariesData.map(acc => (
                  <AccountSummaryCard key={acc.accountId} {...acc} />
                ))}
              </div>
            </section>

            <section aria-labelledby="activity-and-spending-heading" className="mb-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
              <h2 id="activity-and-spending-heading" className="sr-only">Recent Activity and Spending</h2>
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
                    <Button variant="link" size="sm" asChild className="text-primary hover:underline">
                      <Link to="/accounts">View All</Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    {recentTransactionsData.length > 0 ? (
                      <ul className="divide-y divide-border dark:divide-slate-700">
                        {recentTransactionsData.map(tx => (
                          <RecentTransactionItem key={tx.id} {...tx} />
                        ))}
                      </ul>
                    ) : (
                      <p className="p-4 text-sm text-muted-foreground">No recent transactions to display.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-2">
                <SpendingAnalysisChart data={spendingAnalysisData} title="Spending Overview" className="h-full" />
              </div>
            </section>

            <section aria-labelledby="balance-history-heading" className="mb-8">
              <h2 id="balance-history-heading" className="sr-only">Balance History</h2>
              <BalanceHistoryChart accountName="Primary Account Balance Trend" />
            </section>

            <section aria-labelledby="quick-actions-heading" className="mb-8">
              <h2 id="quick-actions-heading" className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/move-money">
                    <ArrowRightLeft className="mr-2 h-4 w-4" /> Make a Transfer
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/move-money"> {/* Assuming bill pay is part of /move-money based on user journey */}
                    <ReceiptText className="mr-2 h-4 w-4" /> Pay Bills
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/accounts"> {/* Example: View statements might lead to general accounts page */}
                    <Send className="mr-2 h-4 w-4" /> View Statements
                  </Link>
                </Button>
              </div>
            </section>
            
          </ScrollArea>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;