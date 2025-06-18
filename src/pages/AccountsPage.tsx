import React from 'react';
import Header from '@/components/layout/Header';
import CollapsibleSidebar from '@/components/layout/CollapsibleSidebar';
import Footer from '@/components/layout/Footer';
import AccountSummaryCard from '@/components/AccountSummaryCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle, CreditCard as CreditCardIcon } from 'lucide-react'; // Added CreditCardIcon for card items

// Mock data for AccountSummaryCard
const mockAccounts = [
  {
    accountId: 'acc_chk_001',
    accountName: 'Primary Checking',
    accountType: 'Checking',
    balance: 5250.75,
    accountNumber: '**** **** **** 1234',
    currencySymbol: '$',
  },
  {
    accountId: 'acc_sav_002',
    accountName: 'High-Yield Savings',
    accountType: 'Savings',
    balance: 12780.22,
    accountNumber: '**** **** **** 5678',
    currencySymbol: '$',
  },
  {
    accountId: 'acc_cc_003',
    accountName: 'Platinum Rewards Card',
    accountType: 'Credit Card',
    balance: -750.50, // Negative for credit card balance owed
    accountNumber: '**** **** **** 9012',
    currencySymbol: '$',
  },
  {
    accountId: 'acc_loan_004',
    accountName: 'Personal Loan',
    accountType: 'Loan',
    balance: -8500.00, // Negative for loan balance owed
    accountNumber: '**** **** **** 3456',
    currencySymbol: '$',
  },
];

// Mock data for Cards Tab
interface MockCard {
  id: string;
  cardName: string;
  last4: string;
  type: string; // e.g., "Visa Debit", "Mastercard Credit"
  expiry: string; // e.g., "12/25"
  status?: 'Active' | 'Locked' | 'Expired';
}

const mockCardsData: MockCard[] = [
  { id: 'card_001', cardName: 'Visa Gold Debit', last4: '1111', type: 'Visa Debit', expiry: '12/25', status: 'Active' },
  { id: 'card_002', cardName: 'Mastercard World Elite', last4: '2222', type: 'Mastercard Credit', expiry: '08/26', status: 'Active' },
  { id: 'card_003', cardName: 'Amex Platinum (Virtual)', last4: '3333', type: 'Amex Virtual', expiry: '01/24', status: 'Expired' },
];

const AccountsPage = () => {
  console.log('AccountsPage loaded');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      <div className="flex flex-1 pt-16"> {/* pt-16 to offset sticky header height */}
        <CollapsibleSidebar />
        {/* Assuming CollapsibleSidebar is initially w-64. Adjust ml if its initial state changes. */}
        <main className="flex-1 ml-0 md:ml-64 p-4 sm:p-6 lg:p-8 transition-all duration-300 ease-in-out">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Your Accounts
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Overview of your financial accounts and cards.
            </p>
          </div>

          <Tabs defaultValue="accounts" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:w-auto md:max-w-md mb-6 bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="accounts" className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-slate-900">My Accounts</TabsTrigger>
              <TabsTrigger value="cards" className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-slate-900">My Cards</TabsTrigger>
            </TabsList>

            <TabsContent value="accounts">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Account Balances</h2>
                <Button variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Account
                </Button>
              </div>
              {mockAccounts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {mockAccounts.map(account => (
                    <AccountSummaryCard
                      key={account.accountId}
                      accountId={account.accountId}
                      accountName={account.accountName}
                      accountType={account.accountType}
                      balance={account.balance}
                      accountNumber={account.accountNumber}
                      currencySymbol={account.currencySymbol}
                    />
                  ))}
                </div>
              ) : (
                <Card className="flex flex-col items-center justify-center p-10 text-center">
                    <CardTitle className="text-xl mb-2">No Accounts Found</CardTitle>
                    <CardDescription className="mb-4">It seems you haven't linked any accounts yet.</CardDescription>
                    <Button variant="default">
                        <PlusCircle className="mr-2 h-4 w-4" /> Link an Account
                    </Button>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="cards">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Linked Cards</h2>
                <Button variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10">
                  <PlusCircle className="mr-2 h-4 w-4" /> Link New Card
                </Button>
              </div>
              <Card className="shadow-sm dark:bg-slate-800/50">
                <CardHeader>
                  <CardTitle>Manage Your Payment Cards</CardTitle>
                  <CardDescription>View, manage, or add new physical and virtual cards linked to your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockCardsData.length > 0 ? (
                    mockCardsData.map(card => (
                      <div key={card.id} className="p-4 border dark:border-slate-700 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-3">
                            <CreditCardIcon className="h-8 w-8 text-primary flex-shrink-0" />
                            <div>
                                <p className="font-medium text-slate-800 dark:text-slate-100">{card.cardName} (•••• {card.last4})</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {card.type} - Expires {card.expiry} - 
                                    <span className={`ml-1 font-semibold ${card.status === 'Active' ? 'text-green-600' : card.status === 'Expired' ? 'text-red-600' : 'text-yellow-600'}`}>
                                        {card.status}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary self-start sm:self-center">Manage Card</Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                        <CreditCardIcon className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-600 dark:text-slate-400">You currently have no cards linked.</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">Link a new card to see it here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AccountsPage;