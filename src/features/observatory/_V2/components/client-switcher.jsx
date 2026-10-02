import { ObservatorySelectTrigger as SelectTrigger } from './observatory-select-trigger';
import { AccountSelectLabel } from './account-select-label';
import { Select, SelectValue, SelectPopup, SelectItem } from '@/components/ui/select';
import { chatHref } from '../hooks/use-chat-threads';
import { accountHref } from '../utils/observatory-model';

// COSS p-select-19 profile labels, retaining the compact Observatory trigger.
export function ClientSwitcher({ account, accounts, route }) {
  const items = accounts.map((item) => ({ label: item.name, value: item.id }));
  return (
    <Select items={items} value={account.id} onValueChange={(id) => {
      if (id) window.location.hash = (route.lensId === 'intelligence:chat' ? chatHref(id) : accountHref(id, route.lensId, route.period)).slice(1);
    }}>
      <SelectTrigger aria-label="Switch client" size="sm" className="w-fit min-w-0 max-w-28 sm:max-w-52">
        <SelectValue><AccountSelectLabel account={account} /></SelectValue>
      </SelectTrigger>
      <SelectPopup>{accounts.map((item) => <SelectItem key={item.id} value={item.id}><AccountSelectLabel account={item} /></SelectItem>)}</SelectPopup>
    </Select>
  );
}
