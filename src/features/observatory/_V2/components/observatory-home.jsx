import { ChevronRight } from 'lucide-react';
import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { directorySurfaces } from '../data/navigation';
import { PageHeading } from './page-heading';
import './signals-grid.css';

export function ObservatoryHome() {
  return (
    <div className="space-y-6 [&>:first-child]:pb-4">
      <PageHeading title="Welcome back to Observatory." />
      <nav aria-label="Observatory directory" className="space-y-3">
        <div className="v2-signals-grid grid gap-3 sm:grid-cols-2">
        {directorySurfaces.map(({ id, label, detail, icon: Icon }) => (
          <FrameCard key={id} render={<a href={'#/console/' + id} />} withFill className="h-full min-w-0 outline-none">
            <FrameCardContent className="h-full min-h-60 items-start justify-start gap-7 p-6 text-start">
              <div className="v2-card-tagline flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-sm/normal font-normal"><Icon aria-hidden="true" className="size-4 shrink-0" />{label}</h2><ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" /></div>
              <p className="text-xl/normal font-normal tracking-tight">{detail}</p>

            </FrameCardContent>
          </FrameCard>
        ))}
        </div>
      </nav>
    </div>
  );
}
