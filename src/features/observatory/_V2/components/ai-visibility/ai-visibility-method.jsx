import { AiVisibilitySection } from './ai-visibility-section';

export function AiVisibilityMethod({ lens }) {
  const verifiedAnswers = lens.providerCoverage.reduce((sum, provider) => sum + provider.completed, 0);
  const metrics = [
    ['Questions', lens.sampleQuestions],
    ['Verified answers', verifiedAnswers],
    ['Website citations', lens.websiteCitations],
  ];
  return (
    <AiVisibilitySection
      id="ai-visibility-method"
      title="We ran a focused AI-answer census across the supported providers."
      description={`The same ${lens.sampleQuestions} questions were checked with each provider. This view records which organizations appeared and which sources the answers used.`}
    >
      <dl className="flex flex-wrap gap-6">
        {metrics.map(([label, value]) => <div key={label} className="flex flex-col gap-2"><dt className="text-sm/normal text-muted-foreground">{label}</dt><dd className="order-first"><h1 className="font-heading text-3xl font-normal leading-tight tracking-tight tabular-nums sm:text-4xl">{value}</h1></dd></div>)}
      </dl>
    </AiVisibilitySection>
  );
}
