import { reports } from '../data/reports';
import { useReportReadState } from '../hooks/use-report-read-state';
import { Button } from '@/components/ui/button';
import { accountHref } from '../utils/observatory-model';
import { ReportsTable } from './reports-table';

export function LatestReports({ account }) {
  const { isOpened } = useReportReadState(account.id);
  const available = reports.filter((report) => report.accountId === account.id);
  const headline = !available.length ? 'Your first report is still to come.' : available.some((report) => !isOpened(report.id)) ? 'New reports are ready for your review.' : 'You are caught up on your reports.';
  return (
    <section aria-label="Latest reports" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="max-w-[40rem] text-base font-medium">{headline}</h2>
        <Button render={<a href={accountHref(account.id, 'report:history')} />} variant="link" size="sm">View all reports</Button>
      </div>
      <ReportsTable key={account.id} account={account} label="Latest reports" />
    </section>
  );
}
