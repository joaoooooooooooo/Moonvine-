export function MetricComparison({ change, negative = false, label = 'Vs last week' }) {
  const tone = change == null ? 'text-muted-foreground' : negative ? 'text-destructive-foreground' : 'text-success-foreground';
  return <p className="text-xs/normal font-normal"><span className={tone}>{change ?? '\u2014'}</span>{' '}<span className="text-muted-foreground">{label}</span></p>;
}
