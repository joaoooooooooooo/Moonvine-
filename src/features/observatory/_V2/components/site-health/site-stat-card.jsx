import { EChartsRadialChart } from "@/components/evilcharts/charts/echarts-radial-chart";
import { FrameCard, FrameCardContent } from "@/components/ui/frame-card";
import { cn } from "@/lib/utils";
import { SignalMetric } from '../signal-metric';
import { Globe } from '@/components/ui/icons';
import { CardCaret } from '../card-caret';

const scoreColors = {
  bad: "var(--color-red-400)",
  good: "var(--color-emerald-400)",
  moderate: "var(--color-orange-400)",
};

function getScoreStatus(score) {
  if (score < 50) return "bad";
  if (score < 90) return "moderate";
  return "good";
}

export function SiteStatCard({
  className,
  chartClassName,
  variant = 'semi',
  href,
  metric,
  change,
  negative = false,
  description =
    "How quickly the mobile page experience performs in Google PageSpeed Insights. Score:",
  max = 100,
  score = 73,
  strokeWidth = 5,
  title = "PageSpeed Performance",
}) {
  const maxScore = Math.max(Number(max) || 100, 1);
  const normalizedScore = Math.min(
    Math.max(Number(score) || 0, 0),
    maxScore,
  );
  const scoreStatus = getScoreStatus((normalizedScore / maxScore) * 100);
  const scoreColor = metric
    ? (negative ? "var(--destructive-foreground)" : "var(--success-foreground)")
    : scoreColors[scoreStatus];
  const chartData = [{ name: "score", value: normalizedScore }];
  const chartConfig = {
    score: {
      label: `${title} score`,
      colors: { dark: [scoreColor], light: [scoreColor] },
    },
  };

  return (
    <FrameCard render={href ? <a href={href} /> : undefined} className={cn("w-full max-w-[31rem]", className)} withFill>
      <FrameCardContent className={cn("flex-1 gap-3 px-5 py-4", metric && "gap-7 p-6")}>
        <div className="flex w-full flex-col gap-1.5">
          <div className={cn("flex items-center justify-between gap-3", metric ? "v2-card-tagline" : "w-full")}><h2 className={cn("max-w-[13rem] text-xl/normal font-normal tracking-[-0.36px] [text-wrap:balance]", metric ? "max-w-none text-sm/normal tracking-normal" : "text-foreground")}>
            {href ? <span className="flex items-center gap-2"><Globe aria-hidden="true" className="size-4 shrink-0" />{title}</span> : title}
          </h2>{href && <CardCaret />}</div>
          {!metric && <p className="text-sm/5 font-normal text-muted-foreground">
            {description}
          </p>}
        </div>
        {metric && <SignalMetric align="top" value={`${normalizedScore}/${maxScore}`} label={metric} change={change} negative={negative} />}

        <div className={cn("relative mt-auto w-full shrink-0", variant === 'full' ? 'aspect-square' : 'aspect-[5/4]', chartClassName)}>
          <div className="absolute top-0 left-0 aspect-square w-full">
          <EChartsRadialChart
            className="h-full w-full"
            config={chartConfig}
            data={chartData}
            innerRadius="66%"
            max={maxScore}
            nameKey="name"
            outerRadius="96%"
            variant={variant}
          >
            <EChartsRadialChart.RadialBar
              barSize={strokeWidth}
              cornerRadius={9}
              dataKey="value"
              isClickable={false}
              showBackground
            />
          </EChartsRadialChart>

          <div className={cn("pointer-events-none absolute inset-x-0 flex -translate-y-1/2 justify-center", variant === 'full' ? 'top-1/2' : 'top-[calc(70%-4px)]')}>
            <p className="text-xl/normal font-normal text-foreground">
              <span>{normalizedScore}</span>
              <span className="text-muted-foreground">/{maxScore}</span>
            </p>
          </div>
          </div>
        </div>

      </FrameCardContent>
    </FrameCard>
  );
}
