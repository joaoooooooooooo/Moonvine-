import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { RankItem } from '@/features/Reports/components/rankEntities/components/rankItem';
import { RankedMetricRow } from '../ranked-metric-row';
import { lensIcons } from '../../data/navigation';

export function SourceBreakdown({ lens, presentation, account }) {
  const Icon = lens.id === 'social' || lens.id === 'news' ? lensIcons[lens.id] : null;
  const total = lens.rows.reduce((sum, [, value]) => sum + value, 0);
  return (
    <FrameCard className="h-full min-w-0" withFill>
      <FrameCardContent className="h-full gap-7 p-6">
        <div className="v2-card-tagline flex items-center gap-2">
          {Icon && <Icon aria-hidden="true" weight="regular" className="size-4 shrink-0" />}
          <h2 className="text-sm/normal font-normal">{presentation.breakdown}</h2>
        </div>
        <h3 className="max-w-[32rem] font-heading text-xl font-normal leading-tight tracking-tight">Percentages show each item’s share of the listed {presentation.unit}.</h3>
        <ol aria-label={presentation.breakdown} className="flex w-full flex-col gap-2">
          {[...lens.rows].sort((a, b) => b[1] - a[1]).map(([name, value]) => {
            const share = total ? value / total * 100 : 0;
            return presentation.profiles ? (
              <RankItem key={name} label={name} imageSrc={presentation.profiles[name]} value={value.toLocaleString('en-US')}
                valueLabel={presentation.unit} fillPercentage={share} percentageLabel={`${Math.round(share)}%`}
                isCompetitor={lens.id === 'competitors' && name !== account.name}
                className="min-h-12 rounded-md bg-transparent px-3 py-2 [&_p]:text-sm" />
            ) : <RankedMetricRow key={name} label={name} value={value} share={share} unit={presentation.unit} />;
          })}
        </ol>
      </FrameCardContent>
    </FrameCard>
  );
}
