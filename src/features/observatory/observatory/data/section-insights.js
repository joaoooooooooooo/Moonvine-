// Headings describe the displayed data, without inventing period comparisons.
export function trendHeadline(change, { up, down, steady, missing = 'There is not enough data to compare yet.' }) {
  if (change === null || change === undefined || !Number.isFinite(Number(change))) return missing;
  return Number(change) > 0 ? up : Number(change) < 0 ? down : steady;
}
export function seriesHeadline(rows, copy) {
  const valid = rows?.filter((row) => Number.isFinite(row.current) && Number.isFinite(row.previous)) ?? [];
  return trendHeadline(valid.length ? valid.reduce((sum, row) => sum + row.current - row.previous, 0) : null, copy);
}
export function leaderHeadline(rows, suffix, empty = 'There is no activity to compare yet.') {
  const valid = rows.filter((row) => Number.isFinite(row.value) && row.value > 0);
  if (!valid.length) return empty;
  const top = Math.max(...valid.map((row) => row.value));
  const leaders = valid.filter((row) => row.value === top);
  return leaders.length === 1 ? leaders[0].label + ' ' + suffix : 'Activity is shared across the leading sources.';
}
export function coverageHeadline(covered, total, { all, most, some, none, empty }) {
  if (!total) return empty;
  return covered === total ? all : covered > total / 2 ? most : covered > 0 ? some : none;
}
