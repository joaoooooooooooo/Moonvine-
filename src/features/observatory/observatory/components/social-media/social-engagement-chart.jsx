import { MessageCircle } from '@/components/ui/icons';
import { MetricLineChart } from '../search-clicks-chart';
import { searchClicksSeries } from '../../utils/search-clicks-series';

export function SocialEngagementChart({ lens }) {
  return (
    <section aria-label="Social media engagement" className="v2-signals-grid grid gap-3">
      <MetricLineChart title="Social media engagement" metricLabel={lens.metric.toLowerCase()} icon={MessageCircle} data={searchClicksSeries(lens)} />
    </section>
  );
}
