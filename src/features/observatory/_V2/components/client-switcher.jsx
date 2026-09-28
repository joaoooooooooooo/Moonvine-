import { ObservatorySelectTrigger as SelectTrigger } from './observatory-select-trigger';
import { UserRound } from 'lucide-react';
import { Select, SelectValue, SelectPopup, SelectItem } from '@/components/ui/select';
import { accountHref } from '../utils/observatory-model';

// COSS p-breadcrumb-7: a small Select embedded in the client breadcrumb.
export function ClientSwitcher({ account, accounts, route }) {
  const items = accounts.map((item) => ({ label: item.name, value: item.id }));
  return (
    <Select items={items} value={account.id} onValueChange={(id) => {
      if (id) window.location.hash = accountHref(id, route.lensId, route.period).slice(1);
    }}>
      <SelectTrigger aria-label="Switch client" size="sm" className="w-fit min-w-0 max-w-28 sm:max-w-52">
        <UserRound aria-hidden="true" className="hidden sm:block" /><SelectValue />
      </SelectTrigger>
      <SelectPopup>{items.map(({ label, value }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectPopup>
    </Select>
  );
}
