import { coverageHeadline } from '../../data/section-insights';
import { sampleQuestions } from './ai-visibility-content';
import { AiVisibilitySection } from './ai-visibility-section';
import { QuestionsTableContent } from '@/features/Reports/components/questionsAsked/components/questions-table-content';
import { ObservatoryTable } from '../observatory-table';

export function AiVisibilityQuestions({ visibility }) {
  const surfaced = Math.round(sampleQuestions.length * visibility / 100);
  return (
    <AiVisibilitySection
      id="ai-visibility-questions"
      title={coverageHeadline(surfaced, sampleQuestions.length, { all: 'Your brand appears across the sampled questions.', most: 'Your brand appears in most sampled questions.', some: 'Your brand is missing from many sampled answers.', none: 'Your brand is absent from the sampled answers.', empty: 'There are no sampled answers yet.' })}
      description="Start with these five questions from the sample."
    >
      <ObservatoryTable label="Questions in the AI visibility sample">
        <QuestionsTableContent questions={sampleQuestions.map((text, index) => ({ id: `sample-${index + 1}`, text, type: 'Category discovery', mentions: index < surfaced ? 1 : 0 }))} />
      </ObservatoryTable>
    </AiVisibilitySection>
  );
}
