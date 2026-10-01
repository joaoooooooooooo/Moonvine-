"use client";

import { EChartsLineChart } from "@/components/evilcharts/charts/echarts-line-chart";
import { FrameCard, FrameCardContent } from "@/components/ui/frame-card";
import { SignalMetric } from './signal-metric';
import { Search } from 'lucide-react';
import { CardCaret } from './card-caret';
import { cn } from "@/lib/utils";

// Demo daily totals for two complete weeks, aligned by weekday.
const chartData = [
  { day: "Mon", current: 67, previous: 64 },
  { day: "Tue", current: 89, previous: 85 },
  { day: "Wed", current: 64, previous: 68 },
  { day: "Thu", current: 74, previous: 71 },
  { day: "Fri", current: 112, previous: 108 },
  { day: "Sat", current: 121, previous: 116 },
  { day: "Sun", current: 98, previous: 92 },
];

const chartConfig = {
  current: { label: "This week", colors: { light: ["#171717"], dark: ["#fafafa"] } },
  previous: { label: "Last week", colors: { light: ["#d4d4d4"], dark: ["#525252"] } },
};

const LEGEND = [
  { key: "current", label: "This week", swatch: "bg-[#171717] dark:bg-[#fafafa]" },
  { key: "previous", label: "Last week", swatch: "bg-[#d4d4d4] dark:bg-[#525252]" },
];

function ReportsLineChartCanvas({ className, data = chartData, curveType = 'linear', color, percentage = false, compact = false, hideAxes = compact }) {
  return (
    <div className={cn("min-h-0 w-full", compact ? "h-40" : "h-[16rem] sm:h-[18rem] lg:h-[20rem]", className)}>
      <EChartsLineChart
        className="h-full w-full"
        config={color ? { ...chartConfig, current: { label: 'This week', colors: { light: [color], dark: [color] } } } : chartConfig}
        curveType={curveType}
        data={data}
        xDataKey="day"
      >
        <EChartsLineChart.Grid />
        {!hideAxes && <EChartsLineChart.YAxis tickFormatter={percentage ? (value) => `${value}%` : undefined} />}
        {!hideAxes && <EChartsLineChart.XAxis dataKey="day" />}
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

export function MetricLineChart({ className, variant = "default", data = chartData, href, title = 'Google Search', metricLabel = 'Google Search clicks', icon: Icon = Search, curveType = 'linear', color, percentage = false, metricValue, comparisonLabel, compact = false, hideAxes = compact }) {
const TOTAL = data.reduce((sum, { current }) => sum + current, 0);
const PREVIOUS_TOTAL = data.reduce((sum, { previous }) => sum + previous, 0);
const CHANGE_PERCENT = PREVIOUS_TOTAL ? ((TOTAL - PREVIOUS_TOTAL) / PREVIOUS_TOTAL) * 100 : 0;
const COMPARISON_LABEL = `${CHANGE_PERCENT >= 0 ? "+" : ""}${CHANGE_PERCENT.toFixed(1)}%`;


  if (variant === "lines") {
    return <ReportsLineChartCanvas className={className} data={data} curveType={curveType} color={color} percentage={percentage} compact={compact} hideAxes={hideAxes} />;
  }

  return (
    <FrameCard render={href ? <a href={href} /> : undefined} className={cn(
        "w-full",
        className,
      )} withFill>
      <FrameCardContent className="gap-0 p-6">
        <div className="flex w-full flex-1 flex-col gap-7">
            <div className="v2-card-tagline flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-sm/normal font-normal">
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              {title}
            </h2>{href && <CardCaret />}</div>
          <SignalMetric
            align="top"
            change={comparisonLabel ?? COMPARISON_LABEL}
            negative={CHANGE_PERCENT < 0}
            label={metricLabel}
            value={metricValue ?? TOTAL.toLocaleString('en-US')}
          />
            <div className="flex w-full flex-wrap items-center gap-3">
              {LEGEND.map(({ key, label, swatch }) => (
                <span
                  key={key}
                  className="text-muted-foreground flex items-center gap-1.5 text-[11px] sm:text-xs"
                >
                  <span className={cn("size-2.5 shrink-0 rounded-full", swatch)} style={key === 'current' && color ? { backgroundColor: color } : undefined} />
                  {label}
                </span>
              ))}
            </div>
          <ReportsLineChartCanvas className="grow" data={data} curveType={curveType} color={color} percentage={percentage} compact={compact} hideAxes={hideAxes} />
  
        </div>
      </FrameCardContent>
    </FrameCard>
  );
}

export { MetricLineChart as SearchClicksChart };
