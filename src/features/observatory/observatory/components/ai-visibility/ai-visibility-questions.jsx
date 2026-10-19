import { sampleQuestions } from './ai-visibility-content';
import { AiVisibilitySection } from './ai-visibility-section';
import { QuestionsTableContent } from '@/features/Reports/components/questionsAsked/components/questions-table-content';
import { ObservatoryTable } from '../observatory-table';

export function AiVisibilityQuestions({ account, surfaced }) {
  return (
    <AiVisibilitySection
      id="ai-visibility-questions"
      title={`These are the focused questions used to check ${account.name}'s visibility.`}
      description="Start with these five questions from the sample."
    >
      <ObservatoryTable label="Questions in the AI visibility sample">
        <QuestionsTableContent questions={sampleQuestions.map((text, index) => ({ id: `sample-${index + 1}`, text, type: 'Category discovery', mentions: index < surfaced ? 1 : 0 }))} />
      </ObservatoryTable>
    </AiVisibilitySection>
  );
}
