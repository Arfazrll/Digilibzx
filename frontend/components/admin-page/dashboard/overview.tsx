"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  user: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
  transaction: {
    label: "Transactions",
    color: "hsl(var(--chart-2))",
  },
  review: {
    label: "Reviews",
    color: "hsl(var(--chart-3))",
  },
  notification: {
    label: "Notifications",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function Overview(data: any) {
  // Transform data for the chart
  const chartData = [
    { data: "user", value: data?.data?.totalUser, fill: "var(--color-user)" },
    { data: "transaction", value: data?.data?.totalTransaction, fill: "var(--color-transaction)" },
    { data: "review", value: data?.data?.totalReview, fill: "var(--color-review)" },
    { data: "notification", value: data?.data?.totalNotifications, fill: "var(--color-notification)" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Overviews</CardTitle>
        <CardDescription>Recent</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="data"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="value"
              strokeWidth={2}
              radius={8}
              activeIndex={2}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                );
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing all total data for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
