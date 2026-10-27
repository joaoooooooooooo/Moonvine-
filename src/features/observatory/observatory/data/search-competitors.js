import { sourcePresentation } from './source-presentation';
import { visitorBreakdown, visitorPeriods } from './visitor-breakdown';

export const searchCompetitorPeriods = visitorPeriods;

// Reuse the preview's period allocation; preserve organization identity across windows.
export function searchCompetitorBreakdown(lens, account, period, reportPeriod) {
  const rows = searchCompetitorRows(lens, account);
  const data = visitorBreakdown(rows.map(row => ({ label: row.name, value: row.count })), period, lens.delta, reportPeriod);
  return { ...data, items: data.items.map(item => ({
    ...item,
    imageSrc: rows.find(row => row.name === item.label)?.image,
    color: `var(--chart-${lens.rows.findIndex(([name]) => name === item.label) % 5 + 1})`,
  })) };
}

// Explicit relationships for the synthetic preview; overlap alone is not a competitor signal.
const competitorNames = new Set(['Studio Field', 'Form & Matter']);

export function searchCompetitorRows(lens, account) {
  const total = lens.rows.reduce((sum, [, count]) => sum + count, 0);
  return lens.rows.filter(([name]) => name !== account.name)
    .map(([name, count]) => ({
      name, count,
      image: sourcePresentation.competitors.profiles[name],
      isCompetitor: competitorNames.has(name),
      share: total ? count / total * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
