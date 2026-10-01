import { ProviderCoverage } from './provider-coverage';

const visibilityColors = {
  bad: 'text-destructive-foreground',
  warning: 'text-warning-foreground',
  good: 'text-success-foreground',
};

export function AiVisibilitySummary({ account, lens, period }) {
  const total = lens.sampleQuestions;
  const surfaced = Math.round(total * lens.value / 100);
  const tone = lens.value >= 60 ? 'good' : lens.value >= 30 ? 'warning' : 'bad';

  return (
    <section aria-labelledby="ai-visibility-heading" className="space-y-10">
      <div className="space-y-2">
          <h1 id="ai-visibility-heading" className="max-w-[32rem] font-heading text-3xl font-normal leading-tight tracking-tight sm:text-4xl">
            {account.name} surfaced in <span className={visibilityColors[tone]}>{surfaced} of {total}</span> focused AI questions.
          </h1>
        <p className="max-w-[45ch] text-base leading-6 text-muted-foreground">
          We checked focused questions across ChatGPT, Gemini, and Perplexity to see how often {account.name} appeared in the answers.
        </p>
      </div>
      <ProviderCoverage providers={lens.providerCoverage} period={period} />
    </section>
  );
}
