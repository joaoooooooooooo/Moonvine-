import { PageHeading } from './page-heading';
import { ReportsTable } from './reports-table';
import { reports } from '../data/reports';
import { useReportReadState } from '../hooks/use-report-read-state';

export function ReportHistory({ account }) {
  const { isOpened } = useReportReadState(account?.id);
  const unopened = reports.filter((report) => (!account || report.accountId === account.id) && !isOpened(report.id)).length;
  return <div className="v2-page-sections">
    <div className="space-y-2">
      <PageHeading title="Review published reports and weekly updates." />
      <p className="max-w-[36ch] text-base leading-6 text-muted-foreground">{unopened === 1 ? '1 report has not been opened yet.' : `${unopened} reports have not been opened yet.`}</p>
    </div>
    <ReportsTable key={account?.id ?? 'all'} account={account} />
  </div>;
}

