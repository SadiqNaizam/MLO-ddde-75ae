import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ArrowRightLeft } from 'lucide-react';

interface AccountSummaryCardProps {
  accountId: string; // Unique identifier for the account
  accountName: string; // e.g., "Primary Checking"
  accountType: string; // e.g., "Checking", "Savings", "Credit Card"
  balance: number; // Current account balance
  accountNumber: string; // Full account number, will be masked for display
  currencySymbol?: string; // e.g., "$", "€", defaults to "$"
}

const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({
  accountId,
  accountName,
  accountType,
  balance,
  accountNumber,
  currencySymbol = '$',
}) => {
  console.log(`AccountSummaryCard loaded for account: ${accountName} (ID: ${accountId})`);

  const maskedAccountNumber = accountNumber ? `•••• ${accountNumber.slice(-4)}` : 'N/A';

  const formattedBalance = balance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Card className="w-full max-w-md shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-1">
          <CardTitle className="text-xl font-semibold text-gray-800">{accountName}</CardTitle>
          <Badge variant="outline" className="whitespace-nowrap ml-2 text-sm">
            {accountType}
          </Badge>
        </div>
        <CardDescription className="text-xs text-gray-500">
          Account No: {maskedAccountNumber}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow py-4">
        <p className="text-sm text-gray-600 mb-1">Available Balance</p>
        <p className="text-3xl font-bold text-gray-900 tracking-tight">
          {currencySymbol}
          {formattedBalance}
        </p>
      </CardContent>

      <CardFooter className="border-t pt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
        <Button variant="outline" className="w-full sm:w-auto" asChild>
          <Link to="/account-detail">
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Link>
        </Button>
        <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white" asChild>
          <Link to="/move-money">
            <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccountSummaryCard;