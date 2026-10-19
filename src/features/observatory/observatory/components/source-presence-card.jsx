import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { SignalMetric } from './signal-metric';
import { Eye } from '@/components/ui/icons';
import { CardCaret } from './card-caret';
import { accountHref } from '../utils/observatory-model';
import { cn } from '@/lib/utils';

export function SourcePresenceCard({ account, className }) {
  return (
    <FrameCard render={<a href={accountHref(account.id, 'insight:ai-visibility')} />} className={cn('v2-interactive-card h-full min-w-0 w-full outline-none', className)} withFill>
      <FrameCardContent className="h-full justify-between gap-7 p-6">
        <div className="v2-card-tagline flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-sm/normal font-normal">
          <Eye aria-hidden="true" weight="regular" className="size-4 shrink-0" />
          Source presence
        </h2><CardCaret /></div>
        <SignalMetric value="12%" label="Average across 1 daily point" change="+4%" />

      </FrameCardContent>
    </FrameCard>
  );
}
