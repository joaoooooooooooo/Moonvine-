import { lensDefinitions } from '../data/observatory-fixtures';
import { reportWeeks } from '../data/report-weeks';

export function accountHref(id, lensId = '', period = '') {
  const params = new URLSearchParams();
  if (lensId) params.set('lens', lensId);
  if (period && period !== 'current') params.set('period', period);
  const query = params.toString();
  return '#/intelligence/client/' + encodeURIComponent(id) + '/current' + (query ? '?' + query : '');
}
export function formatMetric(value, unit = '') {
  return value == null ? '\u2014' : new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value) + unit;
}
export function buildLenses(account, period = 'current') {
  const offset = reportWeeks.find((week) => week.value === period)?.offset ?? 0;
  return lensDefinitions.map((lens) => {
    const factor = lens.unit ? Math.min(account.multiplier, 1.02) : account.multiplier;
    const scale = (value) => {
      const current = value * factor;
      const amount = lens.unit ? current - lens.delta * offset : current / (1 + lens.delta / 100) ** offset;
      return Math.max(0, Math.round(lens.unit ? Math.min(amount, 100) : amount));
    };
    // The demo provider percentages and check totals supply the displayed mention counts.
    const providerCoverage = lens.providerCoverage?.map((provider) => {
      const providerRate = lens.rows.find(([name]) => name === provider.name)?.[1];
      if (providerRate == null) return provider;
      const currentRate = scale(providerRate);
      const previousRate = Math.max(0, Math.min(100, currentRate - lens.delta));
      return { ...provider,
        mentions: Math.round(provider.completed * currentRate / 100),
        previousMentions: Math.round(provider.completed * previousRate / 100),
      };
    });
    return { ...lens, providerCoverage, value: scale(lens.value), rows: lens.rows.map(([label, amount]) => [label, scale(amount)]),
      summary: formatMetric(scale(lens.value), lens.unit) + ' ' + lens.metric.toLowerCase() + '.' };
  });
}

