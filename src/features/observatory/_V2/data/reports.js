import { accounts } from './observatory-fixtures';

// Local sample reports; no production reports or delivery actions.
const weeks = ['Sep 21–27, 2026', 'Sep 14–20, 2026', 'Sep 7–13, 2026', 'Aug 31–Sep 6, 2026', 'Aug 24–30, 2026', 'Aug 17–23, 2026'];
export const reports = weeks.flatMap((week, index) => accounts.map((account) => ({
  id: `${account.id}-week-${index}`,
  accountId: account.id,
  accountName: account.name,
  initials: account.initials,
  name: `Weekly report · ${week}`,
  week,
  status: 'Published',
  summary: `A weekly review of ${account.name}'s visibility, website activity, and site health.`,
  highlights: [
    'Review how the brand appears in AI answers and organic search.',
    'Compare website visits and engagement across the reporting period.',
    'Prioritize website fixes and review coverage from social and media sources.',
  ],
})));
