import { searchClicksSeries } from '../utils/search-clicks-series';
import { reportWeeks } from './report-weeks';

// Synthetic report data. Every breakdown reconciles to the same weekly visit total.
function distribute(total, weights) {
  let remaining = total;
  return weights.map((weight, index) => {
    const value = index === weights.length - 1 ? remaining : Math.round(total * weight);
    remaining -= value;
    return value;
  });
}

export function analyticsV2Data(lens, period = 'current') {
  const offset = reportWeeks.find((week) => week.value === period)?.offset ?? 0;
  const visits = searchClicksSeries(lens);
  const total = visits.reduce((sum, row) => sum + row.current, 0);
  const previous = visits.reduce((sum, row) => sum + row.previous, 0);
  const rate = 64.8 - offset * 0.7;
  const currentEngaged = distribute(Math.round(total * rate / 100), visits.map((row) => row.current / total));
  const previousEngaged = distribute(Math.round(previous * (rate - 2.4) / 100), visits.map((row) => row.previous / previous));
  const users = visits.map((row) => ({ ...row, current: Math.round(row.current * 0.78), previous: Math.round(row.previous * 0.8) }));
  const engagement = visits.map((row, index) => ({ day: row.day, current: +(currentEngaged[index] / row.current * 100).toFixed(1), previous: +(previousEngaged[index] / row.previous * 100).toFixed(1) }));
  const duration = visits.map((row, index) => ({ day: row.day, current: 92 + [3, -6, 5, 8, 1, -3, 6][index] - offset, previous: 84 + [1, -4, 5, 2, -3, 0, 4][index] - offset }));
  const channelNames = ['Organic search', 'Direct', 'Referral', 'Organic social', 'Email'];
  const channelValues = distribute(total, [0.46, 0.27, 0.14, 0.09, 0.04]);
  const paths = ['/', '/work', '/services', '/about', '/insights'];
  const landingValues = distribute(total, [0.39, 0.26, 0.18, 0.11, 0.06]);
  const metricTotals = (rows) => rows.reduce((sum, row) => sum + row.current, 0);
  const userPrevious = users.reduce((sum, row) => sum + row.previous, 0);
  const averageDuration = Math.round(duration.reduce((sum, row, index) => sum + row.current * visits[index].current, 0) / total);
  const previousDuration = Math.round(duration.reduce((sum, row, index) => sum + row.previous * visits[index].previous, 0) / previous);
  return {
    total,
    metrics: [
      { id: 'visits', label: 'Visits', value: total.toLocaleString('en-US'), change: `${((total / previous - 1) * 100).toFixed(1)}%`, data: visits },
      { id: 'users', label: 'Active users', value: metricTotals(users).toLocaleString('en-US'), change: `${((metricTotals(users) / userPrevious - 1) * 100).toFixed(1)}%`, data: users },
      { id: 'engagement', label: 'Engagement rate', value: `${rate.toFixed(1)}%`, change: '+2.4 pp', data: engagement, percentage: true },
      { id: 'duration', label: 'Average engagement', value: `${Math.floor(averageDuration / 60)}m ${averageDuration % 60}s`, change: `+${averageDuration - previousDuration}s`, data: duration, unit: 'seconds' },
    ],
    channels: channelNames.map((label, index) => ({ label, value: channelValues[index], share: channelValues[index] / total * 100 })),
    landingPages: paths.map((path, index) => ({ path, visits: landingValues[index], share: landingValues[index] / total * 100, engagement: [68.4, 72.1, 61.6, 56.2, 48.9][index] })),
    devices: ['Desktop', 'Mobile', 'Tablet'].map((label, index) => ({ label, value: distribute(total, [0.58, 0.39, 0.03])[index] })),
    countries: ['United States', 'United Kingdom', 'Brazil', 'Canada', 'Other'].map((label, index) => ({ label, countryCode: ['us', 'gb', 'br', 'ca', null][index], value: distribute(total, [0.41, 0.22, 0.18, 0.11, 0.08])[index] })),
  };
}
