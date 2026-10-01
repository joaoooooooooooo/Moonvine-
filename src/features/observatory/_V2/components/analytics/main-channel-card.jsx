import { Route } from 'lucide-react';
import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { Progress, ProgressTrack, ProgressIndicator } from '@/components/ui/progress';
import { formatMetric } from '../../utils/observatory-model';

export function MainChannelCard({ lens }) {
  const [channel, visits] = [...lens.rows].sort((a, b) => b[1] - a[1])[0] ?? ['No visits yet', 0];
  const share = lens.value ? Math.round(visits / lens.value * 100) : 0;
  return (
    <FrameCard className="h-full min-w-0" withFill>
      <FrameCardContent className="gap-7 p-6">
        <div className="v2-card-tagline flex items-center gap-2">
          <Route aria-hidden="true" className="size-4 shrink-0" />
          <h2 className="text-sm/normal font-normal">Main channel</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xl/normal font-normal tracking-tight">{channel}</p>
          <p className="text-xs/normal text-muted-foreground">{formatMetric(visits)} visits · {share}% of total</p>
        </div>
        <Progress value={share} aria-label={`${channel} share of visits`} className="mt-auto gap-4">
          <span className="text-[64px]/none font-normal tabular-nums tracking-tight">{share}%</span>
          <ProgressTrack className="h-2"><ProgressIndicator className="bg-foreground" /></ProgressTrack>
        </Progress>
      </FrameCardContent>
    </FrameCard>
  );
}
