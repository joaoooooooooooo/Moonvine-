import { FileText } from '@/components/ui/icons';
import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { RankedMetricRow } from '../ranked-metric-row';
import { analyticsTopPages } from '../../data/analytics-top-pages';

// Adapted from Reports RankItem for landing-page paths and visit shares.
export function TopPagesChart({ total }) {
  const pages = analyticsTopPages(total);
  const top = pages[0];
  return (
    <FrameCard className="h-full min-w-0" withFill>
      <FrameCardContent className="gap-7 p-6">
        <div className="v2-card-tagline flex items-center gap-2">
          <FileText aria-hidden="true" weight="regular" className="size-4 shrink-0" />
          <h2 className="text-sm/normal font-normal">Top pages</h2>
        </div>
        <div className="space-y-2">
          <p className="break-all text-xl/normal font-normal tracking-tight">{top.path}</p>
          <p className="text-xs/normal text-muted-foreground">Top landing page · {top.visits.toLocaleString('en-US')} visits · {top.share.toFixed(0)}% of total</p>
        </div>
        <ol className="flex w-full flex-col gap-2" aria-label="Pages ranked by visits">
          {pages.map(({ path, visits, share }) => (
            <RankedMetricRow key={path} label={path} value={visits} share={share} unit="visits" shareLabel="Share of total visits" />
          ))}
        </ol>
      </FrameCardContent>
    </FrameCard>
  );
}
