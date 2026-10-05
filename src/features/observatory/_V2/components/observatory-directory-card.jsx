import { CardCaret } from './card-caret';
import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import overviewArtwork from '../assets/Overview.svg?raw';
import reportsArtwork from '../assets/Reports.svg?raw';
import peopleArtwork from '../assets/People.svg?raw';
import entitiesArtwork from '../assets/Entities.svg?raw';

const artwork = Object.fromEntries(Object.entries({
  accounts: overviewArtwork,
  chat: overviewArtwork,
  reports: reportsArtwork,
  people: peopleArtwork,
  entities: entitiesArtwork,
}).map(([id, svg]) => [id, svg
  .replaceAll(/stroke="[^"]+"/g, 'stroke="var(--muted-foreground)" vector-effect="non-scaling-stroke"')
  .replaceAll(/stroke-width="[^"]+"/g, 'stroke-width="1"')
  .replace('<svg ', '<svg stroke-width="1" ')]));

export function ObservatoryDirectoryCard({ id, icon: Icon, label, detail, mobileDetail, href = '#/console/' + id }) {
  return (
    <FrameCard render={<a href={href} />} withFill className="v2-interactive-card aspect-square min-w-0 overflow-hidden outline-none">
      <FrameCardContent className="relative h-full items-start justify-start gap-7 p-6 text-start">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-0 size-[85%] select-none [&>svg]:size-full"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, rgb(0 0 0 / 15%) 40%, black 85%), linear-gradient(135deg, black 30%, transparent 100%)',
            maskComposite: 'intersect',
          }}
          dangerouslySetInnerHTML={{ __html: artwork[id] }}
        />
        <div className="v2-card-tagline relative z-10 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm/normal font-normal">
            {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
            {label}
          </h2>
          <CardCaret iconClassName="size-3.5" />
        </div>
        <p className="relative z-10 text-xl/normal font-normal tracking-tight">
          <span className="sm:hidden">{mobileDetail ?? detail}</span>
          <span className="hidden sm:inline">{detail}</span>
        </p>
      </FrameCardContent>
    </FrameCard>
  );
}
