import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { DonutDistribution } from '@/features/Reports/components/donutDistribution';
import { SignalMetric } from './signal-metric';
import { Eye } from 'lucide-react';
import { CardCaret } from './card-caret';
import { sourcePresenceData } from '../data/source-presence';
import { accountHref } from '../utils/observatory-model';

export function SourcePresenceCard({ account }) {
  const data = sourcePresenceData(account);
  return (
    <FrameCard render={<a href={accountHref(account.id, 'insight:ai-visibility')} />} className="h-full min-w-0 w-full" withFill>
      <FrameCardContent className="h-full gap-7 p-6">
        <div className="v2-card-tagline flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-sm/normal font-normal">
          <Eye aria-hidden="true" className="size-4 shrink-0" />
          Source Presence
        </h2><CardCaret /></div>
        <SignalMetric align="top" value="12%" label="Average across 1 daily point" change="+4%" />
        <DonutDistribution className="mx-auto mt-auto w-full max-w-none [--background:var(--card)]" data={data} layout="chart-only" totalLabel="Total share" />

      </FrameCardContent>
    </FrameCard>
  );
}
