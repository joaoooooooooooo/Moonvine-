import { LineBackground } from '@/components/ui/line-background';

// The Reports section divider, sized to the V2 app inset.
export function SectionDivider() {
  return (
    <div aria-hidden="true" data-slot="observatory-section-divider" className="relative -mx-5 h-8 overflow-hidden border-y border-border md:-mx-8">
      <LineBackground angle="135deg" />
    </div>
  );
}
