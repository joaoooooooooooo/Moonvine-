import { ChevronRight } from 'lucide-react';

export function CardCaret({ href, label }) {
  const icon = <ChevronRight aria-hidden="true" className="size-4" />;
  return href
    ? <a href={href} aria-label={label} className="shrink-0 rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">{icon}</a>
    : <span className="shrink-0 text-muted-foreground">{icon}</span>;
}
