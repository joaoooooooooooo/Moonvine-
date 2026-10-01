import { MetricComparison } from './metric-comparison';

export function SignalMetric({ value, label, change, negative = false, align = 'bottom' }) {
  return (
    <div className={`flex w-full flex-col items-start gap-2 ${align === 'bottom' ? 'mt-auto' : ''}`}>
      <p className="min-w-0 text-xl/normal font-normal tracking-tight text-foreground">{value}{' '}{label}</p>
      <MetricComparison change={change} negative={negative} />
    </div>
  );
}
