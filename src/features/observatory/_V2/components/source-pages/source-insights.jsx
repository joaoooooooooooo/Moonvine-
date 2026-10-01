import { SectionHeading } from '../section-heading';
import { SectionDivider } from '../section-divider';

export function SourceInsights({ lens, presentation }) {
  return (
    <section aria-labelledby={`${lens.id}-insights`} className="space-y-10">
      <SectionDivider />
      <SectionHeading id={`${lens.id}-insights`} title={presentation.insights} description={presentation.description} />
      <ul className="space-y-6">
        {lens.evidence.map((text) => <li key={text} className="max-w-[45ch] text-base leading-6 text-muted-foreground">{text}</li>)}
      </ul>
    </section>
  );
}
