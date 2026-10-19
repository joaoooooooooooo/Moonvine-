import { reportWeeks, weekDate } from './report-weeks.js';

export const visitorPeriods = [{ id: 'current', label: 'This Week' }, { id: 'previous', label: 'Last Week' }, { id: '30d', label: '30d' }];

// Synthetic preview windows ending at the selected report week.
// Seven days preserves the supplied source values; longer periods change mix.
const windows = {
  current: { days: 7, factors: [1, 1, 1, 1, 1] },
  previous: { days: 7, factors: [0.7, 1.5, 1.1, 1.3, 1] },
  '30d': { days: 30, factors: [0.7, 1.5, 1.1, 1.3, 1] },
};

export function visitorBreakdown(rows, period = 'current', delta = 0, reportPeriod = 'current') {
  const window = windows[period] ?? windows.current;
  const growth = 1 + delta / 100;
  const scale = period === 'previous' && growth > 0 ? 1 / growth : window.days / 7;
  const total = Math.round(rows.reduce((sum, row) => sum + row.value, 0) * scale);
  const weights = rows.map((row, index) => row.value * (window.factors[index] ?? 1));
  const weightTotal = weights.reduce((sum, value) => sum + value, 0);
  let allocated = 0;
  const items = rows.map((row, index) => {
    const value = period === 'current' ? row.value : index === rows.length - 1 ? total - allocated : weightTotal ? Math.floor(total * weights[index] / weightTotal) : 0;
    allocated += value;
    return { id: row.label, label: row.label, value, color: `var(--chart-${index % 5 + 1})` };
  });
  const previous = growth > 0 ? Math.round(total / growth) : 0;
  const report = reportWeeks.find((week) => week.value === reportPeriod) ?? reportWeeks[0];
  const end = weekDate(report.start);
  end.setDate(end.getDate() + (period === 'previous' ? -1 : 6));
  const month = end.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  return { items, month, delta: previous ? (total / previous - 1) * 100 : 0, comparison: period === '30d' ? 'Vs previous 30d' : period === 'previous' ? 'Vs prior week' : 'Vs last week' };
}
