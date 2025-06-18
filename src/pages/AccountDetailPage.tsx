import React, { useState }_ from 'react';
import { Link } from 'react-router-dom';

// Custom Layout Components
import Header from '@/components/layout/Header';
import CollapsibleSidebar from '@/components/layout/CollapsibleSidebar';
import Footer from '@/components/layout/Footer';

// Custom Page-Specific Components
import BalanceHistoryChart from '@/components/BalanceHistoryChart';
import RecentTransactionItemFixed from '@/components/RecentTransactionItem'; // Export name is RecentTransactionItemFixed

// Shadcn/UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';

// Lucide Icons
import { CalendarIcon, Filter, ArrowUpDown } from 'lucide-react';

// Mock Data Types
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number; // positive for credit, negative for debit
  type: 'Credit' | 'Debit';
  category: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

interface RecentTransactionItemData {
  id: string | number;
  date: string;
  description: string;
  amount: number; // Positive number
  type: 'debit' | 'credit';
  category?: string;
}

// Placeholder Data
const accountDetails = {
  name: "Primary Checking Account",
  number: "•••• 1234",
  type: "Checking",
  balance: 10250.75,
  currency: "$",
  openedDate: "2020-01-15"
};

const mockTransactions: Transaction[] = [
  { id: 'tx1', date: '2023-11-05', description: 'Online Shopping - Tech Gadget', amount: -129.99, type: 'Debit', category: 'Electronics', status: 'Completed' },
  { id: 'tx2', date: '2023-11-03', description: 'Salary Deposit - November', amount: 3200.00, type: 'Credit', category: 'Income', status: 'Completed' },
  { id: 'tx3', date: '2023-11-01', description: 'Utility Bill - Electricity', amount: -85.50, type: 'Debit', category: 'Utilities', status: 'Completed' },
  { id: 'tx4', date: '2023-10-28', description: 'Restaurant Dinner with Friends', amount: -63.20, type: 'Debit', category: 'Food & Dining', status: 'Completed' },
  { id: 'tx5', date: '2023-10-25', description: 'Refund for Returned Item', amount: 45.00, type: 'Credit', category: 'Refunds', status: 'Completed' },
  { id: 'tx6', date: '2023-10-22', description: 'Scheduled Transfer to Savings', amount: -200.00, type: 'Debit', category: 'Transfers', status: 'Pending' },
];

const mockRecentItemsData: RecentTransactionItemData[] = [
  { id: 'rti1', date: 'Nov 05, 2023', description: 'Online Shopping - Tech Gadget', amount: 129.99, type: 'debit', category: 'Electronics' },
  { id: 'rti2', date: 'Nov 03, 2023', description: 'Salary Deposit - November', amount: 3200.00, type: 'credit', category: 'Income' },
  { id: 'rti3', date: 'Nov 01, 2023', description: 'Utility Bill - Electricity', amount: 85.50, type: 'debit', category: 'Utilities' },
];

const AccountDetailPage = () => {
  console.log('AccountDetailPage loaded');
  const [filterDate, setFilterDate] = useState<Date | undefined>();

  return (
    <div className="flex min-h-screen w-full bg-muted/40 dark:bg-slate-900">
      <CollapsibleSidebar />
      {/* Main content area needs padding to not be overlapped by the fixed CollapsibleSidebar */}
      {/* pl-[5rem] for collapsed (w-20), md:pl-[16rem] for expanded (w-64) */}
      <div className="flex flex-col flex-1 pl-[5rem] md:pl-[16rem] transition-all duration-300 ease-in-out">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">Dashboard</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/accounts">Accounts</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{accountDetails.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">{accountDetails.name}</CardTitle>
              <CardDescription>Account Number: {accountDetails.number} | Type: {accountDetails.type}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold text-primary">
                {accountDetails.currency}
                {accountDetails.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-muted-foreground">Date Opened: {accountDetails.openedDate}</p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
              <Button asChild><Link to="/move-money">Make a Transfer</Link></Button>
              <Button variant="outline">Download Statement</Button>
              <Button variant="outline" asChild><Link to="/settings">Account Settings</Link></Button>
            </CardFooter>
          </Card>

          <BalanceHistoryChart accountName={accountDetails.name} initialData={[]} /> {/* Pass mock data if available in BalanceHistoryChart's format */}

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Review and filter your transactions for this account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap gap-x-4 gap-y-3 mb-6 items-end">
                <div className="lg:flex-grow min-w-[150px]">
                  <label htmlFor="search-description" className="text-xs font-medium text-muted-foreground">Description</label>
                  <Input id="search-description" placeholder="Search..." className="mt-1 text-sm" />
                </div>
                <div className="min-w-[120px]">
                  <label htmlFor="type-filter" className="text-xs font-medium text-muted-foreground">Type</label>
                  <Select>
                    <SelectTrigger id="type-filter" className="mt-1 text-sm">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="debit">Debit</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-[180px]">
                    <label htmlFor="date-picker" className="text-xs font-medium text-muted-foreground">Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button id="date-picker" variant="outline" className="w-full justify-start text-left font-normal mt-1 text-sm">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {filterDate ? filterDate.toLocaleDateString() : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={filterDate}
                                onSelect={setFilterDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <Button className="self-end text-sm">
                  <Filter className="mr-2 h-4 w-4" /> Apply Filters
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Date <Button variant="ghost" size="icon" className="ml-1 h-6 w-6"><ArrowUpDown className="h-3 w-3" /></Button></TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Type</TableHead>
                      <TableHead className="w-[120px]">Category</TableHead>
                      <TableHead className="text-right w-[150px]">Amount <Button variant="ghost" size="icon" className="ml-1 h-6 w-6"><ArrowUpDown className="h-3 w-3" /></Button></TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.length > 0 ? mockTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="text-sm">{tx.date}</TableCell>
                        <TableCell className="font-medium text-sm">{tx.description}</TableCell>
                        <TableCell className="text-sm">{tx.type}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-xs">{tx.category}</Badge></TableCell>
                        <TableCell className={`text-right font-semibold text-sm ${tx.amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                          {tx.amount < 0 ? '-' : '+'}
                          {accountDetails.currency}
                          {Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={tx.status === 'Completed' ? 'default' : tx.status === 'Pending' ? 'outline' : 'destructive'}
                            className="text-xs capitalize"
                          >
                            {tx.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No transactions found for the selected criteria.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {/* Consider adding Pagination component here if many transactions */}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Quick View: Latest Activity</CardTitle>
                <CardDescription>A snapshot of your most recent transactions.</CardDescription>
            </CardHeader>
            <CardContent>
                {mockRecentItemsData.length > 0 ? (
                    <ul className="divide-y divide-border dark:divide-slate-700">
                        {mockRecentItemsData.map(item => (
                            <RecentTransactionItemFixed // Using the actual exported name
                                key={item.id}
                                id={item.id}
                                date={item.date}
                                description={item.description}
                                amount={item.amount}
                                type={item.type}
                                category={item.category}
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">No recent activity to display.</p>
                )}
            </CardContent>
          </Card>

        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AccountDetailPage;