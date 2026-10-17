import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { referenceSources } from './ai-visibility-content';
import '../signals-grid.css';

export function AiVisibilityBenchmark({ lens }) {
  const surfaced = Math.round(lens.sampleQuestions * lens.value / 100);
  const providers = lens.providerCoverage ?? [];
  const completed = providers.reduce((sum, provider) => sum + provider.completed, 0);
  const leadingSource = referenceSources.reduce((best, source) => !best || source.count > best.count ? source : best, null);
  const insights = [
    {
      label: 'Vibes',
      title: surfaced === 0 ? 'Not named in this benchmark' : `Named in ${surfaced} of ${lens.sampleQuestions} questions`,
      description: `${completed} completed checks across ${providers.map(provider => provider.name).join(', ')}.`,
    },
    {
      label: 'Most visible result',
      title: leadingSource ? `${leadingSource.name} led the cited sources` : 'No cited sources yet',
      description: 'Based on the sampled answers in this preview benchmark.',
    },
    {
      label: 'Priority',
      title: 'Review the questions and cited sources',
      description: 'Use the question and source evidence below to decide where to act.',
    },
  ];

  return <section aria-label="AI visibility benchmark summary" className="v2-signals-grid">
    <FrameCard withFill className="w-full overflow-hidden">
      <FrameCardContent className="p-0!">
        <dl className="grid w-full divide-y divide-border bg-linear-to-r from-warning/20 via-warning/10 to-destructive/15 md:grid-cols-3 md:divide-x md:divide-y-0">
          {insights.map(insight => <div key={insight.label} className="min-w-0 space-y-2 p-5">
            <dt className="text-sm/normal font-medium text-foreground">{insight.label}</dt>
            <dd className="space-y-2">
              <p className="text-lg/normal font-medium tabular-nums">{insight.title}</p>
              <p className="text-sm/normal text-muted-foreground tabular-nums">{insight.description}</p>
            </dd>
          </div>)}
        </dl>
      </FrameCardContent>
    </FrameCard>
  </section>;
}
