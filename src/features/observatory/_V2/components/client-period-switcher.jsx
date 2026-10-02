import { Group, GroupSeparator } from '@/components/ui/group';
import { ReportWeekPicker } from './report-week-picker';
import { ClientSwitcher } from './client-switcher';

export function ClientPeriodSwitcher({ account, accounts, route }) {
  const showPeriod = !['account:summary', 'report:history', 'intelligence:chat'].includes(route.lensId);
  return (
    <Group aria-label={showPeriod ? "Account and report week" : "Account"} className="min-w-0">
      <ClientSwitcher account={account} accounts={accounts} route={route} />
      {showPeriod && <>
        <GroupSeparator />
        <ReportWeekPicker account={account} route={route} />
      </>}
    </Group>
  );
}
