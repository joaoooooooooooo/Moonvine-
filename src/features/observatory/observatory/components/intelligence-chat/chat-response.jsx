import { ArrowUpRight } from '@/components/ui/icons';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { ObservatoryTable } from '../observatory-table';
import { MetricLineChart } from '../search-clicks-chart';
import { MetricComparison } from '../metric-comparison';
import { accountHref, formatMetric } from '../../utils/observatory-model';
import { searchClicksSeries } from '../../utils/search-clicks-series';

const valueLabel = (lens) => `${formatMetric(lens.value)}${lens.id === 'ai' ? '%' : ''}`;
const changeLabel = (lens) => `${lens.delta > 0 ? '+' : ''}${lens.delta}${lens.id === 'ai' ? ' pp' : '%'}`;

export function ChatResponse({ message, model }) {
  const lenses = ['ai', 'search', 'social'].map((id) => model.lenses.find((lens) => lens.id === id));
  if (message.format === 'table') return (
    <ObservatoryTable label="Intelligence metrics comparison">
      <TableHeader><TableRow><TableHead>Metric</TableHead><TableHead>Value</TableHead><TableHead>Change</TableHead></TableRow></TableHeader>
      <TableBody>{lenses.map((lens) => <TableRow key={lens.id}>
        <TableCell className="whitespace-normal leading-normal">{lens.metric}</TableCell>
        <TableCell className="tabular-nums">{valueLabel(lens)}</TableCell>
        <TableCell className="whitespace-normal"><MetricComparison change={changeLabel(lens)} negative={lens.delta < 0} /></TableCell>
      </TableRow>)}</TableBody>
    </ObservatoryTable>
  );
  if (message.format === 'chart') {
    const lens = model.lenses.find((item) => item.id === message.lensId);
    return <div className="v2-signals-grid grid w-full min-w-0"><MetricLineChart title={lens.label} metricLabel={lens.metric} data={searchClicksSeries(lens)} compact hideAxes={false} hideYAxis /></div>;
  }
  if (message.format === 'links') return (
    <div className="v2-signals-grid grid w-full gap-3">
      {lenses.map((lens) => <FrameCard key={lens.id} render={<a href={accountHref(model.account.id, lens.sourceId, model.route.period)} />} className="w-full">
        <FrameCardContent className="w-full gap-2 p-4">
          <span className="flex w-full items-center justify-between gap-3 text-base">{lens.label}<ArrowUpRight className="size-4 shrink-0" aria-hidden="true" /></span>
          <p className="text-sm text-muted-foreground">{lens.summary}</p>
        </FrameCardContent>
      </FrameCard>)}
    </div>
  );
  return (
    <dl className="flex w-full flex-wrap gap-6">
      {lenses.map((lens) => <div key={lens.id} className="flex flex-col gap-2">
        <dt className="text-sm text-muted-foreground">{lens.metric}</dt>
        <dd className="order-first font-heading text-3xl tabular-nums">{valueLabel(lens)}</dd>
        <dd><MetricComparison change={changeLabel(lens)} negative={lens.delta < 0} /></dd>
      </div>)}
    </dl>
  );
}
