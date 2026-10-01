import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { ProviderLogo } from './provider-logo';
import { MetricComparison } from '../metric-comparison';
import '../signals-grid.css';

export function ProviderCoverage({ providers, period = 'current' }) {
  const currentLabel = period === 'previous' ? 'last week' : 'this week';
  const previousLabel = period === 'previous' ? 'the week before' : 'last week';
  return (
    <section aria-label="Provider coverage" className="v2-signals-grid grid items-stretch gap-3 sm:grid-cols-3">
      {providers.map(({ name, completed, planned, mentions, previousMentions }) => (
        <FrameCard key={name} className="h-full min-w-0" withFill>
          <FrameCardContent className="h-full gap-7 p-6">
            <div className="v2-card-tagline">
              <h3 className="flex items-center gap-2 text-sm/normal font-normal"><ProviderLogo name={name} />{name}</h3>
            </div>
            <div className="mt-auto space-y-2">
              <p className="text-xl/normal font-normal tabular-nums tracking-tight">{completed}<span className="text-muted-foreground">/{planned} checks</span></p>
              <p className="text-sm/normal tabular-nums">{mentions ?? '\u2014'} mentions {currentLabel}</p>
              <MetricComparison
                change={mentions == null || previousMentions == null ? null : `${mentions >= previousMentions ? '+' : ''}${mentions - previousMentions} mentions`}
                negative={mentions != null && previousMentions != null && mentions < previousMentions}
                label={`Vs ${previousLabel}`}
              />
            </div>
          </FrameCardContent>
        </FrameCard>
      ))}
    </section>
  );
}
