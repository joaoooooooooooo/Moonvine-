import { useSectionReveal } from '@/hooks/use-section-reveal';

export function IntelligenceReveal({ children }) {
  const revealRef = useSectionReveal({ includeSections: true });

  return <div ref={revealRef} className="min-w-0">{children}</div>;
}
