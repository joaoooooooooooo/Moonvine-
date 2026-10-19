// Qualitative summaries for synthetic V2 reports, not production scoring.
const signedMetric = metric => ({ ...metric, change: /^[+-]/.test(metric.change) ? metric.change : `+${metric.change}`, negative: metric.change.startsWith('-') });
const trafficVibe = metrics => {
  const changes = metrics.map(metric => Number.parseFloat(metric.change));
  return changes.some(change => change <= -30) ? 'At risk' : changes.some(change => change < 0) ? 'Watch' : 'Healthy';
};
export function analyticsSummary(data) {
  const visits = data.metrics.find(metric => metric.id === 'visits');
  const engagement = data.metrics.find(metric => metric.id === 'engagement');
  const leading = data.channels.reduce((best, row) => row.value > best.value ? row : best);
  return {
    status: trafficVibe([visits, engagement]),
    headline: Number.parseFloat(visits.change) >= 0 ? 'Traffic grew this week.' : 'Traffic softened this week.',
    description: `${leading.label} contributed the largest share of visits.`,
    result: 'Engagement across your visits',
    resultDescription: 'The share of visits that included meaningful activity.',
    metric: signedMetric(engagement),
    next: 'Make the next step clear on your homepage',
    reason: `It received ${data.landingPages[0].share.toFixed(0)}% of entrances. Keep a clear route to your work and services.`,
  };
}
export function searchSummary(data) {
  const clicks = data.metrics.find(metric => metric.id === 'clicks');
  const impressions = data.metrics.find(metric => metric.id === 'impressions');
  const leading = data.queries.reduce((best, row) => row.clicks > best.clicks ? row : best);
  return {
    status: trafficVibe([clicks, impressions]),
    headline: Number.parseFloat(clicks.change) >= 0 ? 'Search clicks grew this week.' : 'Search clicks softened this week.',
    description: `“${leading.query}” earned the most recorded search clicks.`,
    result: 'Your visibility in Google Search',
    resultDescription: 'How often your pages appeared in search results.',
    metric: signedMetric(impressions),
    next: 'Review your high-impression queries',
    reason: 'Compare appearances with clicks, then check whether your page titles match the search intent.',
  };
}
