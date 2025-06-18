import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RecentTransactionItemProps {
  id: string | number; // For key prop in lists and potential future interactions
  date: string; // Expecting a pre-formatted date string, e.g., "Oct 26, 2023"
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category?: string;
  categoryIcon?: React.ElementType; // Optional: lucide-react icon component (or any React component) for the category
}

const RecentTransactionItem: React.FC<RecentTransactionItemProps> = ({
  // id, // id is not used directly in rendering but useful for list keys
  date,
  description,
  amount,
  type,
  category,
  categoryIcon: CategoryIcon, // Renaming for clarity when used as a component
}) => {
  console.log(`RecentTransactionItem loaded for: ${description}`);

  const isDebit = type === 'debit';
  // Using U+2212 MINUS SIGN for debits for better typography
  const formattedAmount = `${isDebit ? '−' : '+'} $${amount.toFixed(2)}`;
  const amountColor = isDebit ? 'text-slate-700' : 'text-emerald-600';
  const TypeIndicatorIcon = isDebit ? TrendingDown : TrendingUp;

  return (
    <li className="flex items-center justify-between py-3.5 px-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/75 transition-colors duration-150 ease-in-out">
      {/* Left section: Icon (optional) and Text content */}
      <div className="flex items-center flex-grow min-w-0"> {/* min-w-0 is crucial for truncation in flex children */}
        {CategoryIcon && (
          <div className="mr-3 flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-slate-100">
            <CategoryIcon className="h-5 w-5 text-slate-500" />
          </div>
        )}
        <div className="flex-grow min-w-0"> {/* This div will take remaining space and allow truncation */}
          <p className="text-sm font-medium text-slate-800 truncate" title={description}>
            {description}
          </p>
          <p className="text-xs text-slate-500">
            {date}
            {category && (
              <>
                <span className="mx-1.5" aria-hidden="true">•</span>
                {category}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Right section: Amount and Type Indicator */}
      <div className={`ml-4 flex items-center flex-shrink-0 text-sm font-semibold ${amountColor}`}>
        <span>{formattedAmount}</span>
        <TypeIndicatorIcon className={`ml-1.5 h-4 w-4 ${amountColor_UNUSED_VAR_TypeIndicatorIcon_Color}`} /> 
      </div>
    </li>
  );
};

// Corrected variable name for icon color - should use amountColor or a specific one for icons
// Let's use amountColor for the TypeIndicatorIcon as well.
const RecentTransactionItemFixed: React.FC<RecentTransactionItemProps> = ({
  date,
  description,
  amount,
  type,
  category,
  categoryIcon: CategoryIcon,
}) => {
  console.log(`RecentTransactionItem loaded for: ${description}`);

  const isDebit = type === 'debit';
  const formattedAmount = `${isDebit ? '−' : '+'} $${amount.toFixed(2)}`;
  const amountColor = isDebit ? 'text-slate-700' : 'text-emerald-600'; // Example: slate for debit, emerald for credit
  const TypeIndicatorIcon = isDebit ? TrendingDown : TrendingUp;

  return (
    <li className="flex items-center justify-between py-3.5 px-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/75 transition-colors duration-150 ease-in-out">
      <div className="flex items-center flex-grow min-w-0">
        {CategoryIcon && (
          <div className="mr-3 flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-slate-100">
            <CategoryIcon className="h-5 w-5 text-slate-500" />
          </div>
        )}
        <div className="flex-grow min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate" title={description}>
            {description}
          </p>
          <p className="text-xs text-slate-500">
            {date}
            {category && (
              <>
                <span className="mx-1.5" aria-hidden="true">•</span>
                {category}
              </>
            )}
          </p>
        </div>
      </div>
      <div className={`ml-4 flex items-center flex-shrink-0 text-sm font-semibold ${amountColor}`}>
        <span>{formattedAmount}</span>
        <TypeIndicatorIcon className={`ml-1.5 h-4 w-4 ${amountColor}`} /> {/* Correctly using amountColor */}
      </div>
    </li>
  );
};


export default RecentTransactionItemFixed;