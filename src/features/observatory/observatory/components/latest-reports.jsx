import { Button } from '@/components/ui/button';
import { accountHref } from '../utils/observatory-model';
import { ReportsTable } from './reports-table';

export function LatestReports({ account }) {
  return (
    <section aria-label="Latest reports" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-medium">Latest reports</h2>
        <Button render={<a href={accountHref(account.id, 'report:history')} />} variant="link" size="sm">View all reports</Button>
      </div>
      <ReportsTable key={account.id} account={account} pageSize={3} label="Latest reports" />
    </section>
  );
}
