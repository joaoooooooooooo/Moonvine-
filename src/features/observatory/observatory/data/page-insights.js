import { trendHeadline } from './section-insights';

const subjects = {
  ai: ['Your AI visibility increased this week.', 'Your AI visibility fell this week.', 'Your AI visibility held steady this week.'],
  analytics: ['Your website traffic grew this week.', 'Your website traffic fell this week.', 'Your website traffic held steady this week.'],
  search: ['More people found you through search this week.', 'Search brought fewer visitors this week.', 'Search traffic held steady this week.'],
  social: ['Engagement on watched accounts grew this week.', 'Engagement on watched accounts fell this week.', 'Engagement on watched accounts held steady.'],
  news: ['Your media mentions increased this week.', 'Your media mentions fell this week.', 'Your media mentions held steady this week.'],
  website: ['Your site performance improved this week.', 'Your site performance slipped this week.', 'Your site performance held steady this week.'],
  competitors: ['Your search overlap grew this week.', 'Your search overlap narrowed this week.', 'Your search overlap held steady this week.'],
};

export function pageInsight(lens) {
  const copy = subjects[lens?.id];
  if (!copy) return 'Your latest insights are ready.';
  return trendHeadline(lens.delta, { up: copy[0], down: copy[1], steady: copy[2], missing: 'Your first comparison is still taking shape.' });
}

export function overviewInsight(lenses = []) {
  const comparable = lenses.filter(lens => ['ai', 'analytics', 'search', 'website'].includes(lens.id) && lens.delta != null && Number.isFinite(Number(lens.delta)));
  if (!comparable.length) return 'Your first insights will appear here.';
  const up = comparable.filter(lens => Number(lens.delta) > 0).length;
  const down = comparable.filter(lens => Number(lens.delta) < 0).length;
  if (up && down) return 'You made gains, with some areas to watch.';
  if (up) return 'Your digital presence gained ground this week.';
  if (down) return 'Your digital presence lost ground this week.';
  return 'Your digital presence held steady this week.';
}
