// Sample daily engagement percentages, weighted by visits for the weekly rate.
export function engagementSeries(visits) {
  const currentRates = [58, 64, 61, 68, 72, 69, 66];
  const previousRates = [54, 60, 58, 62, 67, 65, 61];
  const data = visits.map(({ day }, index) => ({ day, current: currentRates[index], previous: previousRates[index] }));
  const weightedRate = (key) => {
    const total = visits.reduce((sum, item) => sum + item[key], 0);
    return total ? visits.reduce((sum, item, index) => sum + item[key] * data[index][key], 0) / total : 0;
  };
  const current = weightedRate('current');
  const difference = current - weightedRate('previous');
  return { data, value: `${current.toFixed(1)}%`, change: `${difference >= 0 ? '+' : ''}${difference.toFixed(1)} pp` };
}
