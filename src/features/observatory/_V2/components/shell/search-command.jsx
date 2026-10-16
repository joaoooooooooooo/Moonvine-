import { Fragment, useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, Moon, Search, ShieldCheckIcon, Sparkles, Sun } from '@/components/ui/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Command, CommandCollection, CommandDialog, CommandDialogTrigger, CommandDialogPopup, CommandEmpty, CommandFooter, CommandGroup, CommandGroupLabel, CommandInput, CommandItem, CommandList, CommandPanel, CommandSeparator } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTab } from '@/components/ui/tabs';
import { accounts } from '../../data/observatory-fixtures';
import { dataSourceSections } from '../../data/data-source-navigation';
import { intelligenceItems } from '../../data/intelligence-navigation';
import { accountHref } from '../../utils/observatory-model';
import { shellItems } from './navigation';

const mockAnswer = 'I can help you find reports, review source performance, manage workspace data, or navigate to any Observatory page. This prototype keeps the answer local and does not send your question to an external service.';

export function SearchCommand({ model }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiMode, setAiMode] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [response, setResponse] = useState('');
  const [generating, setGenerating] = useState(false);
  const timerRef = useRef(null);
  const modifier = /Mac|iPhone|iPad/.test(navigator.platform) ? '\u2318' : 'Ctrl';

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === 'Escape' && open && aiMode) {
        event.preventDefault();
        setAiMode(false);
        setAiQuery('');
        setResponse('');
      }
    }
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [aiMode, open]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const groups = [
    {
      value: 'Navigation',
      items: shellItems.filter((item) => item.label !== 'Intelligence' && item.label !== 'Data Sources').map((item) => ({ ...item, value: item.href })),
    },
    {
      value: 'Workspaces',
      items: accounts.map((account) => ({ label: model.account?.id === account.id ? model.account.name : account.name, value: account.id, href: accountHref(account.id), imageSrc: account.imageSrc, initials: account.initials })),
    },
    {
      value: 'Intelligence',
      items: intelligenceItems.map((item) => ({ label: item.label, value: `intelligence-${item.lens || 'overview'}`, href: accountHref(model.selectedAccountId, item.lens, model.route.period), icon: item.icon })),
    },
    {
      value: 'Data Sources',
      items: dataSourceSections.map((item) => ({ label: item.label, value: `data-source-${item.id}`, href: `#/console/data-sources/${item.id}`, icon: item.icon })),
    },
    {
      value: 'Settings',
      items: [{ label: 'Access', value: 'settings-access', href: '#/console/data-sources/access', icon: ShieldCheckIcon }],
    },
    {
      value: 'Appearance',
      items: [{ label: 'Light or dark appearance', value: 'appearance' }],
    },
  ];

  function reset() {
    window.clearTimeout(timerRef.current);
    setSearchQuery('');
    setAiMode(false);
    setAiQuery('');
    setSubmittedQuery('');
    setResponse('');
    setGenerating(false);
  }

  function select(item) {
    if (item.href) window.location.hash = item.href.slice(1);
    else model.setDark(item.theme);
    setOpen(false);
  }

  function filterItem(item, query) {
    if (!item || typeof item !== 'object') return false;
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return !normalizedQuery || item.label?.toLocaleLowerCase().includes(normalizedQuery) || item.value?.toLocaleLowerCase().includes(normalizedQuery);
  }

  function enterAiMode() {
    setAiQuery(searchQuery);
    setAiMode(true);
  }

  function askAi() {
    const query = aiQuery.trim();
    if (!query || generating) return;
    setSubmittedQuery(query);
    setAiQuery('');
    setResponse('');
    setGenerating(true);
    timerRef.current = window.setTimeout(() => {
      setResponse(mockAnswer);
      setGenerating(false);
    }, 900);
  }

  return (
    <CommandDialog open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) reset(); }}>
      <CommandDialogTrigger aria-label="Search commands" className="inline-flex h-9 w-full items-center rounded-lg bg-sidebar-accent/50 px-3 py-2 text-sm text-sidebar-accent-foreground outline-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring">
        <span className="flex grow items-center">
          <Search aria-hidden="true" className="text-muted-foreground/80 sm:-ms-1 sm:me-3" size={16} />
          <span className="hidden font-normal text-muted-foreground/70 sm:inline">Search or ask AI</span>
        </span>
        <KbdGroup className="ms-auto hidden lg:flex"><Kbd className="border border-border bg-transparent">{modifier}</Kbd><Kbd className="border border-border bg-transparent">K</Kbd></KbdGroup>
      </CommandDialogTrigger>
      <CommandDialogPopup aria-label="Search Observatory or ask AI" className={aiMode ? 'h-[32rem]' : ''}>
        {!aiMode ? <Command filter={filterItem} items={groups}>
          <div className="relative flex items-center *:first:flex-1">
            <CommandInput aria-label="Search pages, workspaces, and commands" placeholder="Type a command or search..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} onKeyDown={(event) => {
              if (event.key === 'Tab') {
                event.preventDefault();
                enterAiMode();
              }
            }} />
            <Button className="me-2.5 rounded-md not-hover:text-muted-foreground text-sm sm:text-xs" onClick={enterAiMode} size="sm" variant="ghost"><Sparkles aria-hidden="true" />Ask AI<Kbd className="ms-0.5 -me-1.5">Tab</Kbd></Button>
          </div>
          <CommandEmpty>No results found. Press Tab to ask AI.</CommandEmpty>
          <CommandPanel>
            <CommandList>
              {(group) => <Fragment key={group.value}>
                {group.value === 'Appearance' ? <CommandGroup items={group.items}>
                  <CommandGroupLabel>{group.value}</CommandGroupLabel>
                  <div className="px-2 pb-1.5">
                    <Tabs aria-label="Appearance" size="sm" value={model.dark ? 'dark' : 'light'} onValueChange={(value) => model.setDark(value === 'dark')}>
                      <TabsList>
                        <TabsTab aria-label="Use light appearance" title="Light" value="light"><Sun aria-hidden="true" /></TabsTab>
                        <TabsTab aria-label="Use dark appearance" title="Dark" value="dark"><Moon aria-hidden="true" /></TabsTab>
                      </TabsList>
                    </Tabs>
                  </div>
                </CommandGroup> : <CommandGroup items={group.items}>
                  <CommandGroupLabel>{group.value}</CommandGroupLabel>
                  <CommandCollection>
                    {(item) => <CommandItem key={item.value} value={item} onClick={() => select(item)}>
                      {item.imageSrc ? <Avatar className="me-1 size-5"><AvatarImage alt="" src={item.imageSrc} /><AvatarFallback>{item.initials}</AvatarFallback></Avatar> : <item.icon className="size-4 opacity-60" />}
                      <span>{item.label}</span>
                    </CommandItem>}
                  </CommandCollection>
                </CommandGroup>}
                <CommandSeparator />
              </Fragment>}
            </CommandList>
          </CommandPanel>
          <CommandFooter><span>Search pages, workspaces, and sources</span><span className="flex items-center gap-2"><Kbd>Esc</Kbd>Close</span></CommandFooter>
        </Command> : <Command>
          <div className="flex items-center px-2.5 py-1.5">
            <div className="relative flex-1">
              <Sparkles aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input autoFocus aria-label="AI query" className="border-transparent bg-transparent shadow-none before:hidden *:data-[slot=input]:ps-9" disabled={generating} placeholder="Ask AI anything..." size="lg" value={aiQuery} onChange={(event) => setAiQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') askAi(); }} />
            </div>
            <Button className="ms-2 rounded-md not-hover:text-muted-foreground text-sm sm:text-xs" onClick={() => { setAiMode(false); setAiQuery(''); setResponse(''); }} size="sm" variant="ghost"><ArrowLeftIcon aria-hidden="true" />Back to search<Kbd className="ms-0.5 -me-1.5">Esc</Kbd></Button>
          </div>
          <CommandPanel className="flex-1">
            <ScrollArea overscrollContain scrollbarGutter scrollFade>
              <div className="p-5">
                {!generating && !response && <p className="py-12 text-center text-muted-foreground text-sm">Ask about reports, sources, workspaces, or anything in Observatory.</p>}
                {generating && <div className="flex items-center gap-2 text-muted-foreground text-sm"><Spinner className="size-4" />Generating response...</div>}
                {response && <div aria-live="polite" className="space-y-4 text-sm leading-6"><p>{response}</p><div className="flex flex-wrap gap-2"><Button size="sm" variant="secondary" render={<a href="#/console/reports" />}>Open reports</Button><Button size="sm" variant="secondary" render={<a href="#/console/data-sources/organization" />}>Manage data sources</Button></div></div>}
              </div>
            </ScrollArea>
          </CommandPanel>
          <CommandFooter>{generating ? <span className="flex items-center gap-2"><Spinner className="size-3" />Generating response...</span> : response ? <span className="truncate">You asked: “{submittedQuery}”</span> : <span className="flex items-center gap-2"><Kbd>Enter</Kbd>Ask AI</span>}</CommandFooter>
        </Command>}
      </CommandDialogPopup>
    </CommandDialog>
  );
}
