import { trendHeadline } from '../../data/section-insights';
import { SectionHeading } from '../section-heading';
import { ProviderCoverage } from './provider-coverage';
import { AiVisibilityBenchmark } from './ai-visibility-benchmark';

export function AiVisibilitySummary({ account, lens, period }) {
  return (
    <section aria-labelledby="ai-visibility-heading" className="space-y-10">
      <div className="space-y-2">
          <h1 id="ai-visibility-heading" className="max-w-[32rem] font-heading text-3xl font-normal leading-tight tracking-tight sm:text-4xl">
            See how AI talks about your brand.
          </h1>
        <p className="max-w-[36ch] text-base leading-6 text-muted-foreground">
          We checked focused questions across ChatGPT, Gemini, and Perplexity to see how often {account.name} appeared in the answers.
        </p>
      </div>
      <div className="space-y-10"><SectionHeading title={trendHeadline(lens.delta, { up: 'Your brand is gaining ground in AI answers.', down: 'Your brand is losing ground in AI answers.', steady: 'Your AI visibility is holding steady.' })} /><AiVisibilityBenchmark lens={lens} /></div>
      <ProviderCoverage providers={lens.providerCoverage} period={period} />
    </section>
  );
}

