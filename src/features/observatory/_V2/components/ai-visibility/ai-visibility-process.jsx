import { AiVisibilitySection } from './ai-visibility-section';

const steps = [
  ['Ask', 'Send the saved questions to the supported AI providers.'],
  ['Check', 'Record the organizations and checkable sources in each answer.'],
  ['Repeat', 'Run the same questions again to show what changed.'],
];

export function AiVisibilityProcess() {
  return (
    <AiVisibilitySection
      id="ai-visibility-process"
      title="The same benchmark runs each period."
      description="Repeating the same practical questions makes changes in visibility and sources easier to see."
    >
      <ol className="grid gap-5 sm:grid-cols-3">
        {steps.map(([label, description]) => (
          <li key={label} className="space-y-2">
            <h3 className="text-sm/normal font-medium text-muted-foreground">{label}</h3>
            <p className="text-base font-medium leading-6">{description}</p>
          </li>
        ))}
      </ol>
    </AiVisibilitySection>
  );
}
