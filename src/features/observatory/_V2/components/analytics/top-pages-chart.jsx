import { FileText } from 'lucide-react';
import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { Badge } from '@/components/ui/badge';
import { analyticsTopPages } from '../../data/analytics-top-pages';

// Adapted from Reports RankItem for landing-page paths and visit shares.
export function TopPagesChart({ total }) {
  const pages = analyticsTopPages(total);
  const top = pages[0];
  return (
    <FrameCard className="h-full min-w-0" withFill>
      <FrameCardContent className="gap-7 p-6">
        <div className="v2-card-tagline flex items-center gap-2">
          <FileText aria-hidden="true" className="size-4 shrink-0" />
          <h2 className="text-sm/normal font-normal">Top pages</h2>
        </div>
        <div className="space-y-2">
          <p className="break-all text-xl/normal font-normal tracking-tight">{top.path}</p>
          <p className="text-xs/normal text-muted-foreground">Top landing page · {top.visits.toLocaleString('en-US')} visits · {top.share.toFixed(0)}% of total</p>
        </div>
        <ol className="flex w-full flex-col gap-2" aria-label="Pages ranked by visits">
          {pages.map(({ path, visits, share }) => (
            <li key={path} className="relative isolate flex min-h-9 items-center justify-between gap-3 overflow-hidden rounded-md border px-3 py-1.5">
              <div aria-hidden="true" className="absolute inset-y-0 left-0 bg-secondary" style={{ width: `${share}%` }} />
              <span className="relative min-w-0 truncate text-sm" title={path}>{path}</span>
              <div className="relative flex shrink-0 items-center gap-2">
                <Badge variant="secondary">{visits.toLocaleString('en-US')} visits</Badge>
                <span className="text-xs text-muted-foreground">{share.toFixed(0)}%</span>
              </div>
            </li>
          ))}
        </ol>
      </FrameCardContent>
    </FrameCard>
  );
}
