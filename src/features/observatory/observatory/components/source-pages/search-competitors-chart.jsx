import { ScanSearch } from '@/components/ui/icons';
import { CompactBreakdown } from '@/components/ui/compact-breakdown';
import { searchCompetitorBreakdown, searchCompetitorPeriods } from '../../data/search-competitors';

export function SearchCompetitorsChart({ lens, account, period }) {
  const [window, setWindow] = useState('current');
  const data = searchCompetitorBreakdown(lens, account, window, period);
  return <CompactBreakdown
    title="Search competitors"
    showFooter={false}
    icon={<ScanSearch weight="regular" />}
    month={data.month}
    periods={searchCompetitorPeriods}
    period={window}
    onPeriodChange={setWindow}
    totalLabel="Shared search terms"
    items={data.items}
    emptyLabel="No shared search terms in this period."
  />;
}
import { useState } from 'react';
