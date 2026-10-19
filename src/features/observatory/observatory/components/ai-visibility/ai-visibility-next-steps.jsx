import { sampleQuestions } from './ai-visibility-content';
import { AiVisibilitySection } from './ai-visibility-section';

export function AiVisibilityNextSteps({ account }) {
  return (
    <AiVisibilitySection
      id="ai-visibility-next-steps"
      title={`Start with the questions that matter for ${account.name}.`}
      description="Check whether the website answers these questions clearly, then compare its pages with the sources used in the AI answers."
    >
      <ol className="divide-y divide-border border-t border-border">
        {sampleQuestions.slice(0, 3).map((question, index) => (
          <li key={question} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 py-5">
            <span className="text-sm tabular-nums text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
            <div className="space-y-1">
              <h3 className="text-base font-medium">{question}</h3>
              <p className="text-base text-muted-foreground">Check whether the website has a clear, useful page for this question.</p>
            </div>
          </li>
        ))}
      </ol>
    </AiVisibilitySection>
  );
}
