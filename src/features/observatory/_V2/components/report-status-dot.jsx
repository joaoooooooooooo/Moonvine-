export function ReportStatusDot({ unread }) {
  return (
    <span className="inline-flex shrink-0 items-center overflow-visible!">
      <span aria-hidden="true" className={unread
        ? 'relative size-[7px] rounded-full bg-success-foreground before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-success-foreground before:opacity-75 motion-reduce:before:animate-none'
        : 'size-[7px] rounded-full bg-muted-foreground'} />
      <span className="sr-only">{unread ? 'Unread report' : 'Opened report'}</span>
    </span>
  );
}
