import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { RankItem } from '@/features/Reports/components/rankEntities/components/rankItem';

export function RankedSourcesList({ title, items, competitorNames = [], accountName }) {
  const total = items.reduce((sum, { count }) => sum + count, 0);
  return (
    <FrameCard className="h-full min-w-0" withFill>
      <FrameCardContent className="h-full gap-7 p-6">
        <div className="v2-card-tagline"><h3 className="text-sm/normal font-normal">{title}</h3></div>
        <ol aria-label={title} className="flex w-full flex-col gap-2">
          {items.map(({ name, count, imageSrc }) => {
            const share = total ? count / total * 100 : 0;
            return <RankItem key={name} label={name} imageSrc={imageSrc} value={count} valueLabel="answers" fillPercentage={share}
              isCompetitor={name !== accountName && competitorNames.includes(name)}
              percentageLabel={`${share.toFixed(0)}%`}
              className="min-h-12 rounded-md bg-transparent px-3 py-2 [&_p]:text-sm"
            />;
          })}
        </ol>
      </FrameCardContent>
    </FrameCard>
  );
}
