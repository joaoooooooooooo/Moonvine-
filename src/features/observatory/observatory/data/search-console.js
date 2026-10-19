import { searchClicksSeries } from '../utils/search-clicks-series';

// Synthetic preview data derived from the selected account and report week.
const allocate = (total, weights) => {
  let remaining = total;
  return weights.map((weight, index) => {
    const value = index === weights.length - 1 ? remaining : Math.floor(total * weight);
    remaining -= value;
    return value;
  });
};
const sum = (rows, key) => rows.reduce((total, row) => total + row[key], 0);
const change = (current, previous) => previous ? `${((current / previous - 1) * 100).toFixed(1)}%` : '0%';

export function searchConsoleData(lens, account) {
  const clicks = searchClicksSeries(lens);
  const impressions = clicks.map((row, index) => ({ ...row, current: row.current * (18 + index), previous: row.previous * (20 + index) }));
  const totalClicks = sum(clicks, 'current');
  const totalImpressions = sum(impressions, 'current');
  const ctr = totalImpressions ? totalClicks / totalImpressions * 100 : 0;
  const previousCtr = sum(impressions, 'previous') ? sum(clicks, 'previous') / sum(impressions, 'previous') * 100 : 0;
  const rates = clicks.map((row, index) => ({ day: row.day, current: impressions[index].current ? row.current / impressions[index].current * 100 : 0, previous: impressions[index].previous ? row.previous / impressions[index].previous * 100 : 0 }));
  const positions = clicks.map((row, index) => ({ day: row.day, current: [8.1, 7.8, 8.2, 7.4, 7.2, 7.6, 7.3][index], previous: [9.2, 9.1, 9.4, 8.8, 8.6, 8.7, 8.5][index] }));
  const weights = [0.52, 0.19, 0.12, 0.08, 0.06, 0.03];
  const queryClicks = allocate(totalClicks, weights);
  const queryImpressions = allocate(totalImpressions, weights);
  const queries = [account.name.toLowerCase(), 'design studio', 'brand strategy', 'digital design', 'branding system', 'creative agency'].map((query, index) => ({ query, clicks: queryClicks[index], impressions: queryImpressions[index], ctr: queryImpressions[index] ? queryClicks[index] / queryImpressions[index] * 100 : 0, position: [1.3, 8.6, 12.4, 16.2, 23.8, 32.1][index] }));
  const distribution = (labels, shares) => allocate(totalClicks, shares).map((value, index) => ({ label: labels[index], value }));
  return {
    metrics: [
      { id: 'clicks', label: 'Search clicks', value: totalClicks.toLocaleString('en-US'), change: change(totalClicks, sum(clicks, 'previous')), data: clicks },
      { id: 'impressions', label: 'Impressions', value: totalImpressions.toLocaleString('en-US'), change: change(totalImpressions, sum(impressions, 'previous')), data: impressions },
      { id: 'ctr', label: 'Click-through rate', value: `${ctr.toFixed(2)}%`, change: `${ctr >= previousCtr ? '+' : ''}${(ctr - previousCtr).toFixed(2)} pp`, data: rates, percentage: true, description: 'The share of search appearances that became a visit.' },
      { id: 'position', label: 'Average position', value: (sum(positions, 'current') / positions.length).toFixed(1), change: '-1.2 places', data: positions, description: 'Average search position in this preview. A lower position is better.', improvement: true },
    ],
    queries,
    devices: distribution(['Desktop', 'Mobile', 'Tablet'], [0.68, 0.29, 0.03]),
    countries: distribution(['Brazil', 'United States', 'United Kingdom', 'Spain', 'Other'], [0.38, 0.27, 0.16, 0.11, 0.08]).map((row, index) => ({ ...row, countryCode: ['br', 'us', 'gb', 'es', null][index] })),
  };
}
