import { useEffect, useState } from 'react';
import { Search, Building2, Sun, Moon } from '@/components/ui/icons';
import { Command, CommandDialog, CommandDialogTrigger, CommandDialogPopup, CommandEmpty, CommandInput, CommandItem, CommandList, CommandPanel } from '@/components/ui/command';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { accounts } from '../../data/observatory-fixtures';
import { accountHref } from '../../utils/observatory-model';
import { lensIcons } from '../../data/navigation';
import { shellItems } from './navigation';

// Copied from the prototype's header command pattern, with V2 destinations/actions.
export function SearchCommand({ model }) {
  const [open, setOpen] = useState(false);
  const modifier = /Mac|iPhone|iPad/.test(navigator.platform) ? '\u2318' : 'Ctrl';
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
  const items = [
    ...shellItems.map((item) => ({ ...item, value: item.href })),
    ...accounts.map((account) => ({ label: model.account?.id === account.id ? model.account.name : account.name, value: account.id, href: accountHref(account.id), icon: Building2 })),
    ...model.lenses.map((lens) => ({ label: lens.label, value: lens.sourceId, href: accountHref(model.account.id, lens.sourceId, model.route.period), icon: lensIcons[lens.id] })),
    { label: 'Use light appearance', value: 'light', icon: Sun, theme: false },
    { label: 'Use dark appearance', value: 'dark', icon: Moon, theme: true },
  ];
  function select(item) {
    if (item.href) window.location.hash = item.href.slice(1);
    else model.setDark(item.theme);
    setOpen(false);
  }
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandDialogTrigger aria-label="Search commands" className="inline-flex h-9 w-full items-center rounded-lg bg-sidebar-accent/50 px-3 py-2 text-sm text-sidebar-accent-foreground outline-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring">
        <span className="flex grow items-center">
          <Search aria-hidden="true" className="text-muted-foreground/80 sm:-ms-1 sm:me-3" size={16} />
          <span className="hidden font-normal text-muted-foreground/70 sm:inline">Search</span>
        </span>
        <KbdGroup className="ms-auto hidden lg:flex"><Kbd className="border border-border bg-transparent">{modifier}</Kbd><Kbd className="border border-border bg-transparent">K</Kbd></KbdGroup>
      </CommandDialogTrigger>
      <CommandDialogPopup aria-label="Search Observatory">
        <Command items={items}>
          <CommandInput aria-label="Search pages, accounts, and commands" placeholder="Search pages, accounts, and commands..." />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandPanel><CommandList>{(item) => <CommandItem key={item.value} value={item} onClick={() => select(item)}><item.icon className="size-4 opacity-60" /><span>{item.label}</span></CommandItem>}</CommandList></CommandPanel>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
