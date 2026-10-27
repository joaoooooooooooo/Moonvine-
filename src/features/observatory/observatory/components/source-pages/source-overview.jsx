import { trendHeadline } from '../../data/section-insights';
import { SectionHeading } from '../section-heading';
import { sourcePresentation } from '../../data/source-presentation';
import { lensIcons } from '../../data/navigation';
import { searchClicksSeries } from '../../utils/search-clicks-series';
import { MetricLineChart } from '../search-clicks-chart';
import { SourceBreakdown } from './source-breakdown';
import { SourceInsights } from './source-insights';
import { SearchCompetitorsTable } from './search-competitors-table';
import { SearchCompetitorsChart } from './search-competitors-chart';
import '../signals-grid.css';

export function SourceOverview({ lens, account, period }) {
  const presentation = sourcePresentation[lens.id];
  const Icon = lensIcons[lens.id];
  return (
    <div className="v2-page-sections">
      <div className="space-y-10"><SectionHeading title={trendHeadline(lens.delta, { up: lens.id === 'competitors' ? 'Your search audience overlaps more widely.' : 'Your media visibility is growing.', down: lens.id === 'competitors' ? 'Your search audience overlaps less widely.' : 'Your media visibility has declined.', steady: lens.id === 'competitors' ? 'Your search overlap is steady.' : 'Your media visibility is steady.' })} />
      <section aria-label={`${lens.label} overview`} className={`v2-signals-grid grid items-stretch gap-3 ${lens.id === 'competitors' ? '' : 'lg:grid-cols-2'}`}>
        {lens.id === 'competitors' ? (
          <SearchCompetitorsChart lens={lens} account={account} period={period} />
        ) : <MetricLineChart compact className="min-w-0" title={lens.metric} metricLabel={lens.metric.toLowerCase()} icon={Icon} data={searchClicksSeries(lens)} />}
        {lens.id !== 'competitors' && <SourceBreakdown lens={lens} presentation={presentation} account={account} />}
      </section></div>
      {lens.id === 'competitors' && <SearchCompetitorsTable lens={lens} account={account} />}
      <SourceInsights lens={lens} presentation={presentation} />
    </div>
  );
}

