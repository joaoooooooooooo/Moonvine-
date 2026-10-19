import { Group, GroupSeparator } from '@/components/ui/group';
import { ReportWeekPicker } from './report-week-picker';
import { ClientSwitcher } from './client-switcher';

export function ClientPeriodSwitcher({ account, accounts, route }) {
  const showPeriod = route.path !== '/console/reports' && !['account:summary', 'report:history', 'intelligence:chat'].includes(route.lensId);
  return (
    <Group aria-label={showPeriod ? "Workspace and report week" : "Workspace"} className="min-w-0">
      <ClientSwitcher account={account} accounts={accounts} route={route} />
      {showPeriod && <>
        <GroupSeparator />
        <ReportWeekPicker account={account} route={route} />
      </>}
    </Group>
  );
}
