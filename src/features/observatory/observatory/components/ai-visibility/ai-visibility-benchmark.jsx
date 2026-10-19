import { ReportSignalSummary } from '../report-signal-summary';
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

  return <section aria-label="AI visibility benchmark summary">
    <ReportSignalSummary data={{
      // Reuse the existing preview's 60/30 visibility bands.
      status: lens.value >= 60 ? 'Healthy' : lens.value >= 30 ? 'Watch' : 'Critical',
      headline: insights[0].title, description: insights[0].description,
      result: insights[1].title, resultDescription: insights[1].description,
      next: insights[2].title, reason: insights[2].description,
    }} />
  </section>;
}
