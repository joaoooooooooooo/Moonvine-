import { Badge } from '@/components/ui/badge';

export function ReportStatusDot({ unread, count = 0 }) {
  return (
    <span className="inline-flex shrink-0 items-center overflow-visible!">
      <span aria-hidden="true" className={unread
        ? 'relative size-[7px] rounded-full bg-info-foreground group-hover/report-status:hidden group-focus-visible/report-status:hidden'
        : 'size-[7px] rounded-full bg-muted-foreground'} />
      {unread && <Badge variant="info" size="lg" aria-hidden="true" className="hidden tabular-nums group-hover/report-status:inline-flex group-focus-visible/report-status:inline-flex">{count} unread</Badge>}
      <span className="sr-only">{unread ? 'Unread report' : 'Opened report'}</span>
    </span>
  );
}
