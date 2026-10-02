import { PageHeading } from './page-heading';
import { ReportsTable } from './reports-table';

export function ReportHistory({ account }) {
  return <div className="v2-page-sections"><PageHeading title="Review published reports and weekly updates." /><ReportsTable key={account?.id ?? 'all'} account={account} /></div>;
}

