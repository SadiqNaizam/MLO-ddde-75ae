import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList, // Optional: for labels on bars
} from "recharts";

interface SpendingDataPoint {
  category: string;
  spent: number;
}

interface SpendingAnalysisChartProps {
  data: SpendingDataPoint[];
  title?: string;
  className?: string;
}

const DEFAULT_TITLE = "Spending by Category";

const SpendingAnalysisChart: React.FC<SpendingAnalysisChartProps> = ({
  data,
  title = DEFAULT_TITLE,
  className,
}) => {
  console.log("SpendingAnalysisChart loaded", { data: data ? data.length : 0, title });

  const chartConfig = {
    spent: {
      label: "Spent",
      color: "hsl(var(--primary))", // Using primary theme color for bars
    },
  } satisfies ChartConfig;

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No spending data available to display.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data provided</p>
        </CardContent>
      </Card>
    );
  }

  // Data is assumed to be ready for charting (e.g., sorted if necessary by parent)
  const processedData = data;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {/* Example: <CardDescription>Last 30 days</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full sm:h-[350px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processedData}
              layout="vertical" // Horizontal bars (categories on Y-axis)
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }} // Adjusted margins for labels
              accessibilityLayer // Recommended for recharts by shadcn
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                // Formatter for currency, if needed
                // tickFormatter={(value) => `$${value}`} 
              />
              <YAxis
                dataKey="category"
                type="category"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={5}
                width={80} // Adjust based on typical category name length, or allow dynamic width
                interval={0} // Ensure all category labels are shown
              />
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                content={<ChartTooltipContent indicator="dot" hideLabel={false} />}
              />
              <Bar
                dataKey="spent"
                fill="var(--color-spent)" // Resolved by ChartContainer from chartConfig
                radius={[0, 4, 4, 0]} // Rounded right corners for horizontal bars
                isAnimationActive={true} // Default recharts animation
                // barSize={30} // Optional: fixed bar height
              >
                {/* Optional: To display values on/besides bars */}
                {/* <LabelList 
                  dataKey="spent" 
                  position="right" 
                  offset={8} 
                  fontSize={12} 
                  fill="hsl(var(--foreground))"
                  formatter={(value: number) => value > 0 ? `$${value.toFixed(0)}` : ''} 
                /> */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SpendingAnalysisChart;