import { Group, GroupSeparator } from '@/components/ui/group';
import { Select, SelectValue, SelectPopup, SelectItem } from '@/components/ui/select';
import { ObservatorySelectTrigger } from './observatory-select-trigger';
import { ClientSwitcher } from './client-switcher';
import { periods } from '../data/observatory-fixtures';
import { accountHref } from '../utils/observatory-model';

export function ClientPeriodSwitcher({ account, accounts, route }) {
  const showPeriod = !['account:summary', 'report:history'].includes(route.lensId);
  return (
    <Group aria-label="Account and report week" className="min-w-0">
      <ClientSwitcher account={account} accounts={accounts} route={route} />
      {showPeriod && <>
        <GroupSeparator />
        <Select items={periods} value={route.period} onValueChange={(period) => {
          if (period) window.location.hash = accountHref(account.id, route.lensId, period).slice(1);
        }}>
          <ObservatorySelectTrigger aria-label="Report week" size="sm" className="w-fit min-w-0 max-w-28 sm:max-w-48"><SelectValue /></ObservatorySelectTrigger>
          <SelectPopup>{periods.map(({ label, value }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectPopup>
        </Select>
      </>}
    </Group>
  );
}
