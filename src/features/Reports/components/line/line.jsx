"use client";

import { EChartsLineChart } from "@/components/evilcharts/charts/echarts-line-chart";
import { FrameCard, FrameCardContent } from "@/components/ui/frame-card";
import { Metric1 } from "@/features/Reports/components/metric1";
import { cn } from "@/lib/utils";

const chartData = [
  { slot: "Mon 1", current: 14, previous: 34 },
  { slot: "Mon 2", current: 9, previous: 41 },
  { slot: "Mon 3", current: 18, previous: 37 },
  { slot: "Mon 4", current: 26, previous: 29 },
  { slot: "Tue 1", current: 31, previous: 24 },
  { slot: "Tue 2", current: 27, previous: 33 },
  { slot: "Tue 3", current: 19, previous: 45 },
  { slot: "Tue 4", current: 12, previous: 52 },
  { slot: "Wed 1", current: 16, previous: 47 },
  { slot: "Wed 2", current: 22, previous: 39 },
  { slot: "Wed 3", current: 15, previous: 44 },
  { slot: "Wed 4", current: 11, previous: 50 },
  { slot: "Thu 1", current: 17, previous: 43 },
  { slot: "Thu 2", current: 24, previous: 31 },
  { slot: "Thu 3", current: 20, previous: 26 },
  { slot: "Thu 4", current: 13, previous: 22 },
  { slot: "Fri 1", current: 21, previous: 28 },
  { slot: "Fri 2", current: 29, previous: 36 },
  { slot: "Fri 3", current: 34, previous: 42 },
  { slot: "Fri 4", current: 28, previous: 55 },
  { slot: "Sat 1", current: 23, previous: 49 },
  { slot: "Sat 2", current: 30, previous: 40 },
  { slot: "Sat 3", current: 36, previous: 35 },
  { slot: "Sat 4", current: 32, previous: 44 },
];

const chartConfig = {
  current: { label: "This week", colors: { light: ["#171717"], dark: ["#fafafa"] } },
  previous: { label: "Last week", colors: { light: ["#d4d4d4"], dark: ["#525252"] } },
};

const LEGEND = [
  { key: "current", label: "This week", swatch: "border-[#171717] dark:border-[#fafafa]" },
  { key: "previous", label: "Last week", swatch: "border-[#d4d4d4] dark:border-[#525252]" },
];

const TOTAL = chartData.reduce((sum, { current }) => sum + current, 0);

function ReportsLineChartCanvas({ className }) {
  return (
    <div className={cn("min-h-0 h-[16rem] w-full sm:h-[18rem] lg:h-[20rem]", className)}>
      <EChartsLineChart
        className="h-full w-full"
        config={chartConfig}
        curveType="linear"
        data={chartData}
        xDataKey="slot"
      >
        <EChartsLineChart.Grid />
        <EChartsLineChart.YAxis />
        <EChartsLineChart.XAxis
          dataKey="slot"
          tickFormatter={(value) => (value.endsWith(" 1") ? value.slice(0, 3) : "")}
        />
        <EChartsLineChart.Tooltip />
        <EChartsLineChart.Line
          dataKey="previous"
          strokeVariant="dashed"
          strokeWidth={1.5}
        />
        <EChartsLineChart.Line dataKey="current" strokeVariant="solid" strokeWidth={1.5}>
          <EChartsLineChart.ActiveDot />
        </EChartsLineChart.Line>
      </EChartsLineChart>
    </div>
  );
}

export function ReportsMultiSeriesLineChart({ className, variant = "default" }) {
  if (variant === "lines") {
    return <ReportsLineChartCanvas className={className} />;
  }

  return (
    <FrameCard className={cn("w-full", className)} withFill>
      <FrameCardContent className="gap-0 p-4 sm:p-5 lg:p-6">
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <Metric1
              comparisonBadgeLabel="+ 4.2%"
              comparisonBadgeVariant="success"
              comparisonText="Vs last week"
              label="Orders shipped"
              prefix=""
              size="sm"
              suffix=""
              value={TOTAL.toString()}
            />

            <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:justify-end">
              {LEGEND.map(({ key, label, swatch }) => (
                <span
                  key={key}
                  className="text-muted-foreground flex items-center gap-1.5 text-[11px] sm:text-xs"
                >
                  <span className={cn("size-2.5 shrink-0 rounded-full border-2", swatch)} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <ReportsLineChartCanvas />
        </div>
      </FrameCardContent>
    </FrameCard>
  );
}
