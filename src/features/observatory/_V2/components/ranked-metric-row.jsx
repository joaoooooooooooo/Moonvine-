import { Badge } from '@/components/ui/badge';

export function RankedMetricRow({ label, value, share, unit, shareLabel }) {
  const percentage = Math.max(0, Math.min(100, share));
  return (
    <li className="relative isolate flex min-h-9 items-center justify-between gap-3 overflow-hidden rounded-md border px-3 py-1.5">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 bg-secondary" style={{ width: `${percentage}%` }} />
      <span className="relative min-w-0 truncate text-sm" title={label}>{label}</span>
      <div className="relative flex shrink-0 items-center gap-2">
        <Badge variant="secondary">{value.toLocaleString('en-US')} {unit}</Badge>
        <span className="text-xs tabular-nums text-muted-foreground" title={shareLabel}>{percentage.toFixed(0)}%</span>
      </div>
    </li>
  );
}
