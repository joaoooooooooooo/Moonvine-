import { seriesHeadline } from '../../data/section-insights';
import { SectionHeading } from '../section-heading';
import { useState } from 'react';
import { ResponsiveChartTabs } from '@/components/ui/responsive-chart-tabs';
import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { ChartNoAxesCombined } from '@/components/ui/icons';
import { MetricLineChart } from '../search-clicks-chart';

export function AnalyticsTrends({ metrics, title = 'Traffic over the week' }) {
  const [metricId, setMetricId] = useState(metrics[0].id);
  const active = metrics.find((metric) => metric.id === metricId) ?? metrics[0];
  return <section aria-label={title} className="space-y-10">
    <SectionHeading title={seriesHeadline(active.data, { up: active.id === 'position' ? 'Search rankings have slipped.' : active.label + ' increased this period.', down: active.id === 'position' ? 'Search rankings have improved.' : active.label + ' fell this period.', steady: active.label + ' held steady.' })} />
    <div className="v2-signals-grid">
      <FrameCard className="w-full" withFill><FrameCardContent className="gap-6 p-6">
        <div className="v2-card-tagline flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2"><ChartNoAxesCombined aria-hidden="true" weight="regular" className="size-4" /><h2 className="text-sm/normal font-normal">{title}</h2></div>
          <ResponsiveChartTabs label="Chart metric" items={metrics.map(metric => ({ value: metric.id, label: metric.label }))} value={metricId} onValueChange={setMetricId} />
        </div>
        <div className="flex w-full flex-wrap items-center justify-end gap-4">
          <div className="flex flex-wrap gap-4 text-sm/normal text-muted-foreground"><span className="flex items-center gap-2"><span className="size-2 rounded-[2px] bg-foreground" />This week</span><span className="flex items-center gap-2"><span className="size-2 rounded-[2px] bg-muted-foreground/40" />Last week</span></div>
        </div>
        <div className="w-full" role="img" aria-label={`${active.label} by day, compared with last week${active.unit ? `, in ${active.unit}` : ''}`}>
          <MetricLineChart key={metricId} variant="lines" data={active.data} percentage={active.percentage} />
        </div>
        <p className="text-sm/normal text-muted-foreground">{active.description ?? (active.id === 'engagement' ? 'The share of visits with an engaged session.' : active.id === 'duration' ? 'Average time spent actively engaging with the site, in seconds.' : `${active.label} for each day in the selected report week.`)}</p>
      </FrameCardContent></FrameCard>
    </div>
  </section>;
}
