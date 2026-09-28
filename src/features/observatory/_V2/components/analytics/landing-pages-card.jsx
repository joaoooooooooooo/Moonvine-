import { FileText } from 'lucide-react';
import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { analyticsTopPages } from '../../data/analytics-top-pages';
import { Badge } from '@/components/ui/badge';
import { formatMetric } from '../../utils/observatory-model';

export function LandingPagesCard({ lens, account }) {
  const pages = analyticsTopPages(lens.value);
  return (
    <FrameCard className="min-w-0" withFill>
      <FrameCardContent className="gap-7 p-6">
        <div className="v2-card-tagline flex items-center gap-2">
          <FileText aria-hidden="true" className="size-4 shrink-0" />
          <h2 className="text-sm/normal font-normal">Where people landed</h2>
        </div>
        <h2 className="text-xl/normal font-normal">The first pages people reached this week.</h2>
        <ol className="flex w-full flex-col gap-2" aria-label="Landing pages ranked by visits">
          {pages.map(({ path, visits, share, preview }) => (
            <li key={path}>
              <a href={`https://${account.domain}${path}`} target="_blank" rel="noreferrer" className="relative isolate flex min-h-12 items-center gap-3 overflow-hidden rounded-md border px-3 py-2 text-sm outline-none hover:bg-accent/30 focus-visible:ring-2 focus-visible:ring-ring">
                <span aria-hidden="true" className="absolute inset-y-0 left-0 -z-10 bg-secondary" style={{ width: `${share}%` }} />
                <img src={preview} alt="" title="Mock page preview" loading="lazy" className="size-8 shrink-0 rounded-sm object-cover" />
                <span className="min-w-0 flex-1 truncate">{path}</span>
                <Badge variant="secondary">{formatMetric(visits)} visits</Badge>
                <span className="shrink-0 tabular-nums text-muted-foreground">{share.toFixed(0)}%</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ol>
      </FrameCardContent>
    </FrameCard>
  );
}
