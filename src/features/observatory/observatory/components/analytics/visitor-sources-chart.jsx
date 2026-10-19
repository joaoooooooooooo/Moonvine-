import { useState } from 'react';
import { Route } from '@/components/ui/icons';
import { CompactBreakdown } from '@/components/ui/compact-breakdown';
import { MetricComparison } from '../metric-comparison';
import { visitorBreakdown, visitorPeriods } from '../../data/visitor-breakdown';

export function VisitorSourcesChart({ lens, rows, dataReady = true, reportPeriod = 'current' }) {
  const [period, setPeriod] = useState('current');
  const channels = rows ?? lens.rows.map(([label, value]) => ({ label, value }));
  const data = visitorBreakdown(channels.map((row) => ({ ...row, value: dataReady ? row.value : 0 })), period, lens.delta, reportPeriod);
  return <CompactBreakdown
    title="Visitors by channel"
    icon={<Route weight="regular" />}
    totalLabel="Total visits"
    periods={visitorPeriods}
    period={period}
    onPeriodChange={setPeriod}
    items={data.items}
    month={data.month}
    comparison={<MetricComparison change={`${data.delta >= 0 ? '+' : ''}${data.delta.toFixed(1)}%`} negative={data.delta < 0} label={data.comparison} />}
  />;
}
