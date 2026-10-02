import { ChartNoAxesCombined, Activity } from 'lucide-react';
import { engagementSeries } from '../../utils/engagement-series';
import { TopPagesChart } from './top-pages-chart';
import { MainChannelCard } from './main-channel-card';
import { VisitorSourcesChart } from './visitor-sources-chart';
import { LandingPagesCard } from './landing-pages-card';
import { MetricLineChart } from '../search-clicks-chart';
import { searchClicksSeries } from '../../utils/search-clicks-series';
import { SectionDivider } from '../section-divider';
import { SectionHeading } from '../section-heading';
import '../signals-grid.css';

export function AnalyticsCharts({ lens, account }) {
  const visits = searchClicksSeries(lens);
  const engagement = engagementSeries(visits);
  return (
    <section aria-label="Google Analytics charts" className="v2-page-sections">
      <section aria-label="Traffic and engagement">
        <div className="v2-signals-grid grid items-stretch gap-3 md:grid-cols-2">
          <MetricLineChart compact className="min-w-0" title="Visits" metricLabel="Website visits" icon={ChartNoAxesCombined} data={visits} />
          <MetricLineChart compact className="min-w-0" title="Engagement rate" metricLabel="Engagement rate" icon={Activity} data={engagement.data} metricValue={engagement.value} comparisonLabel={engagement.change} percentage curveType="bump" color="var(--chart-2)" />
        </div>
      </section>
      <SectionDivider />
      <section aria-labelledby="analytics-pages-heading" className="flex flex-col gap-10">
        <SectionHeading id="analytics-pages-heading" title="Top pages and channels" description="The pages people visited and the channels that brought them here." />
        <div className="v2-signals-grid grid items-stretch gap-3 md:grid-cols-2">
          <TopPagesChart total={lens.value} />
          <MainChannelCard lens={lens} />
        </div>
      </section>
      <SectionDivider />
      <section aria-labelledby="analytics-sources-heading" className="flex flex-col gap-10">
        <SectionHeading id="analytics-sources-heading" title="Sources and landing pages" description="Where visits came from and where people started exploring your website." />
        <div className="v2-signals-grid grid items-stretch gap-3 md:grid-cols-2">
          <VisitorSourcesChart lens={lens} />
          <LandingPagesCard lens={lens} account={account} />
        </div>
      </section>
    </section>
  );
}

