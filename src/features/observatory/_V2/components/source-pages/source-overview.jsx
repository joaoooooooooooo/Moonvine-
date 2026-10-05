import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { sourcePresentation } from '../../data/source-presentation';
import { lensIcons } from '../../data/navigation';
import { formatMetric } from '../../utils/observatory-model';
import { searchClicksSeries } from '../../utils/search-clicks-series';
import { MetricComparison } from '../metric-comparison';
import { MetricLineChart } from '../search-clicks-chart';
import { SourceBreakdown } from './source-breakdown';
import { SourceInsights } from './source-insights';
import '../signals-grid.css';

export function SourceOverview({ lens, account }) {
  const presentation = sourcePresentation[lens.id];
  const Icon = lensIcons[lens.id];
  return (
    <div className="v2-page-sections">
      <section aria-label={`${lens.label} overview`} className="v2-signals-grid grid items-stretch gap-3 lg:grid-cols-2">
        {lens.id === 'competitors' ? (
          <FrameCard className="h-full min-w-0" withFill>
            <FrameCardContent className="h-full gap-7 p-6">
              <div className="v2-card-tagline flex items-center gap-2"><Icon aria-hidden="true" weight="regular" className="size-4" /><h2 className="text-sm/normal font-normal">{lens.metric}</h2></div>
              <div className="space-y-2">
                <p className="font-heading text-[80px]/none font-normal tabular-nums tracking-tight">{formatMetric(lens.value)}</p>
                <p className="text-sm/normal text-muted-foreground">Shared search terms</p>
                <MetricComparison change={`${lens.delta >= 0 ? '+' : ''}${lens.delta}%`} negative={lens.delta < 0} />
              </div>
            </FrameCardContent>
          </FrameCard>
        ) : <MetricLineChart compact className="min-w-0" title={lens.metric} metricLabel={lens.metric.toLowerCase()} icon={Icon} data={searchClicksSeries(lens)} />}
        <SourceBreakdown lens={lens} presentation={presentation} account={account} />
      </section>
      <SourceInsights lens={lens} presentation={presentation} />
    </div>
  );
}

