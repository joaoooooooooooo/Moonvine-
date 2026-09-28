export function SignalMetric({ value, label, change, negative = false, align = 'bottom' }) {
  const tone = negative ? 'text-destructive-foreground' : 'text-success-foreground';
  return (
    <div className={`flex w-full flex-col items-start gap-2 ${align === 'bottom' ? 'mt-auto' : ''}`}>
      <p className="min-w-0 text-xl/normal font-normal tracking-tight text-foreground">{value}{' '}{label}</p>
      <p className="text-xs/normal font-normal"><span className={tone}>{change}</span>{' '}<span className="text-muted-foreground">Vs last week</span></p>
    </div>
  );
}
