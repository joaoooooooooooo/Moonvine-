import { FrameCard, FrameCardContent } from "@/components/ui/frame-card";
import { cn } from "@/lib/utils";
import { SignalMetric } from '../signal-metric';
import { Globe } from '@/components/ui/icons';
import { CardCaret } from '../card-caret';
import { MetricComparison } from '../metric-comparison';

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
  icon: Icon,
  href,
  metric,
  change,
  negative = false,
  description =
    "How quickly the mobile page experience performs in Google PageSpeed Insights. Score:",
  max = 100,
  score = 73,
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
  const scorePercentage = (normalizedScore / maxScore) * 100;
  const HeaderIcon = Icon ?? (href ? Globe : null);

  return (
    <FrameCard render={href ? <a href={href} /> : <article />} className={cn("h-full w-full max-w-[31rem]", className)} withFill>
      <FrameCardContent className="flex-1 gap-0 p-5 shadow-none before:shadow-none">
        <div className="v2-card-tagline flex items-center justify-between gap-3">
          <h2 className="text-base/6 font-medium text-foreground [text-wrap:balance]">
            <span className="flex items-center gap-2">{HeaderIcon && <HeaderIcon aria-hidden="true" className="size-4 shrink-0" weight="regular" />}{title}</span>
          </h2>
          {href && <CardCaret />}
        </div>
        <div className={cn("flex w-full flex-1 flex-col gap-4 pt-5", metric && "gap-5")}>
          {!metric && <p className="text-sm/5 font-normal text-muted-foreground">{description}</p>}
          {metric && <SignalMetric align="top" value={`${normalizedScore}/${maxScore}`} label={metric} change={change} negative={negative} />}
          <div className="mt-auto w-full space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-baseline text-sm/normal tabular-nums" style={{ color: scoreColor }}>
                <span className="font-medium">{normalizedScore}</span>
                <span className="text-xs text-muted-foreground">/{maxScore}</span>
              </div>
              <div className="ml-auto text-right"><MetricComparison change={change} negative={negative} /></div>
            </div>
            <div aria-label={`${title} score`} aria-valuemax={maxScore} aria-valuemin={0} aria-valuenow={normalizedScore} className="h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar">
              <div className="h-full rounded-full" style={{ backgroundColor: scoreColor, width: `${scorePercentage}%` }} />
            </div>
          </div>
        </div>
      </FrameCardContent>
    </FrameCard>
  );
}
