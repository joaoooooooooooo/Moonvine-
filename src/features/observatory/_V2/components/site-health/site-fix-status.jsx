import { Badge } from '@/components/ui/badge';

export function SiteFixStatus({ count }) {
  if (!count) return null;

  return <span className="inline-flex shrink-0 items-center overflow-visible!">
    <span aria-hidden="true" className="relative size-[7px] rounded-full bg-warning-foreground before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-warning-foreground before:opacity-75 motion-reduce:before:animate-none group-hover/site-health:hidden group-focus-visible/site-health:hidden" />
    <Badge variant="warning" aria-hidden="true" className="hidden tabular-nums group-hover/site-health:inline-flex group-focus-visible/site-health:inline-flex">{count} {count === 1 ? 'issue' : 'issues'}</Badge>
    <span className="sr-only">{count} {count === 1 ? 'site issue to fix' : 'site issues to fix'}</span>
  </span>;
}
