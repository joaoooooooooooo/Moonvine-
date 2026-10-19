import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { lensIcons } from '../data/navigation';
import { CardCaret } from './card-caret';
import { SignalMetric } from './signal-metric';
import { accountHref, formatMetric } from '../utils/observatory-model';

export function SignalCard({ accountId, lens }) {
  const Icon = lensIcons[lens.id];
  const changeUnit = lens.unit === '%' ? ' pp' : lens.unit === '/100' ? ' pts' : '%';
  return (
    <FrameCard render={<a href={accountHref(accountId, lens.sourceId)} />} withFill className="v2-interactive-card h-full min-w-0 outline-none">
      <FrameCardContent className="h-full justify-between gap-7 p-6">
        <div className="v2-card-tagline flex items-center justify-between gap-3"><h3 className="flex items-center gap-2 text-sm/normal font-normal"><Icon aria-hidden="true" weight="regular" className="size-4 shrink-0" />{lens.label}</h3><CardCaret /></div>
        <SignalMetric value={formatMetric(lens.value, lens.unit)} label={lens.metric} change={`${lens.delta > 0 ? '+' : ''}${formatMetric(lens.delta)}${changeUnit}`} negative={lens.delta < 0} />

      </FrameCardContent>
    </FrameCard>
  );
}
