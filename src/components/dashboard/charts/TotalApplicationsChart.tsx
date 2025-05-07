// src/components/stats/TotalApplicationsChart.tsx
"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

import { fetchApplicationStats, ApplicationStats } from "@/apis/HR/applicationApi"; // ← fixed import path

interface TotalApplicationsChartProps {
  jobId?: number;
}

export function TotalApplicationsChart({ jobId }: TotalApplicationsChartProps) {
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplicationStats(jobId)
      .then((data) => {
        console.log("stats →", data);
        setStats(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load stats");
      });
  }, [jobId]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!stats) return <div>Loading application stats…</div>;

  const { total_applications, scored_applications } = stats;

  // Build data for two bars
  const chartData = [
    { name: "Total", value: total_applications },
    { name: "Scored", value: scored_applications },
  ];

  // Tell ChartContainer about each series
  const chartConfig: ChartConfig = {
    Total: { label: "Total Apps", color: "hsl(var(--chart-1))" },
    Scored: { label: "Scored Apps", color: "hsl(var(--chart-2))" },
  };

  // percent change for footer
  const trendPercent =
    total_applications > 0
      ? ((scored_applications / total_applications - 1) * 100).toFixed(1)
      : null;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Applications</CardTitle>
        <CardDescription>
          {jobId ? `Job #${jobId}` : "All Accessible Jobs"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <div className="relative mx-auto w-full max-h-[250px]">
          {/* ChartContainer gets exactly one child */}
          <ChartContainer config={chartConfig} className="w-full h-[250px]">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--chart-2))" />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        {trendPercent && (
          <div className="flex items-center gap-2 font-medium leading-none">
            {`Trend: ${trendPercent}%`} <TrendingUp className="h-4 w-4" />
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          Data pulled from your application stats endpoint
        </div>
      </CardFooter>
    </Card>
  );
}
