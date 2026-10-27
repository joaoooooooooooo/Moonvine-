import { trendHeadline } from '../../data/section-insights';
import { SectionHeading } from '../section-heading';
import { MessageCircle } from '@/components/ui/icons';
import { MetricLineChart } from '../search-clicks-chart';
import { searchClicksSeries } from '../../utils/search-clicks-series';

export function SocialEngagementChart({ lens }) {
  return (
    <section aria-label="Social media engagement" className="space-y-10">
      <SectionHeading title={trendHeadline(lens.delta, { up: 'Social engagement is growing.', down: 'Social engagement has fallen.', steady: 'Social engagement is steady.' })} />
      <div className="v2-signals-grid"><MetricLineChart title="Social media engagement" metricLabel={lens.metric.toLowerCase()} icon={MessageCircle} data={searchClicksSeries(lens)} /></div>
    </section>
  );
}
