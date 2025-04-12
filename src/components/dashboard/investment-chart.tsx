"use client";

import type React from "react";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, Calendar } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for the chart
const generateData = (days: number, startValue: number, volatility: number) => {
  const data = [];
  let currentValue = startValue;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));

    // Add some randomness to simulate market volatility
    const change = (Math.random() - 0.5) * volatility;
    currentValue = Math.max(currentValue + change, 0); // Ensure value doesn't go below 0

    data.push({
      date: format(date, "MMM dd"),
      value: currentValue.toFixed(2),
    });
  }

  return data;
};

const weekData = generateData(7, 15000, 500);
const monthData = generateData(30, 14000, 800);
const yearData = generateData(365, 10000, 2000);

interface InvestmentChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function InvestmentChart({ className, ...props }: InvestmentChartProps) {
  const [activeTab, setActiveTab] = useState("week");

  const data =
    activeTab === "week"
      ? weekData
      : activeTab === "month"
        ? monthData
        : yearData;
  const currentValue = Number.parseFloat(data[data.length - 1].value);
  const startValue = Number.parseFloat(data[0].value);
  const percentageChange = ((currentValue - startValue) / startValue) * 100;

  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-1">
          <CardTitle>Investment Performance</CardTitle>
          <CardDescription>
            Track your investment growth over time
          </CardDescription>
        </div>
        <div className="ml-auto">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Calendar className="h-4 w-4" />
            <span className="sr-only">View calendar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <div className="text-2xl font-bold">${currentValue.toFixed(2)}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span
                className={cn(
                  "mr-1",
                  percentageChange >= 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {percentageChange >= 0 ? "+" : ""}
                {percentageChange.toFixed(2)}%
              </span>
              <ArrowUpRight
                className={cn(
                  "h-4 w-4",
                  percentageChange >= 0
                    ? "text-green-500"
                    : "text-red-500 rotate-90"
                )}
              />
              <span className="ml-1">
                vs.{" "}
                {activeTab === "week"
                  ? "last week"
                  : activeTab === "month"
                    ? "last month"
                    : "last year"}
              </span>
            </div>
          </div>
          <Tabs
            defaultValue="week"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
            <TabsContent value="week" className="h-[250px]">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weekData}
                    margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#888"
                      strokeOpacity={0.2}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="#888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="month" className="h-[250px]">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthData}
                    margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#888"
                      strokeOpacity={0.2}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="#888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="year" className="h-[250px]">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={yearData}
                    margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#888"
                      strokeOpacity={0.2}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="#888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <ChartTooltipContent>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm font-bold">${payload[0].value}</p>
      </div>
    </ChartTooltipContent>
  );
}
