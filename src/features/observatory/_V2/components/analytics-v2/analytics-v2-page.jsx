import { Button } from '@/components/ui/button';
import { Globe, ChartNoAxesCombined } from '@/components/ui/icons';
import { PageHeading } from '../page-heading';
import { SectionHeading } from '../section-heading';
import { SectionDivider } from '../section-divider';
import { SourceDistributionCard } from '../source-pages/source-distribution-card';
import { AnalyticsTrends } from './analytics-trends';
import { AnalyticsLandingPages } from './analytics-landing-pages';
import { VisitorSourcesChart } from '../analytics/visitor-sources-chart';
import { analyticsV2Data } from '../../data/analytics-v2';
import { analyticsSummary } from '../../data/report-summaries';
import { ReportSignalSummary } from '../report-signal-summary';
import '../signals-grid.css';

export function AnalyticsV2Page({ account, lens, period }) {
  const data = analyticsV2Data(lens, period);
  const mobileShare = data.total ? Math.round((data.devices.find((device) => device.label === 'Mobile')?.value ?? 0) / data.total * 100) : 0;
  return <div className="v2-page-sections">
    <div className="space-y-2"><PageHeading title="Understand every visit." /><p className="max-w-[36ch] text-base leading-6 text-muted-foreground">Traffic, engagement, and the paths people take through {account.name}.</p><Button className="mt-3" variant="default" render={<a href="#/console/data-sources/first-party-data" />}>Manage Google Analytics</Button></div>
    <ReportSignalSummary data={analyticsSummary(data)} />
    <AnalyticsTrends metrics={data.metrics} />
    <SectionDivider />
    <section aria-labelledby="analytics-v2-channels" className="space-y-10"><SectionHeading id="analytics-v2-channels" title="Where visits came from" description="See how each channel contributes to your traffic, and how the mix changes over time." /><div className="v2-signals-grid"><VisitorSourcesChart lens={lens} rows={data.channels} reportPeriod={period} /></div></section>
    <SectionDivider />
    <AnalyticsLandingPages rows={data.landingPages} account={account} />
    <SectionDivider />
    <section aria-labelledby="analytics-v2-audience" className="space-y-10"><SectionHeading id="analytics-v2-audience" title="Who’s on the other side" description="The devices and locations behind this week’s visits." /><div className="v2-signals-grid grid items-stretch gap-3 min-[760px]:grid-cols-2"><SourceDistributionCard title="Devices" rows={data.devices} icon={ChartNoAxesCombined} donut /><SourceDistributionCard title="Locations" rows={data.countries} icon={Globe} /></div></section>
    <SectionDivider />
    <section className="space-y-10" aria-labelledby="analytics-v2-next"><SectionHeading id="analytics-v2-next" title="Worth checking next" description="Use the traffic patterns to choose your next small improvement." /><ul className="space-y-6"><li className="space-y-2"><h3 className="text-base font-medium">Make the next step clear on your homepage.</h3><p className="max-w-[48ch] text-base text-muted-foreground">It receives {data.landingPages[0].share.toFixed(0)}% of entrances. Keep a clear route to your work and services.</p></li><li className="space-y-2"><h3 className="text-base font-medium">Review the mobile journey.</h3><p className="max-w-[48ch] text-base text-muted-foreground">Mobile accounts for {mobileShare}% of visits. Check that navigation and contact actions are easy to use on a small screen.</p></li></ul></section>
    <p className="text-sm/normal text-muted-foreground">Sample report data for design preview.</p>
  </div>;
}
