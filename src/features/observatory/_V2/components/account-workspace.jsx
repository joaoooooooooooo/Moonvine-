import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { accountHref } from '../utils/observatory-model';
import { LatestReports } from './latest-reports';
import { PageHeading } from './page-heading';
import { SectionDivider } from './section-divider';
import { SignalsGrid } from './signals-grid';
import { ReportPreview } from './report-preview';
import { reports } from '../data/reports';

export function AccountWorkspace({ model }) {
  const { account, lenses } = model;
  const [reportOpen, setReportOpen] = useState(false);
  const latestReport = reports.find((report) => report.accountId === account.id);
  return (
    <div className="v2-page-sections">
      <div className="min-w-0 space-y-4">
        <PageHeading title={account.description} />
        <div className="flex flex-wrap items-center gap-3">
          {latestReport && <Button variant="default" onClick={() => setReportOpen(true)}>See last report</Button>}
          <Button render={<a href={accountHref(account.id, 'account:summary')} />} aria-label={'Edit account profile for ' + account.name} variant="secondary">Edit settings<ChevronRight /></Button>
        </div>
      </div>
      <SignalsGrid account={account} lenses={lenses} />
      <SectionDivider />
      <LatestReports account={account} />
      <ReportPreview report={reportOpen ? latestReport : null} onClose={() => setReportOpen(false)} />
    </div>
  );
}

