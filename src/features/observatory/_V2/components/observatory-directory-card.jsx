import { ChevronRight } from 'lucide-react';
import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import overviewArtwork from '../assets/Overview.svg';
import reportsArtwork from '../assets/Reports.svg';
import peopleArtwork from '../assets/People.svg';
import entitiesArtwork from '../assets/Entities.svg';

const artwork = {
  accounts: overviewArtwork,
  chat: overviewArtwork,
  reports: reportsArtwork,
  people: peopleArtwork,
  entities: entitiesArtwork,
};

export function ObservatoryDirectoryCard({ id, label, detail, mobileDetail, href = '#/console/' + id }) {
  return (
    <FrameCard render={<a href={href} />} withFill className="aspect-square min-w-0 overflow-hidden outline-none">
      <FrameCardContent className="relative h-full items-start justify-start gap-7 p-6 text-start">
        <img
          src={artwork[id]}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 size-[85%] select-none object-contain opacity-60"
          style={{ maskImage: 'linear-gradient(135deg, black 30%, transparent 100%)' }}
        />
        <div className="v2-card-tagline relative z-10 flex items-center justify-between gap-3">
          <h2 className="text-sm/normal font-normal">{label}</h2>
          <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        </div>
        <p className="relative z-10 text-xl/normal font-normal tracking-tight">
          <span className="sm:hidden">{mobileDetail ?? detail}</span>
          <span className="hidden sm:inline">{detail}</span>
        </p>
      </FrameCardContent>
    </FrameCard>
  );
}
