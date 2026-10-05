import { ChevronRight } from '@/components/ui/icons';

export function CardCaret({ href, label, iconClassName = 'size-4' }) {
  const icon = <ChevronRight aria-hidden="true" weight="regular" className={iconClassName} />;
  return href
    ? <a href={href} aria-label={label} data-card-caret className="shrink-0 rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">{icon}</a>
    : <span data-card-caret className="shrink-0 text-muted-foreground">{icon}</span>;
}
