import { accounts } from './observatory-fixtures';
import { reportWeeks, weekDate, weekLabel } from './report-weeks';
import { reportRecipients } from './report-recipients';

// Local sample reports; no production reports or delivery actions.
const weeks = reportWeeks.map(({ start }) => `${weekLabel(start)}, ${weekDate(start).getFullYear()}`);
export const reports = weeks.flatMap((week, index) => accounts.map((account) => ({
  id: `${account.id}-week-${index}`,
  accountId: account.id,
  accountName: account.name,
  accountImageSrc: account.imageSrc,
  recipients: reportRecipients.slice(0, index % 2 === 0 ? 3 : 2),
  initials: account.initials,
  name: week,
  week,
  status: 'Published',
  opened: index > 1,
  summary: `A weekly review of ${account.name}'s visibility, website activity, and site health.`,
  highlights: [
    'Review how the brand appears in AI answers and organic search.',
    'Compare website visits and engagement across the reporting period.',
    'Prioritize website fixes and review coverage from social and media sources.',
  ],
})));

