import { SectionDivider } from '../section-divider';

export function AiVisibilitySection({ id, title, description, children }) {
  return (
    <section aria-labelledby={id} className="space-y-10">
      <SectionDivider />
      <div className="min-w-0 space-y-8 pt-4">
          <div className="space-y-2">
            <h2 id={id} className="max-w-[32rem] font-heading text-2xl font-normal leading-tight tracking-tight sm:text-3xl">{title}</h2>
            {description && <p className="max-w-[36ch] text-base leading-6 text-muted-foreground">{description}</p>}
          </div>
          {children}
      </div>
    </section>
  );
}

