import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from 'lucide-react';

interface BalanceDataPoint {
  date: string; // e.g., "Jan '23", "2023-01-15"
  balance: number;
}

interface BalanceHistoryChartProps {
  accountName?: string;
  initialData?: BalanceDataPoint[]; // Full dataset
  defaultPeriod?: string; // e.g., "30d", "90d", "1y"
}

const MOCK_DATA_FULL_YEAR: BalanceDataPoint[] = [
  { date: "Jan '23", balance: 5000 },
  { date: "Feb '23", balance: 5200 },
  { date: "Mar '23", balance: 4800 },
  { date: "Apr '23", balance: 5500 },
  { date: "May '23", balance: 5300 },
  { date: "Jun '23", balance: 5700 },
  { date: "Jul '23", balance: 6000 },
  { date: "Aug '23", balance: 5800 },
  { date: "Sep '23", balance: 6200 },
  { date: "Oct '23", balance: 6500 },
  { date: "Nov '23", balance: 6300 },
  { date: "Dec '23", balance: 6700 },
];

const MOCK_DATA_90_DAYS: BalanceDataPoint[] = [
    { date: "Day 1", balance: 6250 }, { date: "Day 5", balance: 6200 }, { date: "Day 10", balance: 6300 },
    { date: "Day 15", balance: 6150 }, { date: "Day 20", balance: 6400 }, { date: "Day 25", balance: 6350 },
    { date: "Day 30", balance: 6500 }, { date: "Day 35", balance: 6450 }, { date: "Day 40", balance: 6600 },
    { date: "Day 45", balance: 6550 }, { date: "Day 50", balance: 6700 }, { date: "Day 55", balance: 6650 },
    { date: "Day 60", balance: 6800 }, { date: "Day 65", balance: 6750 }, { date: "Day 70", balance: 6900 },
    { date: "Day 75", balance: 6850 }, { date: "Day 80", balance: 7000 }, { date: "Day 85", balance: 6950 },
    { date: "Day 90", balance: 7100 },
];

const MOCK_DATA_30_DAYS: BalanceDataPoint[] = [
    { date: "W1 Mon", balance: 6650 }, { date: "W1 Wed", balance: 6680 }, { date: "W1 Fri", balance: 6700 },
    { date: "W2 Mon", balance: 6720 }, { date: "W2 Wed", balance: 6750 }, { date: "W2 Fri", balance: 6730 },
    { date: "W3 Mon", balance: 6780 }, { date: "W3 Wed", balance: 6800 }, { date: "W3 Fri", balance: 6820 },
    { date: "W4 Mon", balance: 6850 }, { date: "W4 Wed", balance: 6830 }, { date: "W4 Fri", balance: 6870 },
];


const chartConfig = {
  balance: {
    label: "Balance",
    color: "hsl(var(--chart-1))",
    icon: TrendingUp,
  },
};

const BalanceHistoryChart: React.FC<BalanceHistoryChartProps> = ({
  accountName = "Selected Account",
  initialData, // If not provided, will use full year mock data
  defaultPeriod = "1y",
}) => {
  console.log('BalanceHistoryChart loaded for:', accountName);
  const [timePeriod, setTimePeriod] = useState<string>(defaultPeriod);

  const chartData = useMemo(() => {
    if (initialData) { // If real initialData is provided, it's up to the parent to filter or provide specific period data
        // This is a simplification. In a real app, you might fetch new data or filter initialData based on timePeriod
        if (timePeriod === "30d") return initialData.slice(-30); // Assuming daily data
        if (timePeriod === "90d") return initialData.slice(-90); // Assuming daily data
        return initialData; // Default to all initial data if no specific logic for "1y" on custom data
    }
    // Fallback to mock data if initialData is not provided
    if (timePeriod === "30d") return MOCK_DATA_30_DAYS;
    if (timePeriod === "90d") return MOCK_DATA_90_DAYS;
    return MOCK_DATA_FULL_YEAR; // "1y" or default
  }, [timePeriod, initialData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-start justify-between gap-2 space-y-0 pb-2 sm:flex-row sm:items-center sm:space-y-0">
        <div className="space-y-1">
          <CardTitle>{accountName} - Balance History</CardTitle>
          <CardDescription>
            Showing balance for the {
              timePeriod === "30d" ? "last 30 days" :
              timePeriod === "90d" ? "last 90 days" : "last year"
            }
          </CardDescription>
        </div>
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-[160px] shrink-0">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 20, // Increased right margin for labels
                left: 20, // Increased left margin for labels
                bottom: 5,
              }}
              accessibilityLayer
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 6)} // Shorten long date labels if needed
                angle={chartData.length > 10 ? -30 : 0} // Angle ticks if many items
                textAnchor={chartData.length > 10 ? "end" : "middle"}
                minTickGap={chartData.length > 15 ? 15 : 0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${value / 1000}k`}
                domain={['auto', 'auto']}
              />
              <ChartTooltip
                cursor={true}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value, name) => [formatCurrency(value as number), chartConfig[name as keyof typeof chartConfig]?.label || name]}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                dataKey="balance"
                type="monotone"
                stroke={`var(--color-balance)`}
                strokeWidth={2}
                dot={{
                  fill: `var(--color-balance)`,
                  r: 3,
                }}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BalanceHistoryChart;