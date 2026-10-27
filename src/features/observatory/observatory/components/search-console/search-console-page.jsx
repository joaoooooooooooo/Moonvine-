import { leaderHeadline } from '../../data/section-insights';
import { Button } from '@/components/ui/button';
import { Globe, ChartNoAxesCombined } from '@/components/ui/icons';
import { PageHeading } from '../page-heading';
import { SectionHeading } from '../section-heading';
import { SectionDivider } from '../section-divider';
import { AnalyticsTrends } from '../analytics-v2/analytics-trends';
import { SourceDistributionCard } from '../source-pages/source-distribution-card';
import { SearchQueries } from './search-queries';
import { searchConsoleData } from '../../data/search-console';
import { searchSummary } from '../../data/report-summaries';
import { ReportSignalSummary } from '../report-signal-summary';
import '../signals-grid.css';

export function SearchConsolePage({ account, lens }) {
  const data = searchConsoleData(lens, account);
  return <div className="v2-page-sections">
    <div className="space-y-2">
      <PageHeading title="From search to your site." />
      <p className="max-w-[36ch] text-base leading-6 text-muted-foreground">See how people discover {account.name}, what they search for, and what earns a click.</p>
      <Button className="mt-3" variant="default" render={<a href="#/console/data-sources/first-party-data" />}>Manage Google Search Console</Button>
    </div>
    <ReportSignalSummary data={searchSummary(data)} />
    <AnalyticsTrends metrics={data.metrics} title="Search performance over the week" />
    <SectionDivider />
    <SearchQueries rows={data.queries} change={lens.delta} />
    <SectionDivider />
    <section className="space-y-10" aria-labelledby="search-audience">
      <SectionHeading id="search-audience" title={leaderHeadline(data.devices, 'brings the most search clicks.')} description="The devices and locations behind your visits from Google Search." />
      <div className="v2-signals-grid grid items-stretch gap-3 min-[760px]:grid-cols-2">
        <SourceDistributionCard title="Devices" rows={data.devices} unit="clicks" icon={ChartNoAxesCombined} donut />
        <SourceDistributionCard title="Locations" rows={data.countries} unit="clicks" icon={Globe} />
      </div>
    </section>
    <p className="text-sm/normal text-muted-foreground">Sample report data for design preview.</p>
  </div>;
}
