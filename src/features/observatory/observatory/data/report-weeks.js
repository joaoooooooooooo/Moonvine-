// Weekly demo reports, shared by history and the single-report picker.
export const reportWeeks = ['2026-09-21', '2026-09-14', '2026-09-07', '2026-08-31', '2026-08-24', '2026-08-17'].map((start, index) => ({
  start,
  value: index === 0 ? 'current' : index === 1 ? 'previous' : start,
  offset: index,
}));

export function weekDate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

export function weekLabel(start) {
  const first = weekDate(start);
  const last = new Date(first);
  last.setDate(last.getDate() + 6);
  const format = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
  return `${format.format(first)} – ${format.format(last)}`;
}

export function weeksInMonth(month) {
  const day = new Date(month.getFullYear(), month.getMonth(), 1, 12);
  day.setDate(1 + (8 - day.getDay()) % 7);
  const weeks = [];
  while (day.getMonth() === month.getMonth()) {
    const start = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    weeks.push({ start, report: reportWeeks.find((week) => week.start === start) });
    day.setDate(day.getDate() + 7);
  }
  return weeks;
}
